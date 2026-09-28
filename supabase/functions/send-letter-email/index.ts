const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanFilename(name: string) {
  return String(name || "document.pdf")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120);
}

function normalizeBase64(value: unknown): string {
  if (typeof value !== "string") return "";

  let s = value.trim();

  // Remove data URL prefix if present
  if (s.startsWith("data:")) {
    const comma = s.indexOf(",");
    if (comma >= 0) {
      s = s.slice(comma + 1);
    }
  }

  // Remove whitespace/newlines
  return s.replace(/\s+/g, "");
}

function isValidBase64(value: string) {
  if (!value) return false;
  if (value.length < 100) return false;

  // Basic Base64 validation
  return /^[A-Za-z0-9+/]*={0,2}$/.test(value);
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 30000,
) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  // -----------------------------
  // CORS
  // -----------------------------
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  // -----------------------------
  // METHOD
  // -----------------------------
  if (req.method !== "POST") {
    return json(
      {
        error: "Only POST requests are allowed.",
      },
      405,
    );
  }

  try {
    console.log("send-letter-email: request received");

    // -----------------------------
    // AUTHORIZATION
    // -----------------------------
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      console.error("AUTH ERROR: Authorization header missing");

      return json(
        {
          error: "Authorization header is missing.",
        },
        401,
      );
    }

    // -----------------------------
    // RESEND KEY
    // -----------------------------
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("CONFIG ERROR: RESEND_API_KEY is missing");

      return json(
        {
          error: "Email service is not configured. RESEND_API_KEY is missing.",
        },
        500,
      );
    }

    // -----------------------------
    // READ BODY
    // -----------------------------
    let body: any;

    try {
      body = await req.json();
    } catch (err) {
      console.error("JSON ERROR:", err);

      return json(
        {
          error: "Invalid JSON request body.",
        },
        400,
      );
    }

    const to = String(body?.to || "").trim();
    const subject =
      String(body?.subject || "SS Enterprises Letter").trim();

    const employeeName =
      String(body?.employeeName || "Employee").trim();

    const employeeCode =
      String(body?.employeeCode || "").trim();

    const letterType =
      String(body?.letterType || "letter").trim().toLowerCase();

    const attachmentsInput = Array.isArray(body?.attachments)
      ? body.attachments
      : [];

    /*
      Existing admin.js sends termsContent.
      Newer admin.js may send termsUrl.
      We support both.
    */
    const termsContentInput =
      typeof body?.termsContent === "string"
        ? body.termsContent
        : "";

    const termsUrl =
      typeof body?.termsUrl === "string"
        ? body.termsUrl.trim()
        : "";

    console.log("REQUEST INFO:", {
      to,
      employeeName,
      employeeCode,
      letterType,
      attachmentCount: attachmentsInput.length,
      termsContentLength: termsContentInput.length,
      termsUrl: termsUrl ? "provided" : "not provided",
    });

    // -----------------------------
    // EMAIL VALIDATION
    // -----------------------------
    if (!isValidEmail(to)) {
      console.error("VALIDATION ERROR: Invalid recipient email");

      return json(
        {
          error: `Invalid employee email address: ${to || "empty"}`,
        },
        400,
      );
    }

    // -----------------------------
    // LETTER ATTACHMENT
    // -----------------------------
    if (attachmentsInput.length === 0) {
      console.error("VALIDATION ERROR: No letter attachment");

      return json(
        {
          error: "Letter PDF attachment is missing.",
        },
        400,
      );
    }

    const safeAttachments: any[] = [];

    // -----------------------------
    // PROCESS LETTER PDF
    // -----------------------------
    for (const item of attachmentsInput) {
      const filename = cleanFilename(
        item?.filename || "SS-Enterprises-Letter.pdf",
      );

      const content = normalizeBase64(item?.content);

      if (!isValidBase64(content)) {
        console.error(
          "VALIDATION ERROR: Invalid PDF Base64",
          filename,
          content.length,
        );

        return json(
          {
            error: `Invalid PDF attachment: ${filename}`,
          },
          400,
        );
      }

      safeAttachments.push({
        filename,
        content,
      });
    }

    // ============================================================
    // TERMS & CONDITIONS
    // ============================================================

    if (letterType === "offer") {
      let finalTermsBase64 = "";

      /*
        OPTION 1:
        Existing admin.js already sends termsContent.
      */
      if (isValidBase64(normalizeBase64(termsContentInput))) {
        finalTermsBase64 = normalizeBase64(termsContentInput);

        console.log(
          "T&C source: termsContent from frontend",
          finalTermsBase64.length,
        );
      }

      /*
        OPTION 2:
        If termsContent is not supplied, fetch original PDF
        directly from SS Enterprises website.
      */
      if (!finalTermsBase64) {
        const publicTermsUrl =
          termsUrl ||
          "https://ss-enterprises-website.onrender.com/SS_Enterprises_Terms_and_Conditions.pdf";

        console.log(
          "T&C source: website",
          publicTermsUrl,
        );

        try {
          const tcResponse = await fetchWithTimeout(
            publicTermsUrl,
            {
              method: "GET",
              headers: {
                Accept: "application/pdf,*/*",
              },
            },
            30000,
          );

          if (!tcResponse.ok) {
            console.error(
              "T&C FETCH ERROR:",
              tcResponse.status,
              tcResponse.statusText,
            );

            return json(
              {
                error:
                  `Terms & Conditions PDF could not be fetched. ` +
                  `Website returned HTTP ${tcResponse.status}.`,
              },
              502,
            );
          }

          const contentType =
            tcResponse.headers.get("content-type") || "";

          const buffer = await tcResponse.arrayBuffer();

          if (!buffer || buffer.byteLength < 100) {
            console.error(
              "T&C FETCH ERROR: Empty or invalid PDF",
              buffer?.byteLength,
            );

            return json(
              {
                error:
                  "Terms & Conditions PDF downloaded from website is empty or invalid.",
              },
              502,
            );
          }

          const bytes = new Uint8Array(buffer);

          finalTermsBase64 = uint8ArrayToBase64(bytes);

          console.log(
            "T&C downloaded successfully:",
            {
              bytes: buffer.byteLength,
              base64Length: finalTermsBase64.length,
              contentType,
            },
          );
        } catch (err) {
          console.error("T&C FETCH EXCEPTION:", err);

          return json(
            {
              error:
                "Could not download the Terms & Conditions PDF from the SS Enterprises website.",
            },
            502,
          );
        }
      }

      if (!isValidBase64(finalTermsBase64)) {
        console.error(
          "T&C ERROR: Final Terms PDF Base64 is invalid",
        );

        return json(
          {
            error:
              "Terms & Conditions PDF is invalid or could not be prepared.",
          },
          400,
        );
      }

      safeAttachments.push({
        filename: "SS_Enterprises_Terms_and_Conditions.pdf",
        content: finalTermsBase64,
      });
    }

    // ============================================================
    // EMAIL HTML
    // ============================================================

    const typeLabel =
      letterType === "offer"
        ? "Offer Letter"
        : letterType === "joining"
          ? "Joining Letter"
          : letterType === "warning"
            ? "Warning Letter"
            : letterType === "termination"
              ? "Termination Letter"
              : "Official Letter";

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>SS Enterprises - ${typeLabel}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f6f8;
  font-family:Arial,Helvetica,sans-serif;
">

<div style="
  max-width:680px;
  margin:30px auto;
  background:#ffffff;
  border:1px solid #dfe3e8;
  border-radius:10px;
  overflow:hidden;
">

  <div style="
    background:#08234a;
    color:#ffffff;
    padding:22px 26px;
  ">
    <div style="
      font-size:22px;
      font-weight:700;
    ">
      SS ENTERPRISES
    </div>

    <div style="
      margin-top:5px;
      font-size:13px;
      opacity:.9;
    ">
      Official Employee Communication
    </div>
  </div>

  <div style="
    padding:28px 26px;
    color:#222222;
  ">

    <p style="font-size:15px;">
      Dear <strong>${employeeName}</strong>,
    </p>

    <p style="
      font-size:15px;
      line-height:1.7;
    ">
      Please find attached your
      <strong>${typeLabel}</strong>
      issued by SS Enterprises.
    </p>

    ${
      employeeCode
        ? `
    <p style="
      font-size:14px;
      line-height:1.7;
    ">
      <strong>Employee Code:</strong>
      ${employeeCode}
    </p>
    `
        : ""
    }

    ${
      letterType === "offer"
        ? `
    <p style="
      font-size:14px;
      line-height:1.7;
    ">
      The original
      <strong>Terms & Conditions PDF</strong>
      is also attached with this email.
    </p>
    `
        : ""
    }

    <p style="
      font-size:14px;
      line-height:1.7;
    ">
      Kindly keep the attached document for your official records.
    </p>

    <p style="
      margin-top:28px;
      font-size:14px;
      line-height:1.6;
    ">
      Regards,<br>
      <strong>SS Enterprises</strong><br>
      Donar Road, Darbhanga<br>
      +91 73600 25302
    </p>

  </div>

  <div style="
    border-top:1px solid #e5e7eb;
    padding:14px 26px;
    font-size:11px;
    color:#6b7280;
    text-align:center;
  ">
    This is an official automated communication from SS Enterprises.
  </div>

</div>

</body>
</html>
`;

    // ============================================================
    // RESEND API
    // ============================================================

    const resendPayload = {
      from: "SS Enterprises <onboarding@resend.dev>",
      reply_to: ["ssenterprisesservice@proton.me"],
      to: [to],
      subject,
      html,
      attachments: safeAttachments,
    };

    console.log(
      "Sending email through Resend:",
      {
        to,
        attachmentCount: safeAttachments.length,
        attachmentNames: safeAttachments.map(
          (x) => x.filename,
        ),
      },
    );

    const resendResponse = await fetchWithTimeout(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendPayload),
      },
      30000,
    );

    let resendResult: any = {};

    try {
      resendResult = await resendResponse.json();
    } catch (_) {
      resendResult = {};
    }

    // ============================================================
    // RESEND ERROR
    // ============================================================

    if (!resendResponse.ok) {
      console.error(
        "RESEND API ERROR:",
        {
          status: resendResponse.status,
          result: resendResult,
        },
      );

      return json(
        {
          error:
            resendResult?.message ||
            resendResult?.error ||
            `Resend returned HTTP ${resendResponse.status}.`,
          resend_status: resendResponse.status,
        },
        resendResponse.status,
      );
    }

    // ============================================================
    // SUCCESS
    // ============================================================

    console.log(
      "EMAIL SENT SUCCESSFULLY:",
      resendResult,
    );

    return json(
      {
        success: true,
        message:
          letterType === "offer"
            ? "Offer Letter and Terms & Conditions sent successfully."
            : `${typeLabel} sent successfully.`,
        id: resendResult?.id || null,
      },
      200,
    );
  } catch (error) {
    console.error(
      "SEND LETTER FUNCTION ERROR:",
      error,
    );

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected email service error.",
      },
      500,
    );
  }
});

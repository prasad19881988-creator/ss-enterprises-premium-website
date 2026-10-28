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

  if (s.startsWith("data:")) {
    const comma = s.indexOf(",");
    if (comma >= 0) {
      s = s.slice(comma + 1);
    }
  }

  return s.replace(/\s+/g, "");
}

function isValidBase64(value: string) {
  if (!value || value.length < 100) return false;

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
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only POST is allowed
  if (req.method !== "POST") {
    return json(
      { error: "Only POST requests are allowed." },
      405,
    );
  }

  try {
    console.log("send-letter-email: request received");

    // Authorization header
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return json(
        { error: "Authorization header is missing." },
        401,
      );
    }

    // Resend API key must be configured in Supabase Secrets
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is missing");

      return json(
        {
          error:
            "Email service is not configured. RESEND_API_KEY is missing.",
        },
        500,
      );
    }

    // Read request body
    let body: any;

    try {
      body = await req.json();
    } catch {
      return json(
        { error: "Invalid JSON request body." },
        400,
      );
    }

    const to = String(body?.to || "").trim();

    const subject = String(
      body?.subject || "SS Enterprises Letter",
    ).trim();

    const employeeName = String(
      body?.employeeName || "Employee",
    ).trim();

    const employeeCode = String(
      body?.employeeCode || "",
    ).trim();

    const letterType = String(
      body?.letterType || "letter",
    ).trim().toLowerCase();

    const attachmentsInput = Array.isArray(body?.attachments)
      ? body.attachments
      : [];

    console.log("Request details:", {
      employeeName,
      employeeCode,
      letterType,
      attachmentCount: attachmentsInput.length,
    });

    // Validate recipient
    if (!isValidEmail(to)) {
      return json(
        { error: "Invalid employee email address." },
        400,
      );
    }

    // Letter PDF is mandatory
    if (attachmentsInput.length === 0) {
      return json(
        { error: "Letter PDF attachment is missing." },
        400,
      );
    }

    const safeAttachments: Array<{
      filename: string;
      content: string;
    }> = [];

    // Process the letter attachment(s)
    for (const item of attachmentsInput) {
      const filename = cleanFilename(
        item?.filename || "SS-Enterprises-Letter.pdf",
      );

      const content = normalizeBase64(item?.content);

      if (!isValidBase64(content)) {
        console.error("Invalid attachment:", filename);

        return json(
          { error: `Invalid PDF attachment: ${filename}` },
          400,
        );
      }

      safeAttachments.push({
        filename,
        content,
      });
    }

    // =========================================================
    // TERMS & CONDITIONS
    // Always download the current PDF from the company website.
    // Do not use old termsContent supplied by admin.js.
    // =========================================================

    if (letterType === "offer") {
      const publicTermsUrl =
        "https://ss-enterprises-website.onrender.com/SS_Enterprises_Terms_and_Conditions.pdf";

      console.log("Downloading current Terms & Conditions PDF");

      try {
        const tcResponse = await fetchWithTimeout(
          publicTermsUrl,
          {
            method: "GET",
            headers: {
              Accept: "application/pdf",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          },
          30000,
        );

        if (!tcResponse.ok) {
          console.error(
            "Terms PDF download failed:",
            tcResponse.status,
            tcResponse.statusText,
          );

          return json(
            {
              error:
                `Terms & Conditions PDF download failed. ` +
                `Website returned HTTP ${tcResponse.status}.`,
            },
            502,
          );
        }

        const buffer = await tcResponse.arrayBuffer();

        if (buffer.byteLength < 100) {
          return json(
            {
              error:
                "Terms & Conditions PDF is empty or invalid.",
            },
            502,
          );
        }

        const bytes = new Uint8Array(buffer);

        // Check PDF signature
        const signature = String.fromCharCode(
          bytes[0],
          bytes[1],
          bytes[2],
          bytes[3],
          bytes[4],
        );

        if (signature !== "%PDF-") {
          console.error(
            "Downloaded file is not a PDF:",
            signature,
          );

          return json(
            {
              error:
                "The website did not return a valid PDF. Check the uploaded company PDF.",
            },
            502,
          );
        }

        const termsBase64 = uint8ArrayToBase64(bytes);

        if (!isValidBase64(termsBase64)) {
          return json(
            {
              error:
                "Terms & Conditions PDF could not be prepared.",
            },
            502,
          );
        }

        // Attach only the PDF fetched above.
        safeAttachments.push({
          filename: "SS_Enterprises_Terms_and_Conditions.pdf",
          content: termsBase64,
        });

        console.log("Current Terms PDF attached:", {
          bytes: buffer.byteLength,
          attachmentCount: safeAttachments.length,
        });
      } catch (error) {
        console.error(
          "Terms PDF download exception:",
          error,
        );

        return json(
          {
            error:
              "Could not download the Terms & Conditions PDF from the company website.",
          },
          502,
        );
      }
    }

    // =========================================================
    // EMAIL CONTENT
    // =========================================================

    const typeLabels: Record<string, string> = {
      offer: "Offer Letter",
      joining: "Joining Letter",
      warning: "Warning Letter",
      termination: "Termination Letter",
    };

    const typeLabel =
      typeLabels[letterType] || "Official Letter";

    // Escape user-supplied values before inserting into HTML
    function escapeHtml(value: string) {
      return value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };

        return entities[character];
      });
    }

    const safeEmployeeName = escapeHtml(employeeName);
    const safeEmployeeCode = escapeHtml(employeeCode);
    const safeTypeLabel = escapeHtml(typeLabel);

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>SS Enterprises - ${safeTypeLabel}</title>
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
    <div style="font-size:22px;font-weight:700;">
      SS ENTERPRISES
    </div>
    <div style="margin-top:5px;font-size:13px;">
      Official Employee Communication
    </div>
  </div>

  <div style="padding:28px 26px;color:#222222;">
    <p style="font-size:15px;">
      Dear <strong>${safeEmployeeName}</strong>,
    </p>

    <p style="font-size:15px;line-height:1.7;">
      Please find attached your
      <strong>${safeTypeLabel}</strong>
      issued by SS Enterprises.
    </p>

    ${
      safeEmployeeCode
        ? `<p style="font-size:14px;line-height:1.7;">
             <strong>Employee Code:</strong>
             ${safeEmployeeCode}
           </p>`
        : ""
    }

    ${
      letterType === "offer"
        ? `<p style="font-size:14px;line-height:1.7;">
             The current Terms & Conditions PDF is also attached
             with this email.
           </p>`
        : ""
    }

    <p style="font-size:14px;line-height:1.7;">
      Kindly keep the attached documents for your official records.
    </p>

    <p style="margin-top:28px;font-size:14px;line-height:1.6;">
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

    // =========================================================
    // SEND EMAIL THROUGH RESEND
    // =========================================================

    const resendPayload = {
      from: "SS Enterprises <no-reply@ssenterprisesservice.online>",
      reply_to: ["info@ssenterprisesservice.online"],
      to: [to],
      subject,
      html,
      attachments: safeAttachments,
    };

    console.log("Sending email:", {
      attachmentCount: safeAttachments.length,
      attachmentNames: safeAttachments.map(
        (attachment) => attachment.filename,
      ),
    });

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
    } catch {
      resendResult = {};
    }

    if (!resendResponse.ok) {
      console.error("Resend API error:", {
        status: resendResponse.status,
        result: resendResult,
      });

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

    console.log("Email sent successfully:", {
      id: resendResult?.id || null,
    });

    return json(
      {
        success: true,
        message:
          letterType === "offer"
            ? "Offer Letter and current Terms & Conditions sent successfully."
            : `${typeLabel} sent successfully.`,
        id: resendResult?.id || null,
      },
      200,
    );
  } catch (error) {
    console.error("Send letter function error:", error);

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function escapeHtml(value: string) {
  return String(value).replace(/[&<>'"]/g, (ch) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return map[ch] || ch;
  });
}

function cleanFilename(value: string, fallback: string) {
  const name = String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-");

  return name || fallback;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBase64(value: string) {
  if (!value) return false;

  const cleaned = value
    .replace(/^data:application\/pdf;base64,/i, "")
    .replace(/\s/g, "");

  if (!cleaned || cleaned.length < 100) {
    return false;
  }

  try {
    atob(cleaned);
    return true;
  } catch {
    return false;
  }
}

function normalizeBase64(value: string) {
  return String(value || "")
    .replace(/^data:application\/pdf;base64,/i, "")
    .replace(/\s/g, "");
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  /*
    ----------------------------------------
    CORS
    ----------------------------------------
  */

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  /*
    ----------------------------------------
    ONLY POST ALLOWED
    ----------------------------------------
  */

  if (req.method !== "POST") {
    return json(
      {
        ok: false,
        error: "Method not allowed.",
      },
      405,
    );
  }

  try {
    /*
      ----------------------------------------
      AUTH CHECK
      ----------------------------------------
    */

    const authorization =
      req.headers.get("Authorization") ||
      req.headers.get("authorization") ||
      "";

    if (!authorization) {
      return json(
        {
          ok: false,
          error: "Authentication required. Please login again.",
        },
        401,
      );
    }

    /*
      ----------------------------------------
      RESEND API KEY
      ----------------------------------------
    */

    const resendKey =
      Deno.env.get("RESEND_API_KEY") || "";

    if (!resendKey) {
      console.error(
        "RESEND_API_KEY is missing.",
      );

      return json(
        {
          ok: false,
          error:
            "RESEND_API_KEY is not configured in Supabase Secrets.",
        },
        500,
      );
    }

    /*
      ----------------------------------------
      READ REQUEST BODY
      ----------------------------------------
    */

    let body: any;

    try {
      body = await req.json();
    } catch {
      return json(
        {
          ok: false,
          error: "Invalid JSON request body.",
        },
        400,
      );
    }

    /*
      ----------------------------------------
      MAIN VALUES
      ----------------------------------------
    */

    const to = String(
      body?.to || "",
    ).trim();

    const subject = String(
      body?.subject ||
        "SS Enterprises Letter",
    ).trim();

    const employeeName = String(
      body?.employeeName ||
        "Employee",
    ).trim();

    const employeeCode = String(
      body?.employeeCode || "",
    ).trim();

    const letterType = String(
      body?.letterType ||
        "letter",
    ).trim().toLowerCase();

    const attachmentsInput =
      Array.isArray(body?.attachments)
        ? body.attachments
        : [];

    const termsContent = String(
      body?.termsContent || "",
    ).trim();

    /*
      ----------------------------------------
      VALIDATE EMAIL
      ----------------------------------------
    */

    if (!isValidEmail(to)) {
      return json(
        {
          ok: false,
          error:
            "Invalid staff email address.",
        },
        400,
      );
    }

    /*
      ----------------------------------------
      LETTER PDF REQUIRED
      ----------------------------------------
    */

    if (
      !attachmentsInput.length
    ) {
      return json(
        {
          ok: false,
          error:
            "Letter PDF attachment is missing.",
        },
        400,
      );
    }

    /*
      The frontend normally sends
      exactly one main Letter PDF.
    */

    const letter =
      attachmentsInput[0];

    const letterContent =
      String(
        letter?.content || "",
      ).trim();

    if (!letterContent) {
      return json(
        {
          ok: false,
          error:
            "Letter PDF content is empty.",
        },
        400,
      );
    }

    if (
      !isValidBase64(letterContent)
    ) {
      return json(
        {
          ok: false,
          error:
            "Letter PDF attachment is not valid Base64.",
        },
        400,
      );
    }

    /*
      ----------------------------------------
      PREPARE LETTER ATTACHMENT
      ----------------------------------------
    */

    const safeAttachments: any[] = [];

    safeAttachments.push({
      filename: cleanFilename(
        letter?.filename,
        "SS-Enterprises-Letter.pdf",
      ),

      content:
        normalizeBase64(
          letterContent,
        ),

      content_type:
        "application/pdf",
    });

    /*
      ----------------------------------------
      OFFER LETTER
      ----------------------------------------

      Offer Letter requires the
      Terms & Conditions PDF too.
    */

    if (
      letterType === "offer"
    ) {
      if (!termsContent) {
        return json(
          {
            ok: false,
            error:
              "Terms & Conditions PDF is missing. Please generate the Offer Letter again.",
          },
          400,
        );
      }

      if (
        !isValidBase64(
          termsContent,
        )
      ) {
        return json(
          {
            ok: false,
            error:
              "Terms & Conditions PDF is not valid Base64.",
          },
          400,
        );
      }

      safeAttachments.push({
        filename:
          "SS-Enterprises-Terms-and-Conditions.pdf",

        content:
          normalizeBase64(
            termsContent,
          ),

        content_type:
          "application/pdf",
      });
    }

    /*
      ----------------------------------------
      LETTER TYPE LABEL
      ----------------------------------------
    */

    let typeLabel =
      "Employee Letter";

    switch (letterType) {
      case "offer":
        typeLabel =
          "Offer Letter";
        break;

      case "joining":
        typeLabel =
          "Joining Letter";
        break;

      case "warning":
        typeLabel =
          "Warning Letter";
        break;

      case "termination":
        typeLabel =
          "Termination Letter";
        break;

      case "terms":
        typeLabel =
          "Terms & Conditions";
        break;

      default:
        typeLabel =
          "Employee Letter";
    }

    /*
      ----------------------------------------
      EMAIL HTML
      ----------------------------------------
    */

    const safeEmployeeName =
      escapeHtml(
        employeeName ||
          "Employee",
      );

    const safeEmployeeCode =
      escapeHtml(
        employeeCode || "—",
      );

    const safeSubject =
      escapeHtml(
        subject ||
          "SS Enterprises Letter",
      );

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${safeSubject}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f6f9;
    font-family:Arial,Helvetica,sans-serif;
  "
>

<div
  style="
    width:100%;
    padding:25px 0;
  "
>

  <div
    style="
      max-width:680px;
      margin:0 auto;
      background:#ffffff;
      border:1px solid #e1e5eb;
      border-radius:8px;
      overflow:hidden;
    "
  >

    <!-- HEADER -->

    <div
      style="
        padding:20px 24px;
        border-bottom:3px solid #c99b2e;
      "
    >

      <div
        style="
          font-size:23px;
          font-weight:700;
          color:#08234a;
          letter-spacing:.7px;
        "
      >
        SS ENTERPRISES
      </div>

      <div
        style="
          margin-top:4px;
          font-size:12px;
          color:#65748a;
        "
      >
        HR &amp; Administration
      </div>

    </div>


    <!-- BODY -->

    <div
      style="
        padding:25px 24px;
        color:#18283f;
        font-size:14px;
        line-height:1.7;
      "
    >

      <p>
        Dear
        <strong>
          ${safeEmployeeName}
        </strong>,
      </p>

      <p>
        Please find attached your
        <strong>
          ${escapeHtml(typeLabel)}
        </strong>
        issued by
        <strong>
          SS Enterprises
        </strong>.
      </p>

      ${
        letterType === "offer"
          ? `
      <p>
        Your email also contains the
        company's original
        <strong>
          Terms &amp; Conditions of Employment
        </strong>
        as a separate PDF attachment.
      </p>
      `
          : ""
      }

      <p>
        Please review the attached document(s)
        carefully and keep them safely for
        your records.
      </p>

      <p
        style="
          margin-top:28px;
          margin-bottom:0;
        "
      >
        Regards,<br>

        <strong>
          HR &amp; Administration
        </strong><br>

        SS Enterprises<br>

        <span
          style="
            color:#65748a;
          "
        >
          Donar Road, Darbhanga
        </span>
        <br>

        <span
          style="
            color:#65748a;
          "
        >
          ssenterprisesservice@poton.me
        </span>

      </p>

    </div>


    <!-- FOOTER -->

    <div
      style="
        padding:12px 24px;
        border-top:1px solid #e1e5eb;
        background:#fafbfc;
        font-size:11px;
        color:#65748a;
      "
    >

      Employee Code:
      <strong>
        ${safeEmployeeCode}
      </strong>

    </div>

  </div>

</div>

</body>
</html>
`;

    /*
      ----------------------------------------
      RESEND PAYLOAD
      ----------------------------------------
    */

    const resendPayload = {
      from:
        "SS Enterprises <ssenterprisesservice@poton.me>",

      to: [
        to,
      ],

      subject:
        subject ||
        "SS Enterprises Letter",

      html,

      attachments:
        safeAttachments,
    };

    console.log(
      "Sending employee letter:",
      {
        to,
        employeeName,
        employeeCode,
        letterType,
        attachmentCount:
          safeAttachments.length,
      },
    );

    /*
      ----------------------------------------
      SEND EMAIL
      ----------------------------------------
    */

    const resendResponse =
      await fetchWithTimeout(
        "https://api.resend.com/emails",

        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${resendKey}`,

            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(
              resendPayload,
            ),
        },

        30000,
      );

    /*
      ----------------------------------------
      READ RESEND RESPONSE
      ----------------------------------------
    */

    let resendResult: any = {};

    const responseText =
      await resendResponse.text();

    if (responseText) {
      try {
        resendResult =
          JSON.parse(
            responseText,
          );
      } catch {
        resendResult = {
          raw:
            responseText,
        };
      }
    }

    /*
      ----------------------------------------
      RESEND ERROR
      ----------------------------------------
    */

    if (
      !resendResponse.ok
    ) {
      console.error(
        "Resend API error:",
        {
          status:
            resendResponse.status,
          result:
            resendResult,
        },
      );

      const resendError =
        resendResult?.message ||
        resendResult?.error ||
        resendResult?.name ||
        `Resend returned HTTP ${resendResponse.status}.`;

      return json(
        {
          ok: false,
          error:
            String(
              resendError,
            ),
        },
        resendResponse.status,
      );
    }

    /*
      ----------------------------------------
      SUCCESS
      ----------------------------------------
    */

    console.log(
      "Employee letter email sent successfully:",
      resendResult?.id || null,
    );

    return json(
      {
        ok: true,

        id:
          resendResult?.id ||
          null,

        message:
          "Email sent successfully.",

        employeeName,

        employeeCode,

        letterType,

        attachmentCount:
          safeAttachments.length,
      },
      200,
    );

  } catch (error) {

    /*
      ----------------------------------------
      TIMEOUT
      ----------------------------------------
    */

    if (
      error instanceof DOMException &&
      error.name ===
        "AbortError"
    ) {
      return json(
        {
          ok: false,
          error:
            "Email service timed out. Please try again.",
        },
        504,
      );
    }

    /*
      ----------------------------------------
      UNKNOWN ERROR
      ----------------------------------------
    */

    console.error(
      "send-letter-email error:",
      error,
    );

    return json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Unexpected email service error.",
      },
      500,
    );
  }
});

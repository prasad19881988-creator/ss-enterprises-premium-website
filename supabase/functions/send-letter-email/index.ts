const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
  return value.replace(/[&<>'"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[ch] || ch));
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
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return json(
      {
        error: "Method not allowed.",
      },
      405,
    );
  }

  try {
    /*
      IMPORTANT:
      Supabase Function JWT verification is handled before
      this function. Therefore we do NOT make another
      /auth/v1/user network request here.
    */

    const authorization =
      req.headers.get("Authorization") ||
      req.headers.get("authorization") ||
      "";

    if (!authorization) {
      return json(
        {
          error: "Authentication required.",
        },
        401,
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (!resendKey) {
      return json(
        {
          error: "RESEND_API_KEY is not configured.",
        },
        500,
      );
    }

    /*
      Read the complete request body BEFORE calling Resend.
    */
    const body = await req.json();

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
    ).trim();

    const attachments = Array.isArray(body?.attachments)
      ? body.attachments
      : [];

    const termsContent = String(
      body?.termsContent || "",
    ).trim();

    if (!/^\S+@\S+\.\S+$/.test(to)) {
      return json(
        {
          error: "Invalid staff email address.",
        },
        400,
      );
    }

    if (attachments.length !== 1) {
      return json(
        {
          error: "Letter PDF attachment is missing or invalid.",
        },
        400,
      );
    }

    const letter = attachments[0];

    const letterContent = String(
      letter?.content || "",
    ).trim();

    if (!letterContent) {
      return json(
        {
          error: "Letter PDF is empty.",
        },
        400,
      );
    }

    const safeAttachments: any[] = [
      {
        filename: String(
          letter?.filename || "SS-Enterprises-Letter.pdf",
        ).replace(/[^a-zA-Z0-9._-]/g, "-"),

        content: letterContent,

        content_type: "application/pdf",
      },
    ];

    /*
      Offer Letter:
      attach the ORIGINAL 5-page Terms & Conditions PDF
      as Base64.

      No remote PDF URL.
      No Resend path download.
    */
    if (letterType === "offer") {
      if (!termsContent) {
        return json(
          {
            error:
              "Original Terms & Conditions PDF content is missing.",
          },
          400,
        );
      }

      safeAttachments.push({
        filename:
          "SS-Enterprises-Terms-and-Conditions.pdf",

        content: termsContent,

        content_type: "application/pdf",
      });
    }

    let typeLabel = "Employee Letter";

    if (letterType === "offer") {
      typeLabel = "Offer Letter";
    } else if (letterType === "joining") {
      typeLabel = "Joining Letter";
    } else if (letterType === "warning") {
      typeLabel = "Warning Letter";
    } else if (letterType === "termination") {
      typeLabel = "Termination Letter";
    }

    const html = `
      <div
        style="
          font-family:Arial,Helvetica,sans-serif;
          max-width:680px;
          margin:0 auto;
          color:#18283f;
        "
      >

        <div
          style="
            border-bottom:3px solid #c99b2e;
            padding:14px 0;
            margin-bottom:20px;
          "
        >
          <div
            style="
              font-size:22px;
              font-weight:700;
              color:#08234a;
              letter-spacing:.8px;
            "
          >
            SS ENTERPRISES
          </div>

          <div
            style="
              font-size:12px;
              color:#607086;
            "
          >
            HR &amp; Administration
          </div>
        </div>

        <p>
          Dear
          <b>${escapeHtml(employeeName)}</b>,
        </p>

        <p>
          Please find attached your
          <b>${escapeHtml(typeLabel)}</b>
          issued by SS Enterprises.
        </p>

        ${
          letterType === "offer"
            ? `
              <p>
                The email also includes the company's original
                <b>
                  5-page Terms &amp; Conditions of Employment
                </b>
                attachment for your records.
              </p>
            `
            : ""
        }

        <p>
          Please review the documents carefully and retain them
          for your records.
        </p>

        <p style="margin-top:28px">
          Regards,<br>
          <b>HR &amp; Administration</b><br>
          SS Enterprises<br>
          <span style="color:#607086">
            ssenterprisesservice@poton.me
          </span>
        </p>

        <div
          style="
            border-top:1px solid #d6deea;
            margin-top:24px;
            padding-top:10px;
            font-size:11px;
            color:#607086;
          "
        >
          Employee Code:
          ${escapeHtml(employeeCode || "—")}
        </div>

      </div>
    `;

    /*
      ONLY ONE external network call now:
      Browser → Supabase Function → Resend
    */

    const resendResponse = await fetchWithTimeout(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          from:
            "SS Enterprises <ssenterprisesservice@poton.me>",

          to: [to],

          subject,

          html,

          attachments: safeAttachments,
        }),
      },

      25000,
    );

    let resendResult: any = {};

    try {
      resendResult = await resendResponse.json();
    } catch (_) {
      resendResult = {};
    }

    if (!resendResponse.ok) {
      return json(
        {
          error:
            resendResult?.message ||
            resendResult?.error ||
            `Resend returned HTTP ${resendResponse.status}.`,
        },
        resendResponse.status,
      );
    }

    return json({
      ok: true,
      id: resendResult?.id || null,
      message: "Email sent successfully.",
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return json(
        {
          error:
            "Resend email service timed out. Please try again.",
        },
        504,
      );
    }

    console.error(
      "send-letter-email error:",
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

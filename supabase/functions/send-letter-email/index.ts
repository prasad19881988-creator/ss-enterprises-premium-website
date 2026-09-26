const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  ms: number,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

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
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return json(
      {
        error: "Method not allowed",
      },
      405,
    );
  }

  try {
    // --------------------------------------------------
    // 1. AUTHENTICATION
    // --------------------------------------------------

    const auth = req.headers.get("Authorization") || "";

    const token = auth
      .replace(/^Bearer\s+/i, "")
      .trim();

    if (!token) {
      return json(
        {
          error: "Authentication required.",
        },
        401,
      );
    }

    // --------------------------------------------------
    // 2. SERVER SECRETS
    // --------------------------------------------------

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRole =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const resendKey =
      Deno.env.get("RESEND_API_KEY");

    if (
      !supabaseUrl ||
      !serviceRole ||
      !resendKey
    ) {
      return json(
        {
          error:
            "Email service is not configured on the server.",
        },
        500,
      );
    }

    // --------------------------------------------------
    // 3. VERIFY CURRENT LOGGED-IN USER
    // --------------------------------------------------

    const authResponse =
      await fetchWithTimeout(
        `${supabaseUrl}/auth/v1/user`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,

            apikey: serviceRole,
          },
        },

        8000,
      );

    if (!authResponse.ok) {
      return json(
        {
          error:
            "Invalid or expired admin session. Please log in again.",
        },
        401,
      );
    }

    const user =
      await authResponse.json();

    if (!user?.id) {
      return json(
        {
          error:
            "Invalid or expired admin session.",
        },
        401,
      );
    }

    // --------------------------------------------------
    // 4. READ REQUEST
    // --------------------------------------------------

    const body =
      await req.json();

    const to =
      String(body?.to || "").trim();

    const subject =
      String(
        body?.subject ||
          "SS Enterprises Letter",
      ).trim();

    const employeeName =
      String(
        body?.employeeName ||
          "Employee",
      ).trim();

    const employeeCode =
      String(
        body?.employeeCode || "",
      ).trim();

    const letterType =
      String(
        body?.letterType ||
          "letter",
      ).trim();

    const attachments =
      Array.isArray(body?.attachments)
        ? body.attachments
        : [];

    const termsUrl =
      String(
        body?.termsUrl || "",
      ).trim();

    // --------------------------------------------------
    // 5. VALIDATE EMAIL
    // --------------------------------------------------

    if (
      !/^\S+@\S+\.\S+$/.test(to)
    ) {
      return json(
        {
          error:
            "Invalid staff email address.",
        },
        400,
      );
    }

    // --------------------------------------------------
    // 6. ONLY ONE BASE64 ATTACHMENT
    //    = GENERATED LETTER PDF
    // --------------------------------------------------

    if (attachments.length !== 1) {
      return json(
        {
          error:
            "Letter PDF attachment is missing or invalid.",
        },
        400,
      );
    }

    const letter =
      attachments[0];

    const letterContent =
      String(
        letter?.content || "",
      );

    if (!letterContent) {
      return json(
        {
          error:
            "Letter PDF is empty.",
        },
        400,
      );
    }

    const safeAttachments: any[] = [
      {
        filename:
          String(
            letter?.filename ||
              "letter.pdf",
          ).replace(
            /[^a-zA-Z0-9._-]/g,
            "-",
          ),

        content:
          letterContent,

        content_type:
          "application/pdf",
      },
    ];

    // --------------------------------------------------
    // 7. OFFER LETTER
    //    ADD ORIGINAL 5-PAGE T&C PDF
    //
    //    IMPORTANT:
    //    T&C is NOT sent as Base64 from browser.
    //    Resend fetches it directly from public URL.
    // --------------------------------------------------

    if (letterType === "offer") {
      if (
        !/^https:\/\//i.test(
          termsUrl,
        )
      ) {
        return json(
          {
            error:
              "Original Terms & Conditions PDF URL is missing.",
          },
          400,
        );
      }

      safeAttachments.push({
        path: termsUrl,

        filename:
          "SS-Enterprises-Terms-and-Conditions.pdf",

        content_type:
          "application/pdf",
      });
    }

    // --------------------------------------------------
    // 8. EMAIL TYPE
    // --------------------------------------------------

    const typeLabel =
      letterType === "offer"
        ? "Offer Letter"
        : letterType === "joining"
        ? "Joining Letter"
        : "Employee Letter";

    // --------------------------------------------------
    // 9. EMAIL BODY
    // --------------------------------------------------

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
          <b>
            ${escapeHtml(employeeName)}
          </b>,
        </p>

        <p>
          Please find attached your
          <b>
            ${escapeHtml(typeLabel)}
          </b>
          issued by SS Enterprises.
        </p>

        ${
          letterType === "offer"
            ? `
              <p>
                The email also includes the
                company's original
                <b>
                  5-page Terms &amp; Conditions
                  of Employment
                </b>
                attachment for your records.
              </p>
            `
            : ""
        }

        <p>
          Please review the documents carefully
          and retain them for your records.
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
          ${escapeHtml(
            employeeCode || "—",
          )}
        </div>

      </div>
    `;

    // --------------------------------------------------
    // 10. SEND THROUGH RESEND
    // --------------------------------------------------

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
          },

          body: JSON.stringify({
            from:
              "SS Enterprises <ssenterprisesservice@poton.me>",

            to: [to],

            subject,

            html,

            attachments:
              safeAttachments,
          }),
        },

        20000,
      );

    // --------------------------------------------------
    // 11. READ RESEND RESPONSE
    // --------------------------------------------------

    let result: any = {};

    try {
      result =
        await resendResponse.json();
    } catch (_) {
      // Keep empty result if provider
      // doesn't return JSON.
    }

    // --------------------------------------------------
    // 12. RESEND ERROR
    // --------------------------------------------------

    if (!resendResponse.ok) {
      return json(
        {
          error:
            result?.message ||
            result?.error ||
            `Resend returned HTTP ${resendResponse.status}.`,
        },

        resendResponse.status,
      );
    }

    // --------------------------------------------------
    // 13. SUCCESS
    // --------------------------------------------------

    return json({
      ok: true,

      id:
        result?.id ||
        null,
    });

  } catch (error) {

    // Timeout
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return json(
        {
          error:
            "Email service timed out. Please try again.",
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

// --------------------------------------------------
// HTML SECURITY
// --------------------------------------------------

function escapeHtml(
  value: string,
) {
  return value.replace(
    /[&<>'"]/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[ch] || ch),
  );
  }

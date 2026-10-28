SS ENTERPRISES — ADMIN.JS RESTORE + EMAIL REQUEST FIX
Date: 28 October 2026

WHAT IS INCLUDED
1. admin.js — restored full Admin Panel JavaScript from the previously saved SS Enterprises admin file; existing site editor, staff, attendance, payroll, leave, advances, promotion, accounts, payments, letters, reports and job application handlers are retained.
2. admin.html — updated the admin.js cache-busting version so the browser loads the new file instead of a stale cached copy.
3. Existing files, PDF, config.js, SQL files, and current send-letter-email Edge Function source are included from the supplied ZIP. No Supabase SQL or Edge Function code was changed in this package.

EMAIL CHANGE
- Offer/letter request now uses the Supabase JavaScript SDK's functions.invoke() method, which sends the configured project API key and current logged-in session token through the SDK.
- The included Edge Function source already fetches the latest public Terms & Conditions PDF for offer letters from:
  https://ss-enterprises-website.onrender.com/SS_Enterprises_Terms_and_Conditions.pdf
- This package does NOT require pasting new code into the Supabase dashboard.

IMPORTANT
- This is a source ZIP for the GitHub website repository, not a direct deployment.
- Upload/commit the included admin.js and admin.html to the repository's main branch. If replacing the repository contents, keep the existing config.js and all other files.
- After Render deploys, open the Admin Panel and sign in again before testing an offer letter.
- If HTTP 403 still occurs, the rejection is likely at the Supabase API gateway/configuration layer before the function runs; a frontend-only ZIP cannot guarantee fixing a gateway-level rejection. This ZIP is designed to eliminate the missing-file/stale-cache/manual-header causes without changing Supabase settings.

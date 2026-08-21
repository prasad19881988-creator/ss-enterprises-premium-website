SS ENTERPRISES - FIXED WEBSITE PACKAGE

This version fixes the problem visible on the live site:
1. Old placeholder cards (Current Tender / Project, Upcoming Assignment, Completed Work) are replaced by the requested ABHA Card Project and Ayushman Card KYC Project when old placeholder data exists in Supabase.
2. The opening Trishul intro is made reliable and visible on mobile.
3. CSS and JS use a version query so the browser does not keep the old cached files.
4. Admin panel uses the same placeholder-data fix.

FILES TO DEPLOY TO THE SAME RENDER SERVICE:
index.html
admin.html
config.js
script.js
styles.css
logo.png
supabase-schema.sql

IMPORTANT:
- Keep your existing config.js Supabase values if they are already configured.
- Replace the website files in the GitHub repository connected to the Render service shown in your screenshot.
- Commit/push, then trigger a new deploy on Render.
- After deployment, open the site in an incognito/private tab or clear the browser cache.

Final update: Founder, CEO & Managing Director, State Head and District Coordinator profiles are included. Experience is removed. Responsibilities remain. Contact No. is now an Admin Panel field for every team member.

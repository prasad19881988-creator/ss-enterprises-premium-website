SS ENTERPRISES — COMPLETE ADMIN PANEL PACKAGE

This package upgrades the existing SS Enterprises website in the SAME repository. It does not create a separate website.

ADMIN PANEL FEATURES
- Secure Supabase Auth login.
- Dashboard with project counts and quick actions.
- Projects: add/edit/delete, Project Photo upload, description, Work/Project Location, status, date, portal link.
- Status options: Upcoming / Ongoing / Completed.
- Upcoming → Live / Active button.
- Publish / Unpublish for projects. Only published projects appear on the public website.
- Featured Project selection for the homepage.
- Leadership & Team: Add Member, Edit, Delete, Photo, Name, Designation, Location, Responsibilities and Contact.
- Website Content: Homepage, About Us, Services, Contact, phone, WhatsApp, email, social links.
- Website Control: section ON/OFF, Announcement/Banner ON/OFF, Featured Project and homepage content controls.
- Gallery / Photos management.
- Save / Publish button. Changes are stored in Supabase; no GitHub/Render edit is needed for normal content updates.

IMPORTANT LOCATION RULE
- Work / Project Location is fixed to: Bihar.
- Public Address remains: Donar Road, Darbhanga.
- Saving from the Admin Panel also enforces these values, so changing a project does not change the address.

SETUP
1. In Supabase create/use your project.
2. Run supabase-schema.sql in the Supabase SQL Editor.
3. Create an admin user in Supabase Authentication → Users (email + password).
4. Put your Supabase Project URL and anon/publishable key into config.js.
5. Replace the files in the SAME GitHub repository with this package and deploy normally.
6. Open /admin.html and sign in with the Supabase admin user.

PHOTO UPLOAD
- The SQL creates a public `site-assets` Storage bucket.
- Project, team and gallery photos can be uploaded from the Admin Panel.
- After upload, click Save / Publish Changes.

PUBLIC WEBSITE
- Existing logo and ABHA portal link are retained.
- Existing address remains Donar Road, Darbhanga.
- Website content and project visibility are loaded from Supabase automatically.

LANGUAGE & CONTENT UPDATE (23 Aug 2026)
- English is the default language for first-time visitors.
- English / हिन्दी buttons are available in the website menu.
- Selecting हिन्दी translates the website interface, headings, services, project status labels, team roles/descriptions where available, contact labels, credentials and footer text.
- The selected language is remembered on that device. Selecting English returns the site to English.
- User photos, names, project URLs and Supabase data are preserved; the bilingual change does not delete existing admin data.

FINAL 25 AUG 2026 UPGRADE
- Professional responsive admin dashboard retained and refined.
- Staff salary structure now supports Basic Salary, TA/Travel, DA/Daily, Rent/HRA, Other Allowance and calculated Gross Monthly / Annual CTC.
- Payroll / Salary Slips now uses the same complete salary structure and supports printable salary slips.
- Offer / Joining Letter now generates an A4-style professional colour letter with company branding, watermark, salary breakup, monthly + annual CTC, joining date, employee details and stamp/signature slots from Company Profile.
- Existing config.js must remain unchanged because it contains the connected Supabase settings.
- Run the updated supabase-company-schema.sql after the existing company schema; the added ALTER statements are safe for existing installations.
- Replace the files in the SAME GitHub repository, then redeploy on Render.

--- 2026-08-26 ID CARD + QR UPGRADE ---

New functionality added:
1. Employee Code is auto-generated for new staff and remains the single ID used by staff, offer/joining letter, ID card and QR profile.
2. Offer/Joining Letter screen now has “Generate Letter + ID Card”.
3. Staff table has an ID Card action.
4. ID card is a professional CR80-style HTML print card with logo, employee photo, watermark, signature/stamp, ABHA PROJECT TEAM label and QR code.
5. Scanning the QR opens employee.html?employee=<employee_code> and shows the authorised company + employee profile.
6. Bank account, IFSC and internal notes are deliberately not exposed on the public QR profile.

SUPABASE STEP REQUIRED:
Run the latest supabase-company-schema.sql in Supabase SQL Editor after the existing company schema. The file creates/updates the public_employee_directory view and grants read access to the non-sensitive QR profile fields.

Render/static hosting:
Keep employee.html, admin.html, admin.js, styles.css, script.js, config.js and logo.png in the same deployed root folder. No build command is required for this static project.


FINAL 26 AUG 2026 UI / DOCUMENT SAFETY UPGRADE
- Admin dashboard now follows the supplied dark SS Enterprises reference: left navigation, metric cards, quick actions and management modules.
- Public website mobile layout is hardened against horizontal overflow.
- Added Company Settings for company logo, Authorized Signatory and Company Stamp/Mohar. These assets feed Offer/Joining Letters and ID Cards.
- Added Employee Signature to Staff Management; it feeds employee documents and does not expose salary on the ID Card.
- Offer/Joining Letter includes dedicated Employee Signature, Company Stamp/Mohar and Authorized Signatory areas; salary remains only in the letter/payroll.
- Existing data and tables are preserved; employee_signature_url is an additive schema change.

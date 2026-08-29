SS ENTERPRISES — FINAL V7 DOCUMENT + INTERFACE PACKAGE

This is based on the supplied ss-enterprises-final-interface-v6.zip and keeps the existing website, Supabase connection, logo, employee directory, admin modules and premium interface.

FINAL CHANGES
1. Offer Letter is now a true 2-page professional A4 document.
   - Page 1 keeps the supplied offer-letter wording/structure: To + Address, subject, designation, department, CTC, probation, joining date, note, acceptance and signatory area.
   - Page 2 is the salary-component sheet with Basic, HRA, TA, DA, Other Allowance, monthly and annual amounts, and automatic Gross/CTC total.
   - Logo, professional paper styling, watermark, company stamp/mohar and authorised signatory are retained.
2. Employee ID Card now has front + back sides in the supplied SS Enterprises style.
   - Employee name, ID, designation, department, joining date and employee mobile are automatic.
   - Company number remains visible.
   - Company Stamp / Mohar and Authorised Signatory are visible.
   - Salary/allowances are NOT printed on the ID Card.
   - QR opens the existing employee directory/profile page.
3. Employee data comes from Staff Management, so Offer Letter and ID Card automatically update when the staff/post/joining information changes.
4. Salary components come from the existing approved staff salary fields and are automatically calculated. The existing database already contains Basic/TA/DA/HRA/Other fields.
5. The supplied v6 premium public website and v6 admin dashboard interface are preserved; no unnecessary redesign of the rest of the site was made.

DEPLOYMENT
- Replace the files in your SAME GitHub repository with this package.
- Keep config.js and logo.png from the package/repository.
- Push to GitHub; Render can redeploy the same service.
- The current architecture uses Supabase for staff/company data and employee QR profiles. Do not remove that connection.
- No manual Supabase content changes are required for these UI/document changes if your database is already on the v6 schema. The included supabase-company-schema.sql is the compatible schema/reference if an older database is missing the salary/document columns.

IMPORTANT
The salary values are not invented from a designation name. They are generated from the salary components saved for that employee in Staff Management. This avoids silently creating unsupported salary figures.

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

-- SS Enterprises CMS — one-time Supabase setup
create table if not exists public.site_data (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{"projects":[],"team":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_data enable row level security;
drop policy if exists "Public can read site data" on public.site_data;
create policy "Public can read site data" on public.site_data for select using (true);
drop policy if exists "Signed in admin can write site data" on public.site_data;
create policy "Signed in admin can write site data" on public.site_data for all to authenticated using (true) with check (true);

insert into public.site_data (id, content) values
(1, '{
  "projects": [
    {
      "id": "abha",
      "name": "ABHA Card Project",
      "department": "Health / Digital Health Services",
      "location": "Darbhanga",
      "status": "active",
      "description": "ABHA card creation and related service work through the existing service workflow.",
      "date": "Active",
      "link": "https://ss-enterprises-abha-app-2026.onrender.com/"
    },
    {
      "id": "ayushman",
      "name": "Ayushman Card KYC Project",
      "department": "Ayushman Bharat",
      "location": "Darbhanga",
      "status": "upcoming",
      "description": "Upcoming project; details will be updated after tender award/confirmation.",
      "date": "Tender in Process",
      "link": ""
    }
  ],
  "team": [
    {"id":"founder","role":"Founder","name":"Add Name","location":"Darbhanga, Bihar","responsibilities":"Overall vision, strategic decisions and major business operations.","contact":"","photo":""},
    {"id":"ceo","role":"CEO & Managing Director","name":"Add Name","location":"Darbhanga, Bihar","responsibilities":"Day-to-day operations, projects/tenders, team management and organisational growth.","contact":"","photo":""},
    {"id":"state-head","role":"State Head","name":"Add Name","location":"Bihar","responsibilities":"State-level project coordination, field operations and monitoring of district teams.","contact":"","photo":""},
    {"id":"district-coordinator","role":"District Coordinator","name":"Add Name","location":"Darbhanga, Bihar","responsibilities":"District project implementation, field staff coordination and monitoring of assigned work.","contact":"","photo":""}
  ]
}'::jsonb)
on conflict (id) do nothing;

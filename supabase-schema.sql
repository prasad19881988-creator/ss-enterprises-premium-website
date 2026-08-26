-- SS ENTERPRISES COMPLETE ADMIN PANEL
-- Run this once in Supabase SQL Editor.

create table if not exists public.site_data (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{"projects":[],"team":[],"settings":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_data enable row level security;

drop policy if exists "Public can read site data" on public.site_data;
create policy "Public can read site data"
on public.site_data for select
using (true);

drop policy if exists "Signed in admin can write site data" on public.site_data;
create policy "Signed in admin can write site data"
on public.site_data for all to authenticated
using (true)
with check (true);

insert into public.site_data (id, content)
values (1, '{"projects":[],"team":[],"settings":{}}'::jsonb)
on conflict (id) do nothing;

-- Public image bucket for project/team/gallery photos.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read site assets" on storage.objects;
create policy "Public can read site assets"
on storage.objects for select
using (bucket_id = 'site-assets');

drop policy if exists "Authenticated can upload site assets" on storage.objects;
create policy "Authenticated can upload site assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets');

drop policy if exists "Authenticated can update site assets" on storage.objects;
create policy "Authenticated can update site assets"
on storage.objects for update to authenticated
using (bucket_id = 'site-assets')
with check (bucket_id = 'site-assets');

drop policy if exists "Authenticated can delete site assets" on storage.objects;
create policy "Authenticated can delete site assets"
on storage.objects for delete to authenticated
using (bucket_id = 'site-assets');

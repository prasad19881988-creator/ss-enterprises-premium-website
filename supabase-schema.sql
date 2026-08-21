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
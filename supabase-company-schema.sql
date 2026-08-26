-- SS ENTERPRISES ADDITIVE COMPANY MANAGEMENT SCHEMA
-- Run AFTER the existing supabase-schema.sql.
-- Existing public.site_data is NOT changed or deleted.

create extension if not exists pgcrypto;

create table if not exists public.company_profile (
  id integer primary key default 1 check (id = 1),
  company_name text not null default 'SS ENTERPRISES',
  address text not null default 'Donar Road, Darbhanga',
  phone text default '+91 73600 25302',
  email text default 'ssenterprisesservice@poton.me',
  logo_url text default '',
  signature_url text default '',
  stamp_url text default '',
  offer_footer text default 'For SS Enterprises',
  joining_footer text default 'For SS Enterprises',
  updated_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  employee_code text unique,
  full_name text not null,
  father_name text default '',
  email text default '',
  phone text default '',
  address text default '',
  designation text not null default 'Staff',
  department text default '',
  location text default 'Bihar',
  joining_date date,
  salary numeric(12,2) not null default 0,
  status text not null default 'active' check (status in ('active','inactive','left')),
  photo_url text default '',
  bank_name text default '',
  account_number text default '',
  ifsc text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  attendance_date date not null,
  status text not null default 'present' check (status in ('present','absent','half_day','leave','holiday')),
  check_in timestamptz,
  check_out timestamptz,
  location text default '',
  proof_url text default '',
  notes text default '',
  unique(staff_id, attendance_date)
);

create table if not exists public.leaves (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  from_date date not null,
  to_date date not null,
  leave_type text default 'Casual Leave',
  reason text default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.staff_advances (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  advance_date date not null default current_date,
  amount numeric(12,2) not null default 0,
  reason text default '',
  status text not null default 'given' check (status in ('given','recovered','cancelled')),
  notes text default ''
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  effective_date date not null default current_date,
  old_designation text default '',
  new_designation text not null,
  old_salary numeric(12,2) default 0,
  new_salary numeric(12,2) default 0,
  reason text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.payroll (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  salary_month date not null,
  basic_salary numeric(12,2) not null default 0,
  allowance numeric(12,2) not null default 0,
  overtime numeric(12,2) not null default 0,
  deduction numeric(12,2) not null default 0,
  advance_deduction numeric(12,2) not null default 0,
  net_salary numeric(12,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','approved','paid')),
  payment_date date,
  payment_method text default '',
  notes text default '',
  unique(staff_id, salary_month)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null default current_date,
  category text default 'General',
  description text default '',
  amount numeric(12,2) not null default 0,
  payment_method text default 'Cash',
  reference text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.income (
  id uuid primary key default gen_random_uuid(),
  income_date date not null default current_date,
  source text default 'Project',
  description text default '',
  amount numeric(12,2) not null default 0,
  payment_method text default 'Bank',
  reference text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_date date not null default current_date,
  payment_type text not null default 'other' check (payment_type in ('staff_salary','vendor','customer_receipt','bank_transfer','other')),
  party_name text default '',
  amount numeric(12,2) not null default 0,
  direction text not null default 'out' check (direction in ('in','out')),
  method text default 'Bank',
  reference text default '',
  notes text default ''
);

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null default '',
  email text not null default '',
  role text not null default 'viewer' check (role in ('owner','admin','hr','accounts','manager','viewer')),
  permissions jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  letter_type text not null check (letter_type in ('offer','joining')),
  letter_number text default '',
  issue_date date not null default current_date,
  subject text default '',
  body_html text default '',
  email_to text default '',
  emailed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists attendance_date_idx on public.attendance(attendance_date);
create index if not exists payroll_month_idx on public.payroll(salary_month);
create index if not exists leaves_staff_idx on public.leaves(staff_id);
create index if not exists advances_staff_idx on public.staff_advances(staff_id);

insert into public.company_profile (id) values (1) on conflict (id) do nothing;

-- updated_at trigger
create or replace function public.ss_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists staff_updated_at on public.staff;
create trigger staff_updated_at before update on public.staff for each row execute function public.ss_set_updated_at();

drop trigger if exists company_profile_updated_at on public.company_profile;
create trigger company_profile_updated_at before update on public.company_profile for each row execute function public.ss_set_updated_at();

-- RLS: signed-in users can use company management tables.
-- Existing site_data policies remain untouched.
do $$
declare t text;
begin
  foreach t in array array['company_profile','staff','attendance','leaves','staff_advances','promotions','payroll','expenses','income','payments','app_users','letters'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Authenticated can manage %1$s" on public.%1$s', t);
    execute format('create policy "Authenticated can manage %1$s" on public.%1$s for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- FINAL SALARY STRUCTURE UPGRADE (safe for existing installations)
alter table public.staff add column if not exists basic_salary numeric(12,2) not null default 0;
alter table public.staff add column if not exists ta_travel numeric(12,2) not null default 0;
alter table public.staff add column if not exists da_daily numeric(12,2) not null default 0;
alter table public.staff add column if not exists rent_allowance numeric(12,2) not null default 0;
alter table public.staff add column if not exists other_allowance numeric(12,2) not null default 0;

-- Preserve existing monthly salary as Basic when the new structure is first installed.
update public.staff
set basic_salary = salary
where coalesce(basic_salary,0)=0 and coalesce(salary,0)<>0;

alter table public.payroll add column if not exists ta_travel numeric(12,2) not null default 0;
alter table public.payroll add column if not exists da_daily numeric(12,2) not null default 0;
alter table public.payroll add column if not exists rent_allowance numeric(12,2) not null default 0;
alter table public.payroll add column if not exists other_allowance numeric(12,2) not null default 0;


-- PUBLIC EMPLOYEE QR DIRECTORY
-- QR codes open employee.html?employee=<employee_code>.
-- Only non-sensitive employment/company fields are exposed; bank details and notes are never public.
create or replace view public.public_employee_directory as
select
  s.employee_code, s.full_name, s.father_name, s.designation, s.department, s.location,
  s.joining_date, s.salary, s.basic_salary, s.ta_travel, s.da_daily, s.rent_allowance, s.other_allowance,
  s.status, s.photo_url, s.phone, s.email, s.address,
  c.company_name, c.address as company_address, c.phone as company_phone, c.email as company_email,
  c.logo_url, c.signature_url, c.stamp_url, c.offer_footer
from public.staff s
cross join public.company_profile c
where s.employee_code is not null;

grant select on public.public_employee_directory to anon, authenticated;

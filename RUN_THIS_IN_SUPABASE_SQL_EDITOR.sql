-- SS ENTERPRISES: SAFE STAFF + SALARY UPGRADE
-- Run this in Supabase Dashboard > SQL Editor.
-- This does NOT delete existing data.

alter table public.staff add column if not exists address text default '';
alter table public.staff add column if not exists basic_salary numeric(12,2) not null default 0;
alter table public.staff add column if not exists ta_travel numeric(12,2) not null default 0;
alter table public.staff add column if not exists da_daily numeric(12,2) not null default 0;
alter table public.staff add column if not exists rent_allowance numeric(12,2) not null default 0;
alter table public.staff add column if not exists other_allowance numeric(12,2) not null default 0;
alter table public.staff add column if not exists employee_signature_url text default '';

-- Existing salary is preserved as Basic Salary for old staff records.
update public.staff
set basic_salary = salary
where coalesce(basic_salary,0)=0 and coalesce(salary,0)<>0;

-- Payroll component columns used by the updated admin panel.
alter table public.payroll add column if not exists ta_travel numeric(12,2) not null default 0;
alter table public.payroll add column if not exists da_daily numeric(12,2) not null default 0;
alter table public.payroll add column if not exists rent_allowance numeric(12,2) not null default 0;
alter table public.payroll add column if not exists other_allowance numeric(12,2) not null default 0;

-- PROFESSIONAL FIELD COLLECTION + COMPANY PAYMENT SETTINGS
create table if not exists public.company_payment_settings (
  id integer primary key check (id=1), display_name text not null default 'SS Enterprises', account_type text not null default 'Savings',
  bank_name text default '', account_number text default '', ifsc_code text default '', upi_id text default '', payment_note text default 'Payment to SS Enterprises',
  updated_at timestamptz not null default now()
);
insert into public.company_payment_settings(id,display_name) values(1,'SS Enterprises') on conflict (id) do nothing;

create table if not exists public.field_collections (
  id uuid primary key default gen_random_uuid(), receipt_no text unique not null, collection_date date not null default current_date,
  customer_name text not null, mobile text default '', address text default '', service_name text default '', amount numeric(12,2) not null check(amount>0),
  staff_id uuid references public.staff(id) on delete set null, payment_mode text not null default 'UPI', reference text default '', remarks text default '',
  created_at timestamptz not null default now()
);

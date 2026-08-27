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

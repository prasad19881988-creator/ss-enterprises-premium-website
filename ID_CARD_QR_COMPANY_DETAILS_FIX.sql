-- SS Enterprises ID-card / QR company-details fix
-- Run once in Supabase SQL Editor. Safe for existing data.

alter table public.company_profile add column if not exists udyam_number text default 'BR-10-0011079';
update public.company_profile
set company_name = 'SS ENTERPRISES',
    address = 'Donar Road, Darbhanga, Bihar',
    phone = '+91 73600 25302',
    email = 'info@ssenterprisesservice.online',
    udyam_number = 'BR-10-0011079'
where id = 1;

create or replace view public.public_employee_directory as
select
  s.employee_code, s.full_name, s.father_name, s.designation, s.department, s.location,
  s.joining_date, s.status, s.photo_url, s.phone, s.email, s.address,
  c.company_name, c.address as company_address, c.phone as company_phone,
  c.email as company_email, c.logo_url, c.udyam_number
from public.staff s
cross join public.company_profile c
where s.employee_code is not null;

grant select on public.public_employee_directory to anon, authenticated;

-- SS ENTERPRISES: HR Warning / Termination Letters migration
-- Run once in Supabase SQL Editor. Existing letters/data are preserved.
alter table public.letters drop constraint if exists letters_letter_type_check;
alter table public.letters add constraint letters_letter_type_check
  check (letter_type in ('offer','joining','warning','termination'));
alter table public.letters add column if not exists warning_level text default '';
alter table public.letters add column if not exists reason text default '';
alter table public.letters add column if not exists improvement_days integer;
alter table public.letters add column if not exists effective_date date;
alter table public.letters add column if not exists details text default '';

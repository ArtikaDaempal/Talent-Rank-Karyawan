-- Profiles table (extends Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  employee_id text unique not null,
  full_name text not null,
  position text,
  role text check (role in ('admin', 'manager', 'employee')) default 'employee',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Departemen table (Created before being referenced)
create table if not exists departemen (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure departemen_id column exists in profiles
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='departemen_id') then
    alter table profiles add column departemen_id uuid references departemen(id) on delete set null;
  end if;
end $$;

-- KPI Criteria table
create table if not exists kriteria (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  weight decimal not null, -- e.g., 0.25 for 25%
  type text check (type in ('benefit', 'cost')) default 'benefit', 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Performance Evaluation table (Input by Manager)
create table if not exists penilaian (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references profiles(id) on delete cascade not null,
  kriteria_id uuid references kriteria(id) on delete cascade not null,
  score decimal not null, -- e.g., 1-100
  manager_id uuid references profiles(id) on delete set null,
  period text not null, -- e.g., "April 2026"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(employee_id, kriteria_id, period)
);

-- SAW Results table
create table if not exists hasil_spk (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references profiles(id) on delete cascade not null,
  saw_score decimal not null,
  rank integer,
  period text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(employee_id, period)
);

-- RLS (Row Level Security) Setup
alter table profiles enable row level security;
alter table kriteria enable row level security;
alter table penilaian enable row level security;
alter table hasil_spk enable row level security;
alter table departemen enable row level security;

-- Policies (Drop and Recreate to avoid errors)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

drop policy if exists "Kriteria is viewable by everyone." on kriteria;
create policy "Kriteria is viewable by everyone." on kriteria for select using (true);

drop policy if exists "Only admin can manage kriteria." on kriteria;
create policy "Only admin can manage kriteria." on kriteria for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Managers can manage penilaian." on penilaian;
create policy "Managers and Admin can manage penilaian." on penilaian for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('manager', 'admin'))
);

drop policy if exists "Employees can view own penilaian." on penilaian;
create policy "Employees can view own penilaian." on penilaian for select using (
  auth.uid() = employee_id
);

drop policy if exists "Hasil SPK is viewable by everyone." on hasil_spk;
create policy "Hasil SPK is viewable by everyone." on hasil_spk for select using (true);

drop policy if exists "Only admin can manage hasil_spk." on hasil_spk;
create policy "Only admin can manage hasil_spk." on hasil_spk for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Departemen is viewable by everyone." on departemen;
create policy "Departemen is viewable by everyone." on departemen for select using (true);

drop policy if exists "Only admin can manage departemen." on departemen;
create policy "Only admin can manage departemen." on departemen for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Trigger to create/update profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, employee_id, role, departemen_id)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', ''), 
    coalesce(new.raw_user_meta_data->>'employee_id', ''),
    coalesce(new.raw_user_meta_data->>'role', 'employee'),
    (new.raw_user_meta_data->>'departemen_id')::uuid
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    employee_id = excluded.employee_id,
    role = excluded.role,
    departemen_id = excluded.departemen_id;
    
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Initial Seed Data for Departments
insert into departemen (name) values 
('Bidang Produksi / Operasional (Manufaktur)'),
('Bidang Gudang & Inventaris (Logistik)'),
('Bidang Pengiriman & Distribusi (Logistik)'),
('Bidang Maintenance / Perawatan Mesin'),
('Bidang Quality Control (QC)')
on conflict (name) do nothing;

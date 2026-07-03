create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('seeker', 'employer')) not null,
  full_name text,
  email text,
  created_at timestamp default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade not null,
  title text not null,
  description text not null,
  location text,
  job_type text check (job_type in ('full-time', 'part-time', 'internship', 'contract')),
  salary_min int,
  salary_max int,
  status text check (status in ('open', 'closed')) default 'open',
  created_at timestamp default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade not null,
  seeker_id uuid references auth.users(id) on delete cascade not null,
  applied_at timestamp default now(),
  unique (job_id, seeker_id)
);

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'seeker'),
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Employers can read applicant profiles"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.applications a
      join public.jobs j on j.id = a.job_id
      join public.companies c on c.id = j.company_id
      where a.seeker_id = profiles.id
        and c.owner_id = auth.uid()
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Anyone can read companies"
  on public.companies for select
  using (true);

create policy "Owners can create companies"
  on public.companies for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update companies"
  on public.companies for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete companies"
  on public.companies for delete
  using (auth.uid() = owner_id);

create policy "Public can read open jobs"
  on public.jobs for select
  using (status = 'open');

create policy "Employers can read own jobs"
  on public.jobs for select
  using (
    exists (
      select 1 from public.companies
      where companies.id = jobs.company_id
        and companies.owner_id = auth.uid()
    )
  );

create policy "Employers can create own jobs"
  on public.jobs for insert
  with check (
    exists (
      select 1 from public.companies
      where companies.id = jobs.company_id
        and companies.owner_id = auth.uid()
    )
  );

create policy "Employers can update own jobs"
  on public.jobs for update
  using (
    exists (
      select 1 from public.companies
      where companies.id = jobs.company_id
        and companies.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.companies
      where companies.id = jobs.company_id
        and companies.owner_id = auth.uid()
    )
  );

create policy "Employers can delete own jobs"
  on public.jobs for delete
  using (
    exists (
      select 1 from public.companies
      where companies.id = jobs.company_id
        and companies.owner_id = auth.uid()
    )
  );

create policy "Seekers can create own applications"
  on public.applications for insert
  with check (
    auth.uid() = seeker_id
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'seeker'
    )
  );

create policy "Seekers can read own applications"
  on public.applications for select
  using (auth.uid() = seeker_id);

create policy "Employers can read applications for own jobs"
  on public.applications for select
  using (
    exists (
      select 1
      from public.jobs
      join public.companies on companies.id = jobs.company_id
      where jobs.id = applications.job_id
        and companies.owner_id = auth.uid()
    )
  );

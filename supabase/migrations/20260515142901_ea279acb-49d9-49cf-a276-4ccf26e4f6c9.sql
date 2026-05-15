
-- Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Admins manage roles"
on public.user_roles
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  variant text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  landing_path text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Anyone can submit leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "Admins read leads"
on public.leads
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_utm_source_idx on public.leads (utm_source);

-- Page visits
create table public.page_visits (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.page_visits enable row level security;

create policy "Anyone can record visits"
on public.page_visits
for insert
to anon, authenticated
with check (true);

create policy "Admins read visits"
on public.page_visits
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create index page_visits_created_at_idx on public.page_visits (created_at desc);
create index page_visits_session_idx on public.page_visits (session_id);
create index page_visits_utm_source_idx on public.page_visits (utm_source);

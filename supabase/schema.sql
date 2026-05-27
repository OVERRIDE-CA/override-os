-- OVERRIDE OS — Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  planet text not null,
  intensity text,
  recommendation text,
  level text not null default 'NEW_RECRUIT',
  status text not null default 'LAUNCHED',
  scan_count integer not null default 1,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- EVENTS TABLE
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  event_type text not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc', now())
);

-- INDEXES
create index if not exists users_email_idx on public.users(email);
create index if not exists users_planet_idx on public.users(planet);
create index if not exists users_level_idx on public.users(level);
create index if not exists events_user_id_idx on public.events(user_id);
create index if not exists events_type_idx on public.events(event_type);

-- ROW LEVEL SECURITY
alter table public.users enable row level security;
alter table public.events enable row level security;

-- POLICIES — allow anon insert and select (retail activation)
create policy "Allow anon insert users"
  on public.users for insert
  to anon
  with check (true);

create policy "Allow anon select users"
  on public.users for select
  to anon
  using (true);

create policy "Allow anon update users"
  on public.users for update
  to anon
  using (true);

create policy "Allow anon insert events"
  on public.events for insert
  to anon
  with check (true);

create policy "Allow anon select events"
  on public.events for select
  to anon
  using (true);

-- UPDATED_AT TRIGGER
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

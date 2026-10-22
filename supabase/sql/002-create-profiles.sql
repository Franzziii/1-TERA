-- 002 — profiles
--
-- One row per person who signs in. It holds who they are and whether
-- they are a Reporter or an Operator.
-- Run it yourself: Supabase -> SQL Editor -> New query -> paste -> Run

-- 1. The table ------------------------------------------------------

create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  full_name   text        not null,
  phone       text,
  role        text        not null default 'reporter'
                          check (role in ('reporter', 'operator')),
  consent_at  timestamptz not null default now()
);

-- 2. A helper: "is the person asking an Operator?" ------------------
--
-- A policy on `profiles` cannot read `profiles` directly to check the
-- role, because that would make the policy call itself forever. This
-- small function reads the table with the owner's rights instead, so the
-- policies below can use it safely. It checks the signed-in person only.

create or replace function public.is_operator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'operator'
  );
$$;

revoke all on function public.is_operator() from public, anon;
grant execute on function public.is_operator() to authenticated;

-- 3. Row Level Security ---------------------------------------------
--
-- With RLS on, nobody can touch a row unless a policy allows it.

alter table profiles enable row level security;

-- Each person may read their own row.
create policy "people read their own profile"
  on profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Operators may read every row.
create policy "operators read all profiles"
  on profiles for select
  to authenticated
  using (public.is_operator());

-- A person may create their own row, and only as a Reporter. This is what
-- stops anyone from making themselves an Operator through the app.
create policy "people create their own reporter profile"
  on profiles for insert
  to authenticated
  with check ((select auth.uid()) = id and role = 'reporter');

-- Deliberately NO update and NO delete policy: nobody can change a role
-- or remove a profile through the app. Operators are made by hand:
--
--   update profiles set role = 'operator' where id = '<their user id>';
--
-- (run that in the SQL Editor, never from app code).

-- 4. Check it worked -------------------------------------------------
-- Supabase -> Table Editor -> profiles should show NO "RLS disabled"
-- warning.

-- 003 — create a profile automatically when someone signs up
--
-- Why a trigger? With email confirmation, a new person is NOT signed in
-- yet when they press "Sign up", so the app cannot insert their profile
-- row itself (Row Level Security would say no). Instead the database does
-- it for them the moment the account is created.
--
-- A trigger is a rule that runs by itself when something happens. This
-- one runs after a row is added to Supabase's own `auth.users` table.
--
-- The role is ALWAYS 'reporter' here, whatever the sign-up form sends.
-- Operators are made by hand later (see the end of 002-create-profiles).
--
-- Run it yourself: Supabase -> SQL Editor -> New query -> paste -> Run

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone, role, consent_at)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(new.email, '@', 1)
    ),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    'reporter',
    now()
  );
  return new;
end;
$$;

-- Only the database itself should run this function.
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

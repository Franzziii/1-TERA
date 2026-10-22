-- 004 — reports
--
-- One row per emergency report. Reporters create them; Operators read
-- them all and move them through the statuses.
-- Run it yourself: Supabase -> SQL Editor -> New query -> paste -> Run

-- 1. The table ------------------------------------------------------

create table if not exists reports (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- Who filed it. Filled in by the database from the signed-in account,
  -- so nobody can file a report "as" somebody else.
  reporter_id     uuid not null default auth.uid()
                  references profiles(id) on delete cascade,

  emergency_type  text not null
                  check (emergency_type in
                    ('medical', 'fire', 'natural', 'accident', 'other')),
  description     text not null
                  check (char_length(description) between 1 and 1000),

  -- GPS is optional (the phone may block it) ...
  latitude        double precision check (latitude between -90 and 90),
  longitude       double precision check (longitude between -180 and 180),
  landmark        text check (char_length(landmark) <= 300),

  status          text not null default 'received'
                  check (status in
                    ('received', 'verified', 'dispatched', 'resolved')),
  verified_at     timestamptz,
  dispatched_at   timestamptz,
  resolved_at     timestamptz,
  operator_notes  text check (char_length(operator_notes) <= 1000),

  -- ... but every report must say WHERE: GPS, a landmark, or both.
  constraint report_has_location check (
    (latitude is not null and longitude is not null)
    or char_length(coalesce(landmark, '')) > 0
  )
);

create index if not exists reports_created_at_idx on reports (created_at desc);
create index if not exists reports_reporter_idx on reports (reporter_id);

-- 2. Row Level Security ---------------------------------------------
--
-- RLS is ON. Anything without a policy below is denied.
-- This uses public.is_operator() from 002-create-profiles.sql.

alter table reports enable row level security;

-- A Reporter reads only their own reports.
create policy "reporters read their own reports"
  on reports for select
  to authenticated
  using ((select auth.uid()) = reporter_id);

-- Operators read every report.
create policy "operators read all reports"
  on reports for select
  to authenticated
  using (public.is_operator());

-- A signed-in person may file a report for themselves, and it must start
-- as a fresh 'received' report with no operator fields filled in.
create policy "people file their own reports"
  on reports for insert
  to authenticated
  with check (
    (select auth.uid()) = reporter_id
    and status = 'received'
    and verified_at is null
    and dispatched_at is null
    and resolved_at is null
    and operator_notes is null
  );

-- Only Operators may change a report (status, times, notes).
-- Note: RLS chooses which ROWS you may touch, not which columns, so an
-- Operator could edit any field. Acceptable for the MVP because Operator
-- accounts are made by hand.
create policy "operators update reports"
  on reports for update
  to authenticated
  using (public.is_operator())
  with check (public.is_operator());

-- Deliberately NO delete policy: nobody can delete a report.

-- 3. Live updates ---------------------------------------------------
--
-- Lets the app hear "a report changed" the moment it happens, so the
-- Operator's list and the Reporter's status update without refreshing.
-- Realtime still respects the policies above: people are only told about
-- rows they are allowed to read.

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'reports'
  ) then
    alter publication supabase_realtime add table public.reports;
  end if;
end
$$;

-- 4. Check it worked -------------------------------------------------
-- Table Editor -> reports should show NO "RLS disabled" warning.

# 07 — Operator live list and status updates

**What to build:** the Operator opens one page that shows every report,
newest first, updating by itself as new ones arrive, with unhandled
reports highlighted. Each report shows its type, description, landmark,
the Reporter's name and phone, the time, and an "Open location in maps"
link. The Operator can mark a report verified, dispatched or resolved and
add an optional note, and the Reporter's screen shows the new Status.

**Blocked by:** 05

**Status:** todo

- [ ] The Operator sees all reports, newest first, with unhandled ones
      highlighted
- [ ] A new report appears on the Operator's screen without refreshing
- [ ] Each report shows the details listed above, and the maps link opens
      the location (or shows the landmark if there is no GPS)
- [ ] Buttons mark a report verified, dispatched or resolved, and the
      matching time (`verified_at`, `dispatched_at`, `resolved_at`) is
      recorded
- [ ] An optional operator note can be saved with a report
- [ ] The Reporter's My reports screen shows the new Status
- [ ] A Reporter cannot change any report's Status
- [ ] Works on the live URL, with the Operator on a computer and a
      Reporter on a phone

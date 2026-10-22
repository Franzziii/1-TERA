# 05 — Send a report

**What to build:** a signed-in Reporter fills in an emergency type, a short
description, taps "Use my location" to capture GPS, adds a landmark or
address, and sends the report. It is saved with Status `received`.

**Blocked by:** 04

**Status:** todo

- [x] The `reports` table exists with RLS on and policies matching the
      spec (a Reporter reads only their own reports, Operators read all,
      a Reporter may create a report only for themselves and only as
      `received`, nobody can delete)
- [x] The database change is saved as a numbered SQL file in the repo
- [x] The form asks for emergency type (medical, fire, natural, accident,
      other), description, and landmark or address
- [x] The "Use my location" button fills in GPS, and the form still works
      if the person blocks location and types a landmark
- [x] Sending saves the report and takes the Reporter to My reports
- [ ] Works on the live URL, from a phone

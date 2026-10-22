# 02 — Connected to Supabase

**What to build:** the live site is connected to the team's hosted
Supabase project and shows "Database connected". The `profiles` table
exists with Row Level Security turned on and policies written, so only the
right people can read or write rows.

**Blocked by:** 01

**Status:** todo

- [ ] The Supabase URL and publishable key are set locally and in Vercel,
      and no secret key appears anywhere in the project
- [ ] The `profiles` table exists, with RLS on and policies matching the
      spec (people read their own row, Operators read all, a person may
      create only their own row with role `reporter`)
- [ ] The database change is saved as a numbered SQL file in the repo
- [ ] The site shows "Database connected" after a safe read
- [ ] Works on the live URL

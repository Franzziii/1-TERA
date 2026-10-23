# Spec: 1TERA — One Tigbauan Emergency Response App (MVP slice)

## Problem
When an emergency happens in Tigbauan, a resident has to phone it in or
find a barangay official. Some residents have no call credit. The
Operator then writes the details down, asks again where the emergency
is, and passes it along by hand. Time is lost finding the location and
copying details between people.

## Solution
A registered Reporter sends an emergency report from their phone with
their GPS location attached. The Operator sees every new report on one
live list that updates by itself, and moves each report through its
Status: received, verified, dispatched, resolved. The Reporter can see
the Status of their own reports, so they know someone got them.

## The user
The **Operator**, the radio operator at the Tigbauan MDRRMO, is the
core user. The **Reporter**, a registered resident, is the person who
feeds the Operator's list. Nobody else has an account in this MVP.

## User stories
1. As a Reporter, I want to sign up with my email and confirm it, so
   that the Operator knows who sent my reports.
2. As a Reporter, I want to send a report with my location in a few
   taps, so that I do not need call credit or a long phone call.
3. As a Reporter, I want to see the Status of my own reports, so that I
   know someone received and acted on them.
4. As an Operator, I want to see new reports appear on their own, newest
   first and highlighted, so that I do not miss one.
5. As an Operator, I want each report to show the type, description,
   landmark, the Reporter's name and phone, and a link to its location,
   so that I can find the place without calling back.
6. As an Operator, I want to mark a report verified, dispatched or
   resolved, and add a note, so that everyone sees where it stands and
   old reports leave the active list.
7. As a Reporter, I want only me and the Operator to see my reports and
   details, so that my personal information stays private.

## Screens
1. **Welcome**: one line explaining 1TERA, with Sign up and Sign in
   buttons.
2. **Sign up**: full name, email, password, phone number (unverified),
   and a required checkbox agreeing that name, phone and location are
   shared with the MDRRMO. Afterwards: "Check your email to confirm your
   account."
3. **Sign in**: email and password. An Operator goes to the live list; a
   Reporter goes to the report form.
4. **Report an emergency** (Reporter): emergency type, short description,
   a "Use my location" button that captures GPS, and a landmark or
   address box as backup. Sending goes to My reports.
5. **My reports** (Reporter): only their own reports, newest first, each
   with its Status.
6. **Live list** (Operator): all reports, newest first, updating by
   itself, with unhandled ones highlighted. Each card shows the type,
   description, landmark, Reporter name and phone, the time, and an
   "Open location in maps" link. It has buttons to mark a report
   verified, dispatched or resolved, and a box for an optional note.
   Above the list is **one live map** with a pin for every active report
   that has GPS (red = received, blue = verified, purple = dispatched).
   Pins appear and change colour by themselves. The map uses the free
   Leaflet library and OpenStreetMap pictures: added after the first
   spec with the team's approval.

A **Sign out** button appears in the header of every signed-in screen.

## Data
Two tables. Row Level Security is on for both.

**`profiles`**: one row per person.
- `id`: the same as their sign-in account.
- `full_name`, `phone`.
- `role`: `reporter` or `operator`.
- `consent_at`: when they agreed to the sharing terms, filled in at
  sign-up.
- *Read:* each person reads their own row; Operators read all rows.
- *Write:* a person may create their own row, and only with role
  `reporter`. Nobody can change a role through the app. Operator
  accounts are made by hand in the Supabase dashboard.

**`reports`**: one row per emergency.
- `id`, `created_at`.
- `reporter_id`: who filed it, set automatically from the signed-in
  account.
- `emergency_type`: `medical`, `fire`, `natural`, `accident` or `other`.
- `description`.
- `latitude`, `longitude`: both optional, in case GPS is blocked.
- `landmark`: the backup location text.
- `status`: `received` (the default), `verified`, `dispatched` or
  `resolved`.
- `verified_at`, `dispatched_at`, `resolved_at`: timestamps. The gap
  between `created_at` and `dispatched_at` is the report-to-dispatch time
  measured in the drill.
- `operator_notes`: optional text.
- *Read:* a Reporter reads only their own reports; Operators read all.
- *Write:* a signed-in Reporter may create a report for themselves,
  always starting as `received`. Only Operators may change `status`,
  the timestamps and `operator_notes`. Nobody can delete a report.

Database rules choose which *rows* a person can touch, not which
*columns*, so an Operator could in theory edit any field. This is
acceptable for the MVP because Operator accounts are made by hand.

The live list uses Supabase's built-in realtime updates, switched on for
the `reports` table.

## Login
Yes. Supabase Auth with email and password, plus email confirmation at
sign-up. People stay signed in on their device. The phone number is an
unverified contact field. Supabase's built-in email sender is
rate-limited, so create the demo accounts well before the drill.

## Done for the demo
On the LIVE URL, from a phone:
- [ ] A new Reporter signs up, confirms their email and signs in.
- [ ] The Reporter sends a report with the location button and sees it
      in My reports as `received`.
- [ ] On the Operator's screen, the report appears by itself at the top,
      highlighted.
- [ ] The Operator marks it verified, then dispatched, and the
      Reporter's screen shows the new Status.
- [ ] A second Reporter cannot see the first Reporter's report.
- [ ] A Reporter who opens the Operator page is turned away.
- [ ] The drill is run twice (phone call and paper log, then the app)
      and both report-to-dispatch times are written down.

## Out of scope
- Phone OTP and new-device codes
- Google sign-in
- Superadmin and MDRRMO admin accounts, and the other roles from the
  paper
- Assigning a specific responder
- Photo upload
- Sound, SMS and push alerts
- Heatmap, analytics, predictive ML and downloadable reports
- Syncing between unit databases
- Hotlines directory, feedback forms and system-wide alerts
- The existing Flask/MySQL code (background and evidence only)

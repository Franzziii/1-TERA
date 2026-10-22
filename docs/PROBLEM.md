# 1TERA — One Tigbauan Emergency Response App (MVP slice)

## Who
Two account types:

- **Operator** (the core user): the radio operator at the Tigbauan
  MDRRMO, who receives, verifies and passes on emergency reports.
- **Reporter**: a registered resident of Tigbauan who files a report.

## The struggle
**To be gathered by October 29, 2026.** What we know so far comes from
the team's capstone paper, not from first-hand observation:

- Reporting depends on phone calls and paper records.
- Some residents have no call credit (load), so they cannot phone in.
- Operators and the MDRRMO struggle to find out where the emergency is.
- Details are passed between the barangay, radio operator and MDRRMO,
  and may be written down or retyped before a responder is contacted.
  Each handoff risks delay, missing details or confusion.

Still missing: one real incident or drill with clock times (report
received, location confirmed, responder sent), and how often delays
happen. Plan: interview a radio operator at the Tigbauan MDRRMO about
their last emergency by October 29, 2026.

## Today's workaround
A phone call (or a visit to a barangay official), then a handwritten or
retyped record, then contacting a responder. The cost in minutes has
**not been measured yet**. The paper's "80% faster" claim has no
baseline and must not be presented as a measured result.

## The MVP
A registered reporter sends an emergency report with their GPS
location, and the operator sees it on one live list and marks it
received, verified, dispatched or resolved.

- Sign-in: email and password, with email confirmation at signup. The
  phone number is an unverified contact field. Users stay signed in on
  their device.
- Report form: emergency type, short description, GPS captured by a
  button, and a landmark or address as backup.
- Operator view: the list updates by itself, newest first, with
  unhandled reports highlighted.
- Reporter view: only their own reports and their status.
- Privacy: reporters see only their own reports; operators see all.
  Enforced with Row Level Security. Operator accounts are created by
  hand in the Supabase dashboard.

Why an app and not a Google Form or Messenger template: those could
standardise reports. The app's possible edge is GPS location plus one
shared live list. This is a claim to test in the drill, not a fact.

## How we'll know it worked
A drill before Session 3: a teammate acts as the operator and a barangay
official observes (to be asked by October 29, 2026). Time
**report-to-dispatch** twice: once with the old method (phone call and
paper log), once with the app. The demo shows the two measured numbers.

## Out of scope
- Phone OTP and new-device codes
- Google sign-in
- Superadmin and MDRRMO admin accounts, and the other roles from the paper
- Assigning a specific responder
- Photo upload
- Sound, SMS and push alerts
- Heatmap, analytics, predictive ML and downloadable reports
- Syncing between unit databases
- The existing Flask/MySQL code (background and evidence only)

## Glossary
- **Report**: one emergency submission with a location.
- **Reporter**: a registered resident who files reports.
- **Operator**: the radio operator who verifies and updates reports.
- **Responder**: a unit (rescue team, ambulance, fire truck), not a named person.
- **Status**: where a report stands: received, verified, dispatched or resolved.
- **Load**: mobile call credit, not data.

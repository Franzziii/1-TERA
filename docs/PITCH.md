# Pitch: 1TERA — One Tigbauan Emergency Response App

Presenters: **Hanz** (beats 1 and 4), **Franz** (beats 2 and 5),
**Alexymar** (beat 3). Swap names to suit your team.

**Before you present:** the text in [BRACKETS] in beat 1 is a slot for a
real moment from your operator interview (due October 29, 2026). Do not
invent it. If the interview has not happened yet, say the plain version
written under the bracket.

## The script

### 1. The person — Hanz (~45s)

Picture the radio operator at the Tigbauan MDRRMO. A call comes in
about an accident. The caller is scared and cannot say exactly where
they are. The operator writes it down, asks again, and writes it again.
[INSERT one real moment from the interview, for example: "Last month it
took them __ minutes just to find the place."] Every minute spent
finding the location is a minute nobody is on the way.

*If the interview has not happened yet, say instead:* "Our research
tells us operators lose time finding the location, and we are
interviewing a real radio operator this week to measure it."

### 2. Today — Franz (~30s)

Today a report starts with a phone call, or a visit to a barangay
official. Not every resident has call credit. Then the details are
written on paper, passed along, and sometimes typed again before a
responder is contacted. Each handoff can lose time or lose details. We
have not yet measured how many minutes that costs. That is exactly what
we are going to measure.

### 3. Our fix — Alexymar (~45s)

Our fix is 1TERA. A registered resident sends an emergency report from
their phone, with their GPS location attached. The radio operator sees
it on one live list that updates by itself, and marks it received,
verified, or dispatched. The resident sees that status too, so they
know someone got their report. We rebuilt one small slice of our
capstone so it can go live.

### 4. The demo moment — Hanz (~30s)

In the demo, one of us signs in and reports an emergency using the
location button. On the operator's screen, the report appears on its
own, at the top, highlighted. The operator marks it verified, then
dispatched, and the reporter's phone shows the change. That is the
whole core job, in under three minutes.

### 5. How we'll know — Franz (~30s)

We will prove it with a drill. A teammate plays the operator, and a
barangay official watches. We time report-to-dispatch twice: once with
a phone call and a paper log, once with the app. We will show you both
numbers, and we will tell you honestly if the app does not win.

## The three hardest questions

**1. "Have you actually watched anyone struggle with this?"**
This attacks the weakest point in `docs/PROBLEM.md`.
Honest answer: "Our capstone research, with surveys, interviews and
observation, identified the problem. But we do not yet have measured
times for this MVP. We are interviewing a radio operator by October 29
and running the drill, so we will bring real numbers to Session 3."
Do **not** quote the paper's 80% or 60% figures. They have no baseline,
and the first sceptical question will expose that.

**2. "Why not a Google Form and a shared sheet? It is free."**
Honest answer: "A form could standardise the details, and it might be
good enough. What it cannot do easily is capture a reliable GPS
location and show new reports to the operator on one live screen. Our
drill tests whether that difference matters. If it does not, we will
say so."

**3. "What stops fake reports, and what if the reporter has no signal?"**
Honest answer: "Every report is tied to a confirmed email and a phone
number, so the operator knows who sent it, and the operator verifies
before dispatching. The phone number is not verified yet, and the app
needs a connection. Offline reporting and phone OTP are on our later
list, and we will say so openly."

## Is the evidence strong enough?

**Thin right now.** The problem is plausible, but nothing in
`docs/PROBLEM.md` is first-hand. To strengthen it before you present:
1. Interview one real radio operator and write down 3 clock times from
   their last emergency.
2. Ask the barangay official one question: "How do you report an
   emergency to the MDRRMO today?" Quote their answer.
3. Time the old method once, even informally, with a teammate calling
   a classmate who writes the report on paper.

Even one real number turns this from "we think" into "we saw".

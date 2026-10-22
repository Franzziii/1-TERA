# 03 — Reporter sign-up

**What to build:** a new resident opens the Welcome screen, signs up with
their name, email, password and phone number, ticks the consent checkbox,
and is told to check their email. After confirming the email, their
profile exists with role Reporter and the time they gave consent.

**Blocked by:** 02

**Status:** todo

- [x] Welcome screen has Sign up and Sign in buttons
- [x] Sign up asks for full name, email, password, phone, and a required
      consent checkbox
- [x] After signing up, the person sees "Check your email to confirm your
      account"
- [x] A confirmed account has a profile with role `reporter` and a
      `consent_at` time
- [x] The role cannot be set to anything other than `reporter` through
      the app
- [ ] Works on the live URL, from a phone

# 04 — Sign in, sign out and role routing

**What to build:** people can sign in with email and password and stay
signed in on their device. A Reporter lands on the report form; an
Operator lands on the live list. A Reporter who tries to open the Operator
page is turned away. Every signed-in screen has a Sign out button.

**Blocked by:** 03

**Status:** todo

- [x] Sign in works with the right email and password, and shows a clear
      message for wrong ones
- [x] A Reporter lands on the report form after signing in
- [ ] One Operator account exists, made by hand in the Supabase
      dashboard, and it lands on the Operator page
- [x] A Reporter who opens the Operator page is turned away
- [x] Someone who is not signed in is sent to Sign in
- [x] Sign out works from the header
- [ ] Works on the live URL

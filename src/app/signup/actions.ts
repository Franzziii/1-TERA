"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type SignupState = { error?: string; sentTo?: string } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

export async function signup(
  _previous: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const consent = formData.get("consent") === "on";

  // Check everything on the server too: the browser can be bypassed.
  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "Please enter your full name." };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { error: "Please enter a valid email address." };
  }
  if (!PHONE_PATTERN.test(phone)) {
    return { error: "Please enter a phone number, for example 0917 123 4567." };
  }
  if (password.length < 8 || password.length > 72) {
    return { error: "Your password needs at least 8 characters." };
  }
  if (!consent) {
    return {
      error:
        "Please tick the box to agree to share your details with the MDRRMO.",
    };
  }

  // Where the link in the confirmation email should bring the person back.
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // The database trigger in 003-profile-on-signup.sql reads these to
      // create the profile. The role is NOT sent: it is always 'reporter'.
      data: { full_name: fullName, phone },
      emailRedirectTo: `${protocol}://${host}/auth/callback`,
    },
  });

  if (error) {
    if (error.status === 429) {
      return {
        error:
          "Too many sign-up emails were sent just now. Please wait a few minutes and try again.",
      };
    }
    return { error: "We could not create your account. Please try again." };
  }

  return { sentTo: email };
}

import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * The link in the confirmation email lands here.
 *
 * Supabase sends either a `code` (the usual way) or a `token_hash` and
 * `type`. We swap it for a real sign-in, then send the person home, where
 * they are routed by role. We only ever redirect to fixed paths on this
 * site, never to an address taken from the link.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let failed = true;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = !!error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    failed = !!error;
  }

  // Opened the link on a different phone or browser than the one used to
  // sign up? The sign-in cannot finish there, but the email is confirmed.
  return NextResponse.redirect(
    failed ? `${origin}/login?notice=confirmed` : `${origin}/`,
  );
}

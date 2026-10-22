import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps people signed in.
 *
 * A sign-in lasts about an hour and is then renewed with a longer-lived
 * "refresh" token. Server pages cannot save the renewed sign-in back to
 * the browser, so this runs before every page and does it for them.
 * Without it, people would be signed out after an hour.
 *
 * It only refreshes the sign-in. It does not decide who may see what:
 * each page checks that itself (see src/lib/auth.ts), and the database's
 * Row Level Security is the final lock.
 */
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Asking who the user is is what triggers the refresh.
  await supabase.auth.getUser();

  return response;
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/**
 * Who is signed in, and what is their role?
 *
 * `getUser()` asks Supabase to check the sign-in cookie is real, so this
 * is safe to trust. The profile comes from the `profiles` table, which
 * Row Level Security lets each person read for themselves.
 */
export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", user.id)
    .single<Profile>();
  if (!profile) return null;

  return { user, profile };
}

/** Pages for Reporters. Anyone else is sent somewhere sensible. */
export async function requireReporter() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "reporter") redirect("/operator");
  return session;
}

/** Pages for Operators. A Reporter who tries to open one is turned away. */
export async function requireOperator() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "operator") redirect("/report");
  return session;
}

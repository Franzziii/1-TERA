import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Always run this page on the server for each visit. Without this, Next.js
// can save a copy made at build time and show a stale database status.
export const dynamic = "force-dynamic";

// Asks the database one harmless question. Row Level Security means a
// visitor who is not signed in sees zero rows, but the question itself
// only works if the Supabase keys and the `profiles` table are right.
async function DatabaseStatus() {
  let connected = false;
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });
    connected = !error;
  } catch {
    connected = false;
  }

  return (
    <p
      className={
        connected
          ? "text-xs font-medium text-green-600"
          : "text-xs font-medium text-red-600"
      }
    >
      {connected ? "Database connected" : "Database not connected"}
    </p>
  );
}

export default async function Welcome() {
  // Someone who is already signed in goes straight to their own screen.
  const session = await getSessionProfile();
  if (session) {
    redirect(session.profile.role === "operator" ? "/operator" : "/report");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-4 py-12">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
          One Tigbauan Emergency Response App
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">1TERA</h1>
        <p className="text-base text-muted-foreground">
          Report an emergency in Tigbauan with your location attached, and see
          when the MDRRMO has received it and sent help.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className={buttonVariants({ size: "lg", className: "flex-1" })}
        >
          Sign up
        </Link>
        <Link
          href="/login"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
            className: "flex-1",
          })}
        >
          Sign in
        </Link>
      </div>

      <footer className="mt-4 border-t border-border pt-4">
        <DatabaseStatus />
      </footer>
    </main>
  );
}

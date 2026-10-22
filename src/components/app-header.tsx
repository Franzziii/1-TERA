import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions";
import type { Profile } from "@/lib/types";

/** Shown at the top of every signed-in screen. */
export function AppHeader({ profile }: { profile: Profile }) {
  const links =
    profile.role === "operator"
      ? [{ href: "/operator", label: "Live list" }]
      : [
          { href: "/report", label: "Report" },
          { href: "/my-reports", label: "My reports" },
        ];

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="font-semibold tracking-tight">1TERA</span>
          <nav className="flex items-center gap-3 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {profile.full_name} ·{" "}
            {profile.role === "operator" ? "Operator" : "Reporter"}
          </span>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

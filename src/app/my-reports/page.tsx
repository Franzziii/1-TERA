import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireReporter } from "@/lib/auth";
import { formatTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { EMERGENCY_LABELS, type Report } from "@/lib/types";

export const metadata = { title: "My reports — 1TERA" };
export const dynamic = "force-dynamic";

export default async function MyReportsPage() {
  const { user, profile } = await requireReporter();

  // Row Level Security already limits this to the person's own reports.
  // Filtering by id as well makes the intention obvious to the next reader.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("reporter_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Report[]>();
  const reports = data ?? [];

  return (
    <>
      <AppHeader profile={profile} />
      <RealtimeRefresh />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">My reports</h1>
          <Link href="/report" className={buttonVariants({ size: "sm" })}>
            New report
          </Link>
        </header>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            We could not load your reports. Please refresh the page.
          </p>
        )}

        {!error && reports.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You have not sent any reports yet. If there is an emergency, tap
            New report.
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {reports.map((report) => (
            <li key={report.id}>
              <Card>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">
                      {EMERGENCY_LABELS[report.emergency_type]}
                    </p>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-sm">{report.description}</p>
                  {report.landmark && (
                    <p className="text-sm text-muted-foreground">
                      Near: {report.landmark}
                    </p>
                  )}
                  <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                    <li>Sent {formatTime(report.created_at)}</li>
                    {report.verified_at && (
                      <li>Verified {formatTime(report.verified_at)}</li>
                    )}
                    {report.dispatched_at && (
                      <li>Dispatched {formatTime(report.dispatched_at)}</li>
                    )}
                    {report.resolved_at && (
                      <li>Resolved {formatTime(report.resolved_at)}</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

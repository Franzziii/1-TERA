import { AppHeader } from "@/components/app-header";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { requireOperator } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ReportCard, type ReportWithReporter } from "./report-card";
import { ReportsMap } from "./reports-map";

export const metadata = { title: "Live list — 1TERA" };
export const dynamic = "force-dynamic";

export default async function OperatorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { profile } = await requireOperator();
  const { error: updateError } = await searchParams;

  // Operators may read every report and every profile (Row Level Security
  // allows it for the 'operator' role only).
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*, profiles(full_name, phone)")
    .order("created_at", { ascending: false })
    .returns<ReportWithReporter[]>();

  const reports = data ?? [];
  const active = reports.filter((report) => report.status !== "resolved");
  const resolved = reports.filter((report) => report.status === "resolved");
  const unhandled = active.filter((report) => report.status === "received");
  const withoutGps = active.filter(
    (report) => report.latitude === null || report.longitude === null,
  ).length;

  return (
    <>
      <AppHeader profile={profile} />
      <RealtimeRefresh />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Live list</h1>
          <p className="text-sm text-muted-foreground">
            {unhandled.length === 0
              ? "No new reports waiting."
              : `${unhandled.length} new ${unhandled.length === 1 ? "report" : "reports"} waiting.`}{" "}
            This page updates by itself.
          </p>
        </header>

        {(error || updateError) && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error
              ? "We could not load the reports. Please refresh the page."
              : "That change did not save. Please try again."}
          </p>
        )}

        <section className="flex flex-col gap-2">
          <ReportsMap
            reports={active.map((report) => ({
              id: report.id,
              emergency_type: report.emergency_type,
              description: report.description,
              status: report.status,
              latitude: report.latitude,
              longitude: report.longitude,
              landmark: report.landmark,
            }))}
          />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-red-600">Red</span> = new,{" "}
            <span className="font-medium text-blue-600">blue</span> = verified,{" "}
            <span className="font-medium text-purple-600">purple</span> =
            dispatched.
            {withoutGps > 0 &&
              ` ${withoutGps} active ${withoutGps === 1 ? "report has" : "reports have"} no GPS and ${withoutGps === 1 ? "is" : "are"} not on the map.`}
          </p>
        </section>

        {!error && active.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nothing active right now.
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {active.map((report) => (
            <li key={report.id}>
              <ReportCard report={report} />
            </li>
          ))}
        </ul>

        {resolved.length > 0 && (
          <details className="flex flex-col gap-4">
            <summary className="cursor-pointer text-sm font-medium">
              Resolved ({resolved.length})
            </summary>
            <ul className="mt-4 flex flex-col gap-4">
              {resolved.map((report) => (
                <li key={report.id}>
                  <ReportCard report={report} />
                </li>
              ))}
            </ul>
          </details>
        )}
      </main>
    </>
  );
}

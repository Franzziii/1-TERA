import { AppHeader } from "@/components/app-header";
import { requireReporter } from "@/lib/auth";

export const metadata = { title: "Report an emergency — 1TERA" };

export default async function ReportPage() {
  const { profile } = await requireReporter();

  return (
    <>
      <AppHeader profile={profile} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Report an emergency
        </h1>
        <p className="text-sm text-muted-foreground">
          The report form arrives in the next ticket.
        </p>
      </main>
    </>
  );
}

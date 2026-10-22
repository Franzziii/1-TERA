import { AppHeader } from "@/components/app-header";
import { requireReporter } from "@/lib/auth";
import { ReportForm } from "./report-form";

export const metadata = { title: "Report an emergency — 1TERA" };

export default async function ReportPage() {
  const { profile } = await requireReporter();

  return (
    <>
      <AppHeader profile={profile} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Report an emergency
          </h1>
          <p className="text-sm text-muted-foreground">
            Your name and phone number are shared with the MDRRMO so they can
            reach you.
          </p>
        </header>
        <ReportForm />
      </main>
    </>
  );
}

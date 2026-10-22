import { AppHeader } from "@/components/app-header";
import { requireOperator } from "@/lib/auth";

export const metadata = { title: "Live list — 1TERA" };

export default async function OperatorPage() {
  const { profile } = await requireOperator();

  return (
    <>
      <AppHeader profile={profile} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Live list</h1>
        <p className="text-sm text-muted-foreground">
          The live list of reports arrives in a later ticket.
        </p>
      </main>
    </>
  );
}

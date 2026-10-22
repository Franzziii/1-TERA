import { SignupForm } from "./signup-form";

export const metadata = { title: "Sign up — 1TERA" };

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          You need an account so the MDRRMO knows who sent a report.
        </p>
      </header>
      <SignupForm />
    </main>
  );
}

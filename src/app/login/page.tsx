import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in — 1TERA" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      </header>
      <LoginForm
        notice={
          notice === "confirmed"
            ? "Your email is confirmed. Please sign in."
            : undefined
        }
      />
    </main>
  );
}

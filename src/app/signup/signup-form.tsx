"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, type SignupState } from "./actions";

export function SignupForm() {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signup,
    undefined,
  );

  if (state?.sentTo) {
    return (
      <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Check your email to confirm your account
        </h2>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to <strong>{state.sentTo}</strong>. Open
          it on this phone, then sign in. If you do not see it, look in your
          spam folder.
        </p>
        <Link href="/login" className="text-sm font-medium underline">
          Go to Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          required
          maxLength={100}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0917 123 4567"
          required
          maxLength={20}
        />
        <p className="text-xs text-muted-foreground">
          So the MDRRMO can reach you. We do not verify it yet.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
        />
        <p className="text-xs text-muted-foreground">At least 8 characters.</p>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4"
        />
        <span>
          I agree that my name, phone number and location are shared with the
          Tigbauan MDRRMO when I report an emergency.
        </span>
      </label>

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creating account…" : "Sign up"}
      </Button>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOperator } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Which time column to stamp when a report moves to each status.
const TIME_COLUMN = {
  verified: "verified_at",
  dispatched: "dispatched_at",
  resolved: "resolved_at",
} as const;

type MovableStatus = keyof typeof TIME_COLUMN;

function isMovableStatus(value: string): value is MovableStatus {
  return value in TIME_COLUMN;
}

/** Move a report to verified, dispatched or resolved, and record the time. */
export async function setStatus(formData: FormData) {
  // Check the role here as well as in the database: two locks, not one.
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!UUID_PATTERN.test(id) || !isMovableStatus(status)) {
    redirect("/operator?error=update");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({ status, [TIME_COLUMN[status]]: new Date().toISOString() })
    .eq("id", id);

  if (error) redirect("/operator?error=update");
  revalidatePath("/operator");
}

/** Save the Operator's note on a report. */
export async function saveNote(formData: FormData) {
  await requireOperator();

  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!UUID_PATTERN.test(id) || note.length > 1000) {
    redirect("/operator?error=update");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({ operator_notes: note === "" ? null : note })
    .eq("id", id);

  if (error) redirect("/operator?error=update");
  revalidatePath("/operator");
}

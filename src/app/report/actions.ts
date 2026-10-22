"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EMERGENCY_TYPES, type EmergencyType } from "@/lib/types";

export type ReportState = { error?: string } | undefined;

function readCoordinate(value: FormDataEntryValue | null, limit: number) {
  const text = String(value ?? "").trim();
  if (text === "") return null;
  const number = Number(text);
  if (!Number.isFinite(number) || Math.abs(number) > limit) return undefined;
  return number;
}

export async function createReport(
  _previous: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const type = String(formData.get("emergency_type") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const landmark = String(formData.get("landmark") ?? "").trim();
  const latitude = readCoordinate(formData.get("latitude"), 90);
  const longitude = readCoordinate(formData.get("longitude"), 180);

  // Check everything here too: the browser can be bypassed.
  if (!(EMERGENCY_TYPES as readonly string[]).includes(type)) {
    return { error: "Please choose the type of emergency." };
  }
  if (description.length < 1 || description.length > 1000) {
    return { error: "Please describe what is happening (up to 1000 characters)." };
  }
  if (landmark.length > 300) {
    return { error: "The landmark or address is too long." };
  }
  if (latitude === undefined || longitude === undefined) {
    return { error: "The location did not look right. Please try the location button again." };
  }
  const hasGps = latitude !== null && longitude !== null;
  if (!hasGps && landmark === "") {
    return {
      error:
        "Please tell us where you are: tap the location button or type a landmark or address.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // `reporter_id` and `status` are filled in by the database (the signed-in
  // person, and 'received'). Row Level Security refuses anything else.
  const { error } = await supabase.from("reports").insert({
    emergency_type: type as EmergencyType,
    description,
    latitude: hasGps ? latitude : null,
    longitude: hasGps ? longitude : null,
    landmark: landmark === "" ? null : landmark,
  });

  if (error) {
    return { error: "We could not send your report. Please try again." };
  }

  redirect("/my-reports");
}

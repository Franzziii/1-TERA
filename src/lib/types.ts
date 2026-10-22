// Shared names and labels, so every screen says the same thing.
// These must match the CHECK rules in supabase/sql/002 and 004.

export const EMERGENCY_TYPES = [
  "medical",
  "fire",
  "natural",
  "accident",
  "other",
] as const;
export type EmergencyType = (typeof EMERGENCY_TYPES)[number];

export const EMERGENCY_LABELS: Record<EmergencyType, string> = {
  medical: "Medical",
  fire: "Fire",
  natural: "Natural disaster",
  accident: "Accident",
  other: "Other",
};

export const STATUSES = [
  "received",
  "verified",
  "dispatched",
  "resolved",
] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  received: "Received",
  verified: "Verified",
  dispatched: "Dispatched",
  resolved: "Resolved",
};

export type Role = "reporter" | "operator";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: Role;
};

export type Report = {
  id: string;
  created_at: string;
  reporter_id: string;
  emergency_type: EmergencyType;
  description: string;
  latitude: number | null;
  longitude: number | null;
  landmark: string | null;
  status: Status;
  verified_at: string | null;
  dispatched_at: string | null;
  resolved_at: string | null;
  operator_notes: string | null;
};

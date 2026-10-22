"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EMERGENCY_LABELS, EMERGENCY_TYPES } from "@/lib/types";
import { createReport, type ReportState } from "./actions";

type Location =
  | { kind: "none" }
  | { kind: "asking" }
  | { kind: "ok"; latitude: number; longitude: number; accuracy: number }
  | { kind: "failed"; message: string };

export function ReportForm() {
  const [state, action, pending] = useActionState<ReportState, FormData>(
    createReport,
    undefined,
  );
  const [location, setLocation] = useState<Location>({ kind: "none" });

  function findMyLocation() {
    if (!("geolocation" in navigator)) {
      setLocation({
        kind: "failed",
        message: "This phone cannot share its location. Please type a landmark.",
      });
      return;
    }
    setLocation({ kind: "asking" });
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          kind: "ok",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
      (error) =>
        setLocation({
          kind: "failed",
          message:
            error.code === error.PERMISSION_DENIED
              ? "Location is blocked for this site. Please type a landmark or address instead."
              : "We could not find your location. Move near a window or type a landmark instead.",
        }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="emergency_type">Type of emergency</Label>
        <Select id="emergency_type" name="emergency_type" required defaultValue="">
          <option value="" disabled>
            Choose one…
          </option>
          {EMERGENCY_TYPES.map((type) => (
            <option key={type} value={type}>
              {EMERGENCY_LABELS[type]}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">What is happening?</Label>
        <Textarea
          id="description"
          name="description"
          required
          maxLength={1000}
          placeholder="For example: two motorcycles collided, one person is not moving."
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Where are you?</Label>

        <input
          type="hidden"
          name="latitude"
          value={location.kind === "ok" ? location.latitude : ""}
        />
        <input
          type="hidden"
          name="longitude"
          value={location.kind === "ok" ? location.longitude : ""}
        />

        <Button
          type="button"
          variant="outline"
          onClick={findMyLocation}
          disabled={location.kind === "asking"}
        >
          {location.kind === "asking"
            ? "Finding your location…"
            : location.kind === "ok"
              ? "Update my location"
              : "Use my location"}
        </Button>

        {location.kind === "ok" && (
          <p className="text-sm font-medium text-green-600">
            Location captured (accurate to about {Math.round(location.accuracy)}{" "}
            metres).
          </p>
        )}
        {location.kind === "failed" && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {location.message}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="landmark" className="font-normal text-muted-foreground">
            Landmark or address (needed if the location button does not work)
          </Label>
          <Input
            id="landmark"
            name="landmark"
            maxLength={300}
            placeholder="For example: in front of the Tigbauan public market"
          />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Send report"}
      </Button>
    </form>
  );
}

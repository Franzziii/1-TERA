"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Makes a page update by itself.
 *
 * It listens for changes to the `reports` table and, when one happens,
 * asks Next.js to reload the page's data. Supabase only tells us about
 * rows this person is allowed to read (Row Level Security still applies),
 * so a Reporter only hears about their own reports.
 *
 * It shows nothing on screen. Drop it into any page that lists reports.
 */
export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("reports-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}

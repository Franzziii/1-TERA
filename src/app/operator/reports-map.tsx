"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { EMERGENCY_LABELS, STATUS_LABELS, type Report } from "@/lib/types";

export type MapReport = Pick<
  Report,
  | "id"
  | "emergency_type"
  | "description"
  | "status"
  | "latitude"
  | "longitude"
  | "landmark"
>;

type Leaflet = typeof import("leaflet");

// Tigbauan, Iloilo. Used until there is a pin to zoom to.
const TIGBAUAN: [number, number] = [10.6747, 122.377];

const PIN_COLOUR = {
  received: "#dc2626", // red: nobody has looked at it yet
  verified: "#2563eb",
  dispatched: "#9333ea",
  resolved: "#16a34a",
} as const;

/**
 * One map with a pin for every active report that has a GPS location.
 *
 * The page around it reloads its data by itself when a report changes
 * (see RealtimeRefresh), which hands this component a new `reports`
 * list, so pins appear and change colour without refreshing.
 *
 * Map pictures come from OpenStreetMap's free tile server. No account or
 * key is needed; the attribution line on the map is required by them.
 */
export function ReportsMap({ reports }: { reports: MapReport[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const pins = useRef<LayerGroup | null>(null);
  const hasZoomed = useRef(false);

  // Replace all the pins with the current reports.
  const drawPins = useCallback(
    (L: Leaflet) => {
      if (!map.current || !pins.current) return;
      pins.current.clearLayers();

      const points: [number, number][] = [];
      for (const report of reports) {
        if (report.latitude === null || report.longitude === null) continue;
        const point: [number, number] = [report.latitude, report.longitude];
        points.push(point);

        const marker = L.circleMarker(point, {
          radius: report.status === "received" ? 11 : 8,
          color: "#ffffff",
          weight: 2,
          fillColor: PIN_COLOUR[report.status],
          fillOpacity: 0.95,
        });

        // Built with real elements and textContent, never HTML strings, so
        // text a reporter typed can never run as code in the Operator's page.
        const popup = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = `${EMERGENCY_LABELS[report.emergency_type]} · ${STATUS_LABELS[report.status]}`;
        const body = document.createElement("div");
        body.textContent = report.description.slice(0, 140);
        popup.append(title, body);
        if (report.landmark) {
          const near = document.createElement("div");
          near.textContent = `Near: ${report.landmark}`;
          popup.append(near);
        }
        marker.bindPopup(popup);
        pins.current.addLayer(marker);
      }

      // Zoom to the pins the first time there are any. After that, leave
      // the Operator's own panning and zooming alone.
      if (points.length > 0 && !hasZoomed.current) {
        hasZoomed.current = true;
        map.current.fitBounds(L.latLngBounds(points), {
          padding: [40, 40],
          maxZoom: 16,
        });
      }
    },
    [reports],
  );

  // Build the map once, then draw the pins on it.
  useEffect(() => {
    let cancelled = false;

    async function build() {
      // Leaflet needs the browser, so it is loaded here and not at the top.
      const L = (await import("leaflet")).default;
      if (cancelled || !container.current || map.current) return;

      map.current = L.map(container.current).setView(TIGBAUAN, 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.current);
      pins.current = L.layerGroup().addTo(map.current);
      drawPins(L);
    }

    void build();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      pins.current = null;
      hasZoomed.current = false;
    };
    // Build the map once; the effect below keeps the pins up to date.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw the pins whenever the reports change.
  useEffect(() => {
    async function update() {
      if (!map.current) return;
      const L = (await import("leaflet")).default;
      drawPins(L);
    }
    void update();
  }, [drawPins]);

  return (
    <div
      ref={container}
      role="region"
      aria-label="Map of active reports"
      className="relative z-0 h-72 w-full overflow-hidden rounded-[var(--radius)] border border-border sm:h-96"
    />
  );
}

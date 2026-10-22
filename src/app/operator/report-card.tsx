import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  EMERGENCY_LABELS,
  STATUS_LABELS,
  type Report,
  type Status,
} from "@/lib/types";
import { saveNote, setStatus } from "./actions";

export type ReportWithReporter = Report & {
  profiles: { full_name: string; phone: string | null } | null;
};

const MOVES: Status[] = ["verified", "dispatched", "resolved"];

export function ReportCard({ report }: { report: ReportWithReporter }) {
  const isNew = report.status === "received";
  const hasGps = report.latitude !== null && report.longitude !== null;

  return (
    <Card
      className={cn(
        isNew &&
          "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30",
      )}
    >
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">
            {EMERGENCY_LABELS[report.emergency_type]}
            {isNew && (
              <span className="ml-2 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                New
              </span>
            )}
          </p>
          <StatusBadge status={report.status} />
        </div>

        <p className="text-sm">{report.description}</p>

        <dl className="grid gap-1 text-sm">
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-muted-foreground">From</dt>
            <dd>
              {report.profiles?.full_name ?? "Unknown"}
              {report.profiles?.phone && (
                <>
                  {" · "}
                  <a
                    href={`tel:${report.profiles.phone}`}
                    className="underline"
                  >
                    {report.profiles.phone}
                  </a>
                </>
              )}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-muted-foreground">Where</dt>
            <dd className="flex flex-col gap-1">
              {report.landmark && <span>{report.landmark}</span>}
              {hasGps ? (
                <a
                  href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  Open location in maps
                </a>
              ) : (
                <span className="text-muted-foreground">
                  No GPS location. Use the landmark.
                </span>
              )}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-muted-foreground">Times</dt>
            <dd className="flex flex-col text-xs text-muted-foreground">
              <span>Sent {formatTime(report.created_at)}</span>
              {report.verified_at && (
                <span>Verified {formatTime(report.verified_at)}</span>
              )}
              {report.dispatched_at && (
                <span>Dispatched {formatTime(report.dispatched_at)}</span>
              )}
              {report.resolved_at && (
                <span>Resolved {formatTime(report.resolved_at)}</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          {MOVES.filter((status) => status !== report.status).map((status) => (
            <form key={status} action={setStatus}>
              <input type="hidden" name="id" value={report.id} />
              <input type="hidden" name="status" value={status} />
              <Button
                type="submit"
                size="sm"
                variant={status === "resolved" ? "outline" : "default"}
              >
                Mark {STATUS_LABELS[status].toLowerCase()}
              </Button>
            </form>
          ))}
        </div>

        <form action={saveNote} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={report.id} />
          <Textarea
            name="note"
            defaultValue={report.operator_notes ?? ""}
            maxLength={1000}
            placeholder="Optional note, for example: tricycle and ambulance sent."
            aria-label="Operator note"
            className="min-h-[60px]"
          />
          <div>
            <Button type="submit" size="sm" variant="secondary">
              Save note
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

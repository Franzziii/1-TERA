// Times are shown in Philippine time, whatever timezone the server is in.
const formatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Manila",
});

export function formatTime(iso: string) {
  return formatter.format(new Date(iso));
}

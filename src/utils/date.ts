import { utcToZonedTime, format } from "date-fns-tz";

export function formatDateTime(
  dateTime: Date | string | null | undefined,
  timezone: string,
  formatString: string
) {
  if (!dateTime) return "Invalid Date";
  return format(utcToZonedTime(dateTime, timezone), formatString);
}

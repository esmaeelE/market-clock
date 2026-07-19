export function formatTime(
  date: Date,
  timezone: string,
  locale: "fa-IR" | "en-US" = "en-US"
) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export function getIranTime(date: Date) {
  return formatTime(date, "Asia/Tehran", "fa-IR");
}

export function getUtcTime(date: Date) {
  return formatTime(date, "UTC", "en-US");
}

/**
 * Best-effort human-readable city name from the browser's detected IANA
 * timezone (e.g. "America/New_York" -> "New York"). Only meaningful on the
 * client — call this gated on a client-mounted check (see useIsMounted) so
 * server and pre-hydration client renders match.
 */
export function detectUserCity(): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone.split("/").pop()?.replace("_", " ") || "Local";
}

/**
 * Returns the CURRENT UTC offset (in hours, fractional for e.g. Tehran/India)
 * for an IANA timezone at a given moment, correctly accounting for DST.
 *
 * Do NOT use a hardcoded offset for markets that observe daylight saving
 * (London, Frankfurt, New York, Sydney, ...) — their real UTC offset changes
 * twice a year and a static number will be wrong for roughly half the year.
 */
export function getTimezoneOffsetHours(
  timezone: string,
  date: Date = new Date()
): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  // raw looks like "GMT", "GMT+1", "GMT-5", or "GMT+3:30"
  const match = raw.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = match[3] ? Number(match[3]) : 0;

  return sign * (hours + minutes / 60);
}

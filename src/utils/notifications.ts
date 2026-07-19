import { markets, Market } from "@/data/markets";
import { getTimezoneOffsetHours } from "./time";
import { isMarketHoliday } from "@/data/holidays";

/**
 * LIMITATION — read before changing this file:
 *
 * This app has no backend, so there is no push server and no VAPID keys.
 * That means we can only fire notifications while this tab/PWA process is
 * actually running (foreground OR backgrounded-but-open) — via
 * ServiceWorkerRegistration.showNotification(), polled on an interval here.
 *
 * We CANNOT wake up and notify the user if the browser/PWA is fully closed.
 * True closed-app push would require a server that holds push subscriptions
 * and sends Web Push messages — out of scope for a static frontend.
 */

const LEAD_MINUTES = 15;
const CHECK_INTERVAL_MS = 30_000;

type AlertEvent = "opening" | "closing";

function dedupeKey(marketId: string, event: AlertEvent, localDateISO: string) {
  return `market-clock:notified:${marketId}:${event}:${localDateISO}`;
}

function alreadyNotified(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function markNotified(key: string) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    // localStorage unavailable (private mode etc.) — notifications will
    // just re-fire more often in that case, not a correctness issue.
  }
}

function minutesUntil(target: Date, now: Date): number {
  return (target.getTime() - now.getTime()) / 60000;
}

/**
 * For a market and a "HH:MM" time-of-day, returns the next Date (a real,
 * correct UTC instant) at which that time-of-day occurs TODAY in the
 * market's own timezone. Returns null if the market isn't in session today
 * (weekend/holiday) so callers don't alert on off-days.
 */
function nextLocalOccurrence(market: Market, hhmm: string, now: Date): Date | null {
  const weekdayStr = new Intl.DateTimeFormat("en-US", {
    timeZone: market.timezone,
    weekday: "short",
  }).format(now);
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayStr);
  if (!market.daysOpen.includes(day)) return null;
  if (isMarketHoliday(market.id, market.timezone, now)) return null;

  const [h, m] = hhmm.split(":").map(Number);

  // Today's Y-M-D as observed in the market's own timezone.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: market.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const mo = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);

  // Step 1: treat the target local wall-clock time as if it were UTC — an
  // initial guess timestamp.
  const guess = new Date(Date.UTC(y, mo - 1, d, h, m, 0));

  // Step 2: find the market's real UTC offset at (approximately) that
  // moment, then correct the guess: local = UTC + offset, so UTC = local - offset.
  const offset = getTimezoneOffsetHours(market.timezone, guess);
  return new Date(guess.getTime() - offset * 3600000);
}

function localDateISO(timezone: string, date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

interface DueAlert {
  market: Market;
  event: AlertEvent;
  minutesAway: number;
}

/** Pure function: given "now", which markets have an alert due right now? */
export function getDueAlerts(now: Date): DueAlert[] {
  const due: DueAlert[] = [];

  for (const market of markets) {
    if (market.type !== "stock") continue; // forex trades 24/7, no open/close events

    const dateKey = localDateISO(market.timezone, now);

    const openTarget = nextLocalOccurrence(market, market.openTime, now);
    if (openTarget) {
      const mins = minutesUntil(openTarget, now);
      const key = dedupeKey(market.id, "opening", dateKey);
      if (mins > 0 && mins <= LEAD_MINUTES && !alreadyNotified(key)) {
        due.push({ market, event: "opening", minutesAway: Math.round(mins) });
      }
    }

    const closeTarget = nextLocalOccurrence(market, market.closeTime, now);
    if (closeTarget) {
      const mins = minutesUntil(closeTarget, now);
      const key = dedupeKey(market.id, "closing", dateKey);
      if (mins > 0 && mins <= LEAD_MINUTES && !alreadyNotified(key)) {
        due.push({ market, event: "closing", minutesAway: Math.round(mins) });
      }
    }
  }

  return due;
}

export function markAlertNotified(market: Market, event: AlertEvent, now: Date) {
  const dateKey = localDateISO(market.timezone, now);
  markNotified(dedupeKey(market.id, event, dateKey));
}

export async function checkAndFireNotifications(
  now: Date,
  language: "fa" | "en"
) {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (!("serviceWorker" in navigator)) return;

  const due = getDueAlerts(now);
  if (due.length === 0) return;

  const registration = await navigator.serviceWorker.ready;

  for (const alert of due) {
    const name = alert.market.name[language];
    const title =
      language === "fa"
        ? alert.event === "opening"
          ? `بازار ${name} به‌زودی باز می‌شود`
          : `بازار ${name} به‌زودی بسته می‌شود`
        : alert.event === "opening"
        ? `${name} opens soon`
        : `${name} closes soon`;

    const body =
      language === "fa"
        ? `${alert.minutesAway} دقیقه دیگر`
        : `In ${alert.minutesAway} minutes`;

    await registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: `${alert.market.id}-${alert.event}`,
    });

    markAlertNotified(alert.market, alert.event, now);
  }
}

export { LEAD_MINUTES, CHECK_INTERVAL_MS };

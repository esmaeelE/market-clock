/**
 * Full-day market closures, keyed by market id, as dates in that market's
 * OWN local timezone (YYYY-MM-DD). Weekly non-trading days (weekends) are
 * already handled separately via `Market.daysOpen` — only list *additional*
 * closures here (public holidays, exchange-specific closures).
 *
 * Sources (fetched July 2026, official/primary where available):
 * - NYSE:      ICE/NYSE Group 2026 holiday & early-closing announcement
 * - LSE:       London Stock Exchange "Business days" 2026 calendar
 * - Frankfurt: Deutsche Börse Xetra/FWB 2026 trading calendar (official PDF)
 * - Shanghai:  Shenzhen/Shanghai Stock Exchange 2026 holiday circular
 * - Sydney:    ASX 2026 trading calendar
 * - Tokyo:     Japan Exchange Group 2026 market holidays page
 * - Tehran:    Solar Hijri fixed-date national holidays only (see note below)
 *
 * IMPORTANT — maintenance:
 * These lists must be refreshed every year; nothing here is computed
 * automatically. A market whose id isn't a key below (e.g. "forex", which
 * trades 24/7 with no exchange holidays) simply has no closures.
 *
 * Tehran note: Iran's public holidays include several set by the lunar
 * Hijri calendar (Eid al-Fitr, Ashura, Tasua, Eid al-Adha, etc.) whose
 * Gregorian dates depend on moon sighting and aren't reliably knowable far
 * in advance. Only fixed Solar-Hijri-calendar holidays are listed here;
 * lunar-calendar closures are NOT included and should be added closer to
 * each date once confirmed.
 */
export const marketHolidays: Record<string, string[]> = {
  newyork: [
    "2026-01-01", // New Year's Day
    "2026-01-19", // Martin Luther King Jr. Day
    "2026-02-16", // Washington's Birthday
    "2026-04-03", // Good Friday
    "2026-05-25", // Memorial Day
    "2026-06-19", // Juneteenth
    "2026-07-03", // Independence Day (observed)
    "2026-09-07", // Labor Day
    "2026-11-26", // Thanksgiving Day
    "2026-12-25", // Christmas Day
  ],
  london: [
    "2026-01-01", // New Year's Day
    "2026-04-03", // Good Friday
    "2026-04-06", // Easter Monday
    "2026-05-04", // Early May Bank Holiday
    "2026-05-25", // Spring Bank Holiday
    "2026-08-31", // Summer Bank Holiday
    "2026-12-25", // Christmas Day
    "2026-12-28", // Boxing Day (substitute day)
  ],
  frankfurt: [
    "2026-01-01", // New Year's Day
    "2026-04-03", // Good Friday
    "2026-04-06", // Easter Monday
    "2026-05-01", // Labour Day
    "2026-12-24", // Christmas Eve
    "2026-12-25", // Christmas Day
    "2026-12-31", // New Year's Eve
  ],
  shanghai: [
    "2026-01-01", "2026-01-02", // New Year
    "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-23", // Spring Festival
    "2026-04-06", // Qingming Festival
    "2026-05-01", "2026-05-04", "2026-05-05", // Labour Day
    "2026-06-19", // Dragon Boat Festival
    "2026-09-25", // Mid-Autumn Festival
    "2026-10-01", "2026-10-02", "2026-10-05", "2026-10-06", "2026-10-07", // National Day
  ],
  sydney: [
    "2026-01-01", // New Year's Day
    "2026-01-26", // Australia Day
    "2026-04-03", // Good Friday
    "2026-04-06", // Easter Monday
    "2026-06-08", // King's Birthday
    "2026-12-25", // Christmas Day
    "2026-12-28", // Boxing Day (substitute)
  ],
  tokyo: [
    "2026-01-01", "2026-01-02", // New Year
    "2026-01-12", // Coming-of-Age Day
    "2026-02-11", // National Foundation Day
    "2026-02-23", // Emperor's Birthday
    "2026-03-20", // Vernal Equinox Day
    "2026-04-29", // Showa Day
    "2026-05-04", "2026-05-05", "2026-05-06", // Golden Week (Greenery/Children's/Constitution)
    "2026-07-20", // Marine Day
    "2026-08-11", // Mountain Day
    "2026-09-21", "2026-09-22", "2026-09-23", // Respect for the Aged Day + Autumnal Equinox
    "2026-10-12", // Sports Day
    "2026-11-03", // Culture Day
    "2026-11-23", // Labor Thanksgiving Day
    "2026-12-31", // Year-end closure
  ],
  tehran: [
    "2026-02-11", // 22 Bahman — Islamic Revolution Victory Day
    "2026-03-20", "2026-03-21", "2026-03-22", "2026-03-23", // Nowruz (1-4 Farvardin)
    "2026-04-01", // Islamic Republic Day (12 Farvardin)
    "2026-04-02", // Sizdah Bedar (13 Farvardin)
  ],
};

/**
 * True if `date` falls on a listed full-day closure for `market`, checked
 * against the market's OWN local calendar date (so a market that's already
 * into "tomorrow" relative to UTC is checked against the correct day).
 */
export function isMarketHoliday(
  marketId: string,
  timezone: string,
  date: Date
): boolean {
  const holidays = marketHolidays[marketId];
  if (!holidays || holidays.length === 0) return false;

  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date); // en-CA gives YYYY-MM-DD

  return holidays.includes(localDate);
}

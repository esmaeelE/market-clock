import { describe, it, expect } from "vitest";
import { isMarketHoliday } from "./holidays";

describe("isMarketHoliday", () => {
  it("returns true on a listed holiday, checked in the market's own timezone", () => {
    // Christmas Day 2026, 15:00 UTC = still Dec 25 in New York (UTC-5/-4).
    expect(
      isMarketHoliday("newyork", "America/New_York", new Date("2026-12-25T15:00:00Z"))
    ).toBe(true);
  });

  it("returns false on an ordinary trading day", () => {
    expect(
      isMarketHoliday("newyork", "America/New_York", new Date("2026-07-21T15:00:00Z"))
    ).toBe(false);
  });

  it("respects the timezone boundary — not yet the holiday locally", () => {
    // July 3 01:00 UTC is still July 2, 21:00 EDT in New York — not the holiday yet.
    expect(
      isMarketHoliday("newyork", "America/New_York", new Date("2026-07-03T01:00:00Z"))
    ).toBe(false);
  });

  it("respects the timezone boundary — now past midnight into the holiday locally", () => {
    // July 3 15:00 UTC = July 3, 11:00 EDT in New York — the holiday.
    expect(
      isMarketHoliday("newyork", "America/New_York", new Date("2026-07-03T15:00:00Z"))
    ).toBe(true);
  });

  it("returns false for a market with no holiday list (e.g. forex)", () => {
    expect(isMarketHoliday("forex", "UTC", new Date("2026-12-25T12:00:00Z"))).toBe(false);
  });

  it("does not leak one market's holiday onto another market on the same date", () => {
    // Dec 25 is a London holiday but not (by itself) reason to assume it's
    // wrongly keyed to e.g. Tokyo, which has its own independent list.
    expect(
      isMarketHoliday("tokyo", "Asia/Tokyo", new Date("2026-12-25T04:00:00Z"))
    ).toBe(false);
  });
});

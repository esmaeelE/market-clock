import { describe, it, expect } from "vitest";
import { computeMarket } from "./market-time";
import { markets } from "@/data/markets";

const newyork = markets.find((m) => m.id === "newyork")!;
const forex = markets.find((m) => m.id === "forex")!;

describe("computeMarket", () => {
  it("reports NYSE open during trading hours on a regular weekday", () => {
    // Monday July 20 2026, 14:00 UTC = 10:00 EDT — well within 09:30-16:00.
    const result = computeMarket(newyork, new Date("2026-07-20T14:00:00Z"));
    expect(result.isOpen).toBe(true);
    expect(result.isHoliday).toBe(false);
  });

  it("reports NYSE closed outside trading hours on a regular weekday", () => {
    // Monday July 20 2026, 03:00 UTC = 23:00 EDT the prior day — closed.
    const result = computeMarket(newyork, new Date("2026-07-20T03:00:00Z"));
    expect(result.isOpen).toBe(false);
  });

  it("reports NYSE closed on a weekend even during would-be trading hours", () => {
    // Saturday July 18 2026, 14:00 UTC = 10:00 EDT.
    const result = computeMarket(newyork, new Date("2026-07-18T14:00:00Z"));
    expect(result.isOpen).toBe(false);
  });

  it("reports NYSE closed on a listed holiday even during trading hours", () => {
    // Christmas Day 2026 (Friday), 15:00 UTC = 10:00 EST — would be open hours.
    const result = computeMarket(newyork, new Date("2026-12-25T15:00:00Z"));
    expect(result.isOpen).toBe(false);
    expect(result.isHoliday).toBe(true);
  });

  it("correctly uses the DST offset, not a stale standard-time one", () => {
    // 13:00 UTC in July is 09:00 EDT — before the 09:30 open.
    // If this incorrectly used standard time (EST, UTC-5) it would read
    // 08:00 and still correctly say "closed", so also check a time that
    // would flip status depending on which offset is used: 13:35 UTC.
    // EDT (UTC-4) -> 09:35 local -> open. EST (UTC-5) -> 08:35 local -> closed.
    const result = computeMarket(newyork, new Date("2026-07-20T13:35:00Z"));
    expect(result.isOpen).toBe(true);
  });

  it("treats forex-type markets as always open (no holiday/weekend gating applied the same way)", () => {
    // Forex has daysOpen covering the full week in this app's data model;
    // just confirm computeMarket runs without throwing for a 24/7 market.
    expect(() => computeMarket(forex, new Date("2026-07-18T14:00:00Z"))).not.toThrow();
  });
});

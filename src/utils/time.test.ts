import { describe, it, expect } from "vitest";
import { getTimezoneOffsetHours } from "./time";

describe("getTimezoneOffsetHours", () => {
  it("returns the DST offset (not standard-time) for New York in July", () => {
    const july = new Date("2026-07-18T12:00:00Z");
    // EDT = UTC-4 in summer, NOT the UTC-5 (EST) that a hardcoded value would give.
    expect(getTimezoneOffsetHours("America/New_York", july)).toBe(-4);
  });

  it("returns the standard-time offset for New York in January", () => {
    const january = new Date("2026-01-18T12:00:00Z");
    expect(getTimezoneOffsetHours("America/New_York", january)).toBe(-5);
  });

  it("returns the DST offset for London in July (BST)", () => {
    const july = new Date("2026-07-18T12:00:00Z");
    expect(getTimezoneOffsetHours("Europe/London", july)).toBe(1);
  });

  it("returns the standard-time offset for London in January (GMT)", () => {
    const january = new Date("2026-01-18T12:00:00Z");
    expect(getTimezoneOffsetHours("Europe/London", january)).toBe(0);
  });

  it("returns a fixed offset for a timezone with no DST (Tokyo)", () => {
    const july = new Date("2026-07-18T12:00:00Z");
    const january = new Date("2026-01-18T12:00:00Z");
    expect(getTimezoneOffsetHours("Asia/Tokyo", july)).toBe(9);
    expect(getTimezoneOffsetHours("Asia/Tokyo", january)).toBe(9);
  });

  it("handles a fractional (non-whole-hour) offset (Tehran, UTC+3:30)", () => {
    const anytime = new Date("2026-07-18T12:00:00Z");
    expect(getTimezoneOffsetHours("Asia/Tehran", anytime)).toBe(3.5);
  });

  it("flips sign correctly for Sydney's southern-hemisphere DST (winter in July)", () => {
    const july = new Date("2026-07-18T12:00:00Z"); // Southern winter -> standard time
    const january = new Date("2026-01-18T12:00:00Z"); // Southern summer -> DST
    expect(getTimezoneOffsetHours("Australia/Sydney", july)).toBe(10);
    expect(getTimezoneOffsetHours("Australia/Sydney", january)).toBe(11);
  });
});

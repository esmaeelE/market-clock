import { describe, it, expect, beforeEach } from "vitest";
import { getDueAlerts } from "./notifications";

// Minimal in-memory localStorage shim — vitest's "node" environment doesn't
// provide one, but getDueAlerts' dedupe logic reads/writes it.
beforeEach(() => {
  const store = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: () => null,
    get length() {
      return store.size;
    },
  };
});

describe("getDueAlerts", () => {
  it("flags NYSE opening when within the lead window", () => {
    // Monday July 20 2026. NYSE opens 09:30 EDT = 13:30 UTC.
    const now = new Date("2026-07-20T13:20:00Z"); // 10 min before
    const due = getDueAlerts(now).filter((a) => a.market.id === "newyork");
    expect(due).toHaveLength(1);
    expect(due[0].event).toBe("opening");
    expect(due[0].minutesAway).toBe(10);
  });

  it("does not flag NYSE opening when outside the lead window", () => {
    const now = new Date("2026-07-20T13:10:00Z"); // 20 min before — outside 15-min lead
    const due = getDueAlerts(now).filter((a) => a.market.id === "newyork");
    expect(due).toHaveLength(0);
  });

  it("does not flag a market that isn't in session that day (weekend)", () => {
    const saturday = new Date("2026-07-18T13:20:00Z");
    const due = getDueAlerts(saturday).filter((a) => a.market.id === "newyork");
    expect(due).toHaveLength(0);
  });

  it("does not flag a market on a listed holiday", () => {
    // Christmas Day 2026, well before London's usual open — but it's a holiday.
    const xmas = new Date("2026-12-25T07:50:00Z");
    const due = getDueAlerts(xmas).filter((a) => a.market.id === "london");
    expect(due).toHaveLength(0);
  });

  it("deduplicates — does not re-fire the same alert twice in one day", () => {
    const now = new Date("2026-07-20T13:20:00Z");
    const firstPass = getDueAlerts(now).filter((a) => a.market.id === "newyork");
    expect(firstPass).toHaveLength(1);

    // Simulate the app marking it notified, as checkAndFireNotifications does.
    localStorage.setItem(
      `market-clock:notified:newyork:opening:${new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(now)}`,
      "1"
    );

    const secondPass = getDueAlerts(now).filter((a) => a.market.id === "newyork");
    expect(secondPass).toHaveLength(0);
  });
});

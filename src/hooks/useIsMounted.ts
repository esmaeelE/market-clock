import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True once the component has hydrated on the client, false during SSR and
 * the very first client render. Used to defer rendering of anything that
 * depends on the browser (current time, detected timezone, feature checks
 * like `"Notification" in window`) until after hydration, avoiding a
 * server/client markup mismatch.
 *
 * This uses useSyncExternalStore rather than the more common
 * `useState(false)` + `useEffect(() => setState(true))` pattern: that
 * pattern causes an extra synchronous render pass (flagged by the
 * react-hooks/set-state-in-effect lint rule), whereas useSyncExternalStore
 * gives the same "false on server, true on client after hydration" result
 * without ever calling setState from inside an effect.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}

"use client";

import { useEffect } from "react";
import { useNotificationsStore } from "@/store/notifications.store";
import { useLanguageStore } from "@/store/language.store";
import { checkAndFireNotifications, CHECK_INTERVAL_MS } from "@/utils/notifications";

/**
 * Polls for due market-open/close alerts and fires them while this tab/PWA
 * is running. See the limitation notice in utils/notifications.ts — this
 * cannot wake up a fully closed browser (no push server behind this app).
 */
export default function NotificationManager() {
  const enabled = useNotificationsStore((s) => s.enabled);
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    const run = () => {
      checkAndFireNotifications(new Date(), language);
    };

    run();
    const interval = setInterval(run, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [enabled, language]);

  return null;
}

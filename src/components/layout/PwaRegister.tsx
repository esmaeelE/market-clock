"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) for offline support and
 * installability. Renders nothing — this is a side-effect-only component.
 * Kept separate from Header/other components so PWA registration has a
 * single, easy-to-find owner.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Registering after `load` avoids competing with the initial page
    // render/hydration for network and CPU.
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("Service worker registration failed:", err));
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}

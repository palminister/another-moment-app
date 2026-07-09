"use client";

import { useEffect } from "react";

export function useServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      void registration.update();
    }).catch(() => {
      // PWA support should never block the app shell.
    });
  }, []);
}

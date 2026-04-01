"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Mobile Exit Intent — detects scroll-up behavior on mobile as a signal
 * the user might be leaving, and shows a retention prompt.
 */
export function MobileExitIntent() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleScroll = useCallback(() => {
    // Placeholder: mobile exit intent detection will be enhanced later
  }, []);

  useEffect(() => {
    if (dismissed) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed, handleScroll]);

  if (!visible || dismissed) return null;

  return null;
}

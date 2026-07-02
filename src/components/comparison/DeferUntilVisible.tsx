"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// DAN-1642: defer mounting (and, for ssr:false dynamic children, the chunk
// download + hydration) of a heavy below-fold section until it scrolls near
// the viewport. Keeps expensive libraries (e.g. recharts) off the initial
// hydration path so they no longer block the main thread during the LCP
// window. A reserved-height placeholder avoids layout shift (CLS stays 0).
export function DeferUntilVisible({
  children,
  minHeight = 320,
  rootMargin = "300px",
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fallback for environments without IntersectionObserver.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      {visible ? children : null}
    </div>
  );
}

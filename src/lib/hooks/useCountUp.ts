"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

export function useCountUp<T extends Element>(
  target: number,
  duration = 1200,
  externalRef?: RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const ref = externalRef ?? internalRef;
  const [value, setValue] = useState(0);
  const [triggered, setTriggered] = useState(false);

  // Trigger when the element enters the viewport
  useEffect(() => {
    if (triggered || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggered]);

  // Animate value to target when triggered
  useEffect(() => {
    if (!triggered) return;
    if (target === 0) { setValue(0); return; }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [triggered, target, duration]);

  return { value, ref: externalRef ? undefined : internalRef };
}

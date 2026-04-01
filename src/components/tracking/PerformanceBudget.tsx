"use client";

import { useEffect } from "react";

const BUDGETS = {
  // Transfer size thresholds in KB
  scriptKB: 300,
  styleKB: 100,
  totalKB: 500,
  // Resource count thresholds
  maxRequests: 60,
};

function checkPerformanceBudget() {
  if (typeof window === "undefined" || !("performance" in window)) return;

  const entries = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];

  let totalScriptKB = 0;
  let totalStyleKB = 0;
  let totalKB = 0;

  for (const entry of entries) {
    const sizeKB = (entry.transferSize || 0) / 1024;
    totalKB += sizeKB;
    if (entry.initiatorType === "script") totalScriptKB += sizeKB;
    if (entry.initiatorType === "link" || entry.initiatorType === "css")
      totalStyleKB += sizeKB;
  }

  const warnings: string[] = [];

  if (totalScriptKB > BUDGETS.scriptKB) {
    warnings.push(
      `JS bundle: ${Math.round(totalScriptKB)}KB exceeds budget of ${BUDGETS.scriptKB}KB`
    );
  }
  if (totalStyleKB > BUDGETS.styleKB) {
    warnings.push(
      `CSS: ${Math.round(totalStyleKB)}KB exceeds budget of ${BUDGETS.styleKB}KB`
    );
  }
  if (totalKB > BUDGETS.totalKB) {
    warnings.push(
      `Total transfer: ${Math.round(totalKB)}KB exceeds budget of ${BUDGETS.totalKB}KB`
    );
  }
  if (entries.length > BUDGETS.maxRequests) {
    warnings.push(
      `${entries.length} requests exceeds budget of ${BUDGETS.maxRequests}`
    );
  }

  if (warnings.length > 0) {
    console.warn(
      `[Performance Budget] Exceeded thresholds:\n${warnings.map((w) => `  - ${w}`).join("\n")}`
    );
  }
}

export function PerformanceBudget() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Check after page fully loads
    if (document.readyState === "complete") {
      setTimeout(checkPerformanceBudget, 1000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(checkPerformanceBudget, 1000);
      });
    }
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import { buildWebMcpTools } from "@/lib/webmcp/tools";

type ModelContext = {
  registerTool: (tool: unknown, opts?: { signal?: AbortSignal }) => Promise<void> | void;
};

/** Registers read-only WebMCP tools when the browser exposes document.modelContext. No-op otherwise. */
export function WebMcpTools() {
  useEffect(() => {
    const mc =
      (document as unknown as { modelContext?: ModelContext }).modelContext ??
      (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    if (!mc || typeof mc.registerTool !== "function") return;
    const ac = new AbortController();
    const tools = buildWebMcpTools(window.location.origin, (url) => fetch(url));
    for (const tool of tools) {
      try {
        void Promise.resolve(mc.registerTool(tool, { signal: ac.signal })).catch(() => {});
      } catch {
        // duplicate registration / permissions policy — ignore
      }
    }
    return () => ac.abort();
  }, []);
  return null;
}

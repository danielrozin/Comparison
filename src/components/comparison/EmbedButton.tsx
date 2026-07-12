"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SITE_URL } from "@/lib/utils/constants";
import { trackEmbedCtaClick } from "@/lib/utils/analytics";

interface EmbedButtonProps {
  slug: string;
  title: string;
}

type TabType = "script" | "iframe" | "badge";

export function EmbedButton({ slug, title }: EmbedButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("script");
  const [copiedTab, setCopiedTab] = useState<TabType | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const embedTabOrder: TabType[] = ["script", "iframe", "badge"];
  const embedTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleEmbedTabKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % embedTabOrder.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + embedTabOrder.length) % embedTabOrder.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = embedTabOrder.length - 1;
    else return;
    e.preventDefault();
    setActiveTab(embedTabOrder[next]);
    embedTabRefs.current[next]?.focus();
  }

  const encodedTitle = encodeURIComponent(title);

  const embedCodes: Record<TabType, { label: string; description: string; code: string }> = {
    script: {
      label: "Script Tag",
      description: "Recommended. Easiest option — renders the comparison automatically and adds a small credit link back to the full page.",
      code: `<script src="${SITE_URL}/api/v1/widget?slug=${slug}"></script>`,
    },
    iframe: {
      label: "iFrame",
      description: "Display-only embed. Works anywhere HTML embeds are allowed, but search engines attribute iframe content to the source — use the Script Tag or Link Badge if you want to credit us with a real link.",
      code: `<iframe src="${SITE_URL}/embed/${slug}" width="100%" height="400" frameborder="0" style="border-radius: 12px; border: 1px solid #e2e8f0;"></iframe>`,
    },
    badge: {
      label: "Link Badge",
      description: "A clickable image badge that links straight to the full comparison.",
      code: `<a href="${SITE_URL}/compare/${slug}" target="_blank" rel="noopener">\n  <img src="${SITE_URL}/api/og?title=${encodedTitle}&type=badge" alt="${title}" width="300" />\n</a>`,
    },
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Focus trap: keep Tab/Shift+Tab inside dialog; auto-focus close button on open
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleCopy = async (tab: TabType) => {
    try {
      await navigator.clipboard.writeText(embedCodes[tab].code);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = embedCodes[tab].code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    }
  };

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => { trackEmbedCtaClick(slug, window.location.pathname); setIsOpen(true); }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] text-sm font-medium text-text-secondary bg-surface-alt hover:bg-primary-50 hover:text-primary-600 border border-border rounded-lg transition-all duration-200"
        title="Embed this comparison"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="embed-modal-title" className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border">
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close embed dialog"
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full text-text-secondary hover:text-text hover:bg-surface-alt transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 id="embed-modal-title" className="text-lg font-display font-bold text-text">Embed this comparison</h2>
                  <p className="text-sm text-text-secondary">Add this comparison to your website or blog</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <div role="tablist" aria-label="Embed type" className="flex gap-1 bg-surface-alt rounded-lg p-1">
                {embedTabOrder.map((tab, i) => (
                  <button
                    type="button"
                    key={tab}
                    id={`embed-tab-${tab}`}
                    ref={(el) => { embedTabRefs.current[i] = el; }}
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`embed-panel-${tab}`}
                    tabIndex={activeTab === tab ? 0 : -1}
                    onClick={() => setActiveTab(tab)}
                    onKeyDown={(e) => handleEmbedTabKeyDown(e, i)}
                    className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-text-secondary hover:text-text"
                    }`}
                  >
                    {embedCodes[tab].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active tab content */}
            <div id={`embed-panel-${activeTab}`} role="tabpanel" aria-labelledby={`embed-tab-${activeTab}`} className="px-6 py-4">
              <p className="text-sm text-text-secondary mb-3">
                {embedCodes[activeTab].description}
              </p>

              <div className="relative">
                <pre className="bg-surface-alt border border-border rounded-xl p-4 text-xs font-mono text-text overflow-x-auto whitespace-pre-wrap break-all">
                  {embedCodes[activeTab].code}
                </pre>
                <button
                  type="button"
                  onClick={() => handleCopy(activeTab)}
                  aria-label={copiedTab === activeTab ? "Copied to clipboard" : "Copy embed code"}
                  className={`absolute top-2 right-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    copiedTab === activeTab
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-text-secondary border border-border hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                  }`}
                >
                  {copiedTab === activeTab ? (
                    <span role="status" aria-live="polite" className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="px-6 pb-6">
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-surface-alt px-4 py-2 border-b border-border flex items-center gap-2">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-text-secondary font-mono ml-2">Preview</span>
                </div>
                <iframe
                  src={`${SITE_URL}/compare/${slug}`}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  className="bg-white"
                  title="Embed preview"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

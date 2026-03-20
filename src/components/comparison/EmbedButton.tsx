"use client";

import { useState, useEffect, useCallback } from "react";
import { SITE_URL } from "@/lib/utils/constants";

interface EmbedButtonProps {
  slug: string;
  title: string;
}

type TabType = "script" | "iframe" | "badge";

export function EmbedButton({ slug, title }: EmbedButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("iframe");
  const [copiedTab, setCopiedTab] = useState<TabType | null>(null);

  const encodedTitle = encodeURIComponent(title);

  const embedCodes: Record<TabType, { label: string; description: string; code: string }> = {
    script: {
      label: "Script Tag",
      description: "Easiest option. Paste this script tag and the comparison renders automatically.",
      code: `<script src="${SITE_URL}/api/v1/widget?slug=${slug}"></script>`,
    },
    iframe: {
      label: "iFrame",
      description: "Embed as an iframe. Works on any platform that supports HTML embeds.",
      code: `<iframe src="${SITE_URL}/embed/${slug}" width="100%" height="400" frameborder="0" style="border-radius: 12px; border: 1px solid #e2e8f0;"></iframe>`,
    },
    badge: {
      label: "Link Badge",
      description: "A clickable image badge that links to the full comparison.",
      code: `<a href="${SITE_URL}/compare/${slug}" target="_blank" rel="noopener">\n  <img src="${SITE_URL}/api/og?title=${encodedTitle}&type=badge" alt="${title}" width="300" />\n</a>`,
    },
  };

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

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
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-secondary bg-surface-alt hover:bg-primary-50 hover:text-primary-600 border border-gray-200 rounded-lg transition-all duration-200"
        title="Embed this comparison"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-text">Embed this comparison</h2>
                  <p className="text-sm text-text-secondary">Add this comparison to your website or blog</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(["script", "iframe", "badge"] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
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
            <div className="px-6 py-4">
              <p className="text-sm text-text-secondary mb-3">
                {embedCodes[activeTab].description}
              </p>

              <div className="relative">
                <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap break-all">
                  {embedCodes[activeTab].code}
                </pre>
                <button
                  onClick={() => handleCopy(activeTab)}
                  className={`absolute top-2 right-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    copiedTab === activeTab
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                  }`}
                >
                  {copiedTab === activeTab ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono ml-2">Preview</span>
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

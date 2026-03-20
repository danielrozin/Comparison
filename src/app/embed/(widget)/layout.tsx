/**
 * Minimal layout for embed widget pages — no header, footer, or feedback widget.
 * These pages are designed to be loaded in iframes on third-party sites.
 */
export default function EmbedWidgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-gray-900 min-h-screen" style={{ all: "initial", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        header, footer, [data-feedback-widget] { display: none !important; }
      `}</style>
      {children}
    </div>
  );
}

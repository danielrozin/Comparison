"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0, backgroundColor: "#f9fafb" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <div style={{ width: "5rem", height: "5rem", background: "linear-gradient(135deg, #fee2e2, #ffedd5)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.75rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {error.digest && (
              <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1rem" }}>
                Error ID: {error.digest}
              </p>
            )}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{ padding: "0.75rem 1.5rem", backgroundColor: "#4f46e5", color: "white", fontWeight: 600, borderRadius: "0.75rem", border: "none", cursor: "pointer", fontSize: "1rem" }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{ padding: "0.75rem 1.5rem", backgroundColor: "#f3f4f6", color: "#111827", fontWeight: 600, borderRadius: "0.75rem", textDecoration: "none", fontSize: "1rem" }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

"use client";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
      }}
      className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 rounded-sm"
    >
      Cookie Preferences
    </button>
  );
}

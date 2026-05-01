"use client";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
      }}
      className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
    >
      Cookie Preferences
    </button>
  );
}

"use client";

export function HeroCTA() {
  return (
    <button
      type="button"
      onClick={() => {
        const input = document.querySelector<HTMLInputElement>('#search input[type="text"]');
        input?.focus();
      }}
      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-primary-700 font-bold rounded-full hover:bg-primary-50 transition-all shadow-lg shadow-black/10 text-base sm:text-lg hover:scale-105 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-800"
    >
      Start Comparing
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
}

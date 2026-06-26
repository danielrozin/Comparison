"use client";

import { useState } from "react";
import type { FAQData } from "@/types";

export function FAQBlock({ faqs }: { faqs: FAQData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-text">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                isOpen
                  ? "border-primary-300 shadow-sm shadow-primary-100"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
                aria-expanded={isOpen}
              >
                {/* Number badge */}
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-colors ${
                    isOpen
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {i + 1}
                </span>

                <span className="flex-1 font-medium text-text text-sm sm:text-base pr-2">
                  {faq.question}
                </span>

                <svg
                  className={`w-4 h-4 flex-shrink-0 text-text-secondary transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary-600" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer — CSS max-height transition for smooth open/close */}
              <div
                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-5 ml-9">
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

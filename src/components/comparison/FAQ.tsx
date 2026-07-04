"use client";

import { useState } from "react";
import type { FAQData } from "@/types";

export function FAQBlock({ faqs }: { faqs: FAQData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const allOpen = openIndex === -1;

  const handleExpandAll = () => setOpenIndex(allOpen ? null : -1);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 id="faq-heading" className="text-2xl font-display font-bold text-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">{faqs.length} question{faqs.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {faqs.length > 2 && (
          <button
            type="button"
            onClick={handleExpandAll}
            aria-pressed={allOpen}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50 border border-transparent hover:border-primary-200"
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 `} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>

      <ol className="space-y-2 list-none">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i || openIndex === -1;
          const answerId = `faq-answer-${i}`;
          return (
            <li
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ease-in-out animate-fade-in ${
                isOpen
                  ? "border border-primary-200 shadow-md shadow-primary-100/50 border-l-[3px] border-l-primary-500 translate-y-0"
                  : "border border-border hover:border-primary-200 hover:shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (openIndex === -1) {
                    setOpenIndex(null);
                  } else {
                    setOpenIndex(isOpen ? null : i);
                  }
                }}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all duration-200 ${isOpen ? "bg-primary-50/50" : "hover:bg-surface-alt/70"}`}
                aria-expanded={isOpen}
                aria-controls={answerId}
              >
                {/* Number badge */}
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all duration-200 ${
                    isOpen
                      ? "bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-sm"
                      : "bg-surface-alt text-text-secondary group-hover:bg-primary-50 group-hover:text-primary-600"
                  }`}
                >
                  {i + 1}
                </span>

                <span className={`flex-1 font-medium text-sm sm:text-base pr-2 transition-colors duration-200 ${isOpen ? "text-primary-900" : "text-text"}`}>
                  {faq.question}
                </span>

                {/* Animated chevron in a subtle circle */}
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-primary-100 text-primary-600" : "text-text-secondary"}`}>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Answer — CSS grid-rows trick for smooth natural height animation */}
              <div
                id={answerId}
                role="region"
                aria-label={faq.question}
                aria-hidden={!isOpen}
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 ml-9">
                    <div className="h-px bg-gradient-to-r from-primary-200 to-transparent mb-4" />
                    <p className="faq-answer text-sm text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

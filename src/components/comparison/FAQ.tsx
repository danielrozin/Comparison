"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { FAQData } from "@/types";
import { ScrollReveal } from "@/components/layout/ScrollReveal";

const INITIAL_FAQ_SHOW = 5;

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary-200 text-primary-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface FAQItemProps {
  faq: FAQData;
  index: number;
  listPosition: number;
  isOpen: boolean;
  search: string;
  isHidden: boolean;
  onToggle: (i: number) => void;
}

function FAQItem({ faq, index, listPosition, isOpen, search, isHidden, onToggle }: FAQItemProps) {
  const answerId = `faq-answer-${index}`;
  return (
    <li
      style={{ animationDelay: `${listPosition * 40}ms` }}
      className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ease-in-out animate-fade-in ${isHidden ? "hidden" : ""} ${
        isOpen
          ? "border border-primary-200 shadow-md shadow-primary-100/50 border-l-[3px] border-l-primary-500 translate-y-0"
          : "border border-border hover:border-primary-200 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all duration-200 ${isOpen ? "bg-primary-50/50" : "hover:bg-surface-alt/70"}`}
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-sm"
              : "bg-surface-alt text-text-secondary group-hover:bg-primary-50 group-hover:text-primary-600"
          }`}
        >
          {index + 1}
        </span>

        <span className={`flex-1 font-medium text-sm sm:text-base pr-2 transition-colors duration-200 ${isOpen ? "text-primary-900" : "text-text"}`}>
          {highlight(faq.question, search)}
        </span>

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

      {/* Answer — CSS grid-rows trick keeps content in DOM for AEO even when collapsed */}
      <div
        id={answerId}
        role="region"
        aria-label={faq.question}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 ml-9">
            <div className="h-px bg-gradient-to-r from-primary-200 to-transparent mb-4" />
            <p className="faq-answer text-sm text-text leading-relaxed">
              {highlight(faq.answer, search)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export function FAQBlock({ faqs }: { faqs: FAQData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const allOpen = openIndex === -1;
  const isSearching = search.trim().length > 0;

  useEffect(() => {
    if (faqs.length < 4) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== "/" ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) return;
      if (searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [faqs.length]);

  const handleExpandAll = () => setOpenIndex(allOpen ? null : -1);
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setOpenIndex(-1);
    setShowAll(true);
  }, []);

  const handleToggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  // Set of FAQ indices that match the search query
  const matchingSet = useMemo<Set<number> | null>(() => {
    if (!isSearching) return null;
    const q = search.trim().toLowerCase();
    return new Set(
      faqs
        .map((f, i) => ({ ...f, i }))
        .filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
        .map((f) => f.i)
    );
  }, [faqs, search, isSearching]);

  const filteredCount = matchingSet ? matchingSet.size : faqs.length;
  const hiddenCount = isSearching ? 0 : Math.max(0, faqs.length - INITIAL_FAQ_SHOW);
  const overflowExpanded = showAll || isSearching;

  return (
    <ScrollReveal delay={80}>
    <section id="faq" aria-labelledby="faq-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
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
            <p aria-live="polite" aria-atomic="true" className="text-xs text-text-secondary mt-0.5">
              {isSearching && filteredCount !== faqs.length
                ? `${filteredCount} of ${faqs.length} questions`
                : `${faqs.length} question${faqs.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        {faqs.length > 2 && !isSearching && (
          <button
            type="button"
            onClick={handleExpandAll}
            aria-pressed={allOpen}
            aria-label={allOpen ? "Collapse all FAQ answers" : "Expand all FAQ answers"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50 border border-transparent hover:border-primary-200"
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${allOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>

      {/* Search input — only shown when there are enough FAQs to benefit */}
      {faqs.length >= 4 && (
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchInputRef}
            type="search"
            value={search}
            onChange={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search questions…"
            aria-label="Filter FAQ questions"
            className="w-full pl-9 pr-16 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 placeholder:text-text-secondary/60 transition-all duration-150"
          />
          {/* Keyboard shortcut hint — hidden when focused or searching */}
          {!searchFocused && !isSearching && (
            <kbd
              aria-hidden="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-semibold text-text-secondary/60 bg-surface-alt border border-border rounded pointer-events-none select-none"
            >
              /
            </kbd>
          )}
          {isSearching && (
            <button
              type="button"
              onClick={() => { setSearch(""); setOpenIndex(0); setShowAll(false); }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-alt flex items-center justify-center text-text-secondary hover:bg-border hover:text-text transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {matchingSet !== null && matchingSet.size === 0 && (
        <div className="text-center py-10 text-text-secondary text-sm">
          <svg className="w-8 h-8 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No questions match &ldquo;{search}&rdquo;
        </div>
      )}

      {/* First INITIAL_SHOW FAQs — always visible in DOM (great for AEO) */}
      <ol role="list" className="space-y-2 list-none">
        {faqs.slice(0, INITIAL_FAQ_SHOW).map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            index={i}
            listPosition={i}
            isOpen={openIndex === i || openIndex === -1}
            search={search}
            isHidden={matchingSet !== null && !matchingSet.has(i)}
            onToggle={handleToggle}
          />
        ))}
      </ol>

      {/* Overflow FAQs — always in DOM for AEO; CSS grid-rows collapses them visually */}
      {faqs.length > INITIAL_FAQ_SHOW && (
        <div className={`grid transition-all duration-300 ease-in-out ${overflowExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <ol role="list" className="space-y-2 list-none pt-2">
              {faqs.slice(INITIAL_FAQ_SHOW).map((faq, idx) => {
                const i = idx + INITIAL_FAQ_SHOW;
                return (
                  <FAQItem
                    key={i}
                    faq={faq}
                    index={i}
                    listPosition={idx}
                    isOpen={openIndex === i || openIndex === -1}
                    search={search}
                    isHidden={matchingSet !== null && !matchingSet.has(i)}
                    onToggle={handleToggle}
                  />
                );
              })}
            </ol>
          </div>
        </div>
      )}

      {/* Show more / show less toggle */}
      {hiddenCount > 0 && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary-600 hover:text-primary-700 rounded-xl border border-dashed border-primary-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-150"
          aria-label={`Show ${hiddenCount} more questions`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Show {hiddenCount} more question{hiddenCount !== 1 ? "s" : ""}
        </button>
      )}
      {showAll && !isSearching && faqs.length > INITIAL_FAQ_SHOW && (
        <button
          type="button"
          onClick={() => { setShowAll(false); setOpenIndex(0); }}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-text-secondary hover:text-text rounded-xl border border-dashed border-border hover:border-border transition-all duration-150"
          aria-label="Show fewer questions"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Show fewer questions
        </button>
      )}
    </section>
    </ScrollReveal>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  lastUpdatedISO: string;
  sections: Section[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  lastUpdatedISO,
  sections,
  children,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 print:hidden">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">{title}</li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
        {/* Sidebar TOC — sticky on desktop, hidden on mobile */}
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-24">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
              On this page
            </h2>
            <nav>
              <ul className="space-y-1 border-l border-border">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block pl-4 py-1.5 text-sm transition-colors border-l-2 -ml-px ${
                        activeSection === section.id
                          ? "border-primary-600 text-primary-600 font-medium"
                          : "border-transparent text-text-secondary hover:text-text hover:border-gray-300"
                      }`}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-display font-black text-text mb-3">
              {title}
            </h1>
            <p className="text-sm text-text-secondary">
              Last updated: <time dateTime={lastUpdatedISO}>{lastUpdated}</time>
            </p>
          </div>

          {/* Mobile TOC — collapsible */}
          <details className="lg:hidden mb-8 bg-surface-alt border border-border rounded-xl p-4 print:hidden">
            <summary className="text-sm font-semibold text-text cursor-pointer select-none">
              Table of Contents
            </summary>
            <nav className="mt-3">
              <ol className="space-y-1.5">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {i + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </details>

          {/* Content */}
          <div className="prose-like space-y-10 text-text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

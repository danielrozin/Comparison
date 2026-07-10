import type { ReactNode } from "react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
  accent: string;
  tag: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Search any two things",
    description:
      "Type the names of two athletes, countries, products, software tools, historical events — anything. Our AI understands nearly any topic.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    gradient: "from-primary-500 to-indigo-600",
    accent: "bg-primary-50 border-primary-100",
    tag: "Step 1",
  },
  {
    number: "02",
    title: "Get data-backed analysis",
    description:
      "We compare dozens of attributes side-by-side — specs, stats, pros & cons, and a clear verdict — all in seconds.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    gradient: "from-accent-500 to-purple-600",
    accent: "bg-accent-50 border-accent-100",
    tag: "Step 2",
  },
  {
    number: "03",
    title: "Decide with confidence",
    description:
      "Read the AI-generated verdict, explore community votes, share with a link, and bookmark it for later. Always free.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-600",
    accent: "bg-emerald-50 border-emerald-100",
    tag: "Step 3",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 uppercase tracking-widest mb-3">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          How it works
        </p>
        <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-display font-bold text-text">
          Instant comparisons. No signup required.
        </h2>
        <p className="text-text-secondary mt-2 max-w-xl mx-auto text-sm sm:text-base">
          From search to verdict in seconds — structured, visual, and free.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
        {/* Connector line (desktop only) */}
        <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-primary-200 via-accent-200 to-emerald-200 z-0 mx-16" aria-hidden="true" />

        {STEPS.map((step, idx) => (
          <div
            key={step.number}
            className={`relative flex flex-col items-center text-center p-6 bg-white border ${step.accent} rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 z-10`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Step tag */}
            <span className="absolute top-3 right-3 text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest">
              {step.tag}
            </span>

            {/* Icon circle */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md mb-4 flex-shrink-0`}>
              {step.icon}
            </div>

            <h3 className="text-base font-bold text-text mb-2 leading-snug">
              {step.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

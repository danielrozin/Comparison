"use client";

import { useRef } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  gradient: string;
  icon: React.ReactNode;
}

function StatCard({ stat }: { stat: StatItem }) {
  const liRef = useRef<HTMLLIElement>(null);
  const { value } = useCountUp(stat.value, 1400, liRef);

  return (
    <li
      ref={liRef}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center"
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm mb-3`}>
        {stat.icon}
      </div>
      <div className="text-2xl font-black text-text tabular-nums">
        {value.toLocaleString()}{stat.suffix ?? ""}
      </div>
      <div className="text-xs text-text-secondary mt-1 font-medium">{stat.label}</div>
    </li>
  );
}

interface AnimatedStatsProps {
  totalCount: number;
  categoryCount: number;
}

export function AnimatedStats({ totalCount, categoryCount }: AnimatedStatsProps) {
  const stats: StatItem[] = [
    {
      value: totalCount,
      suffix: "+",
      label: "Comparisons",
      gradient: "from-indigo-500 to-purple-600",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      value: categoryCount,
      label: "Categories",
      gradient: "from-emerald-500 to-teal-600",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      value: 24,
      suffix: "/7",
      label: "Available",
      gradient: "from-amber-500 to-orange-600",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      value: 100,
      suffix: "%",
      label: "Free",
      gradient: "from-rose-500 to-pink-600",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <ul role="list" className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 list-none">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </ul>
  );
}

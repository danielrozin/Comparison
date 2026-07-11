"use client";

import { useState, useCallback } from "react";

interface Result {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  workdays: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

function countWorkdays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endD = new Date(end);
  endD.setHours(0, 0, 0, 0);
  while (cur < endD) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function calcDiff(startStr: string, endStr: string): Result | null {
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const [s, e] = start <= end ? [start, end] : [end, start];

  const totalMs = e.getTime() - s.getTime();
  const totalDays = Math.round(totalMs / 86400000);
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  // Calendar years/months/days
  let y = e.getFullYear() - s.getFullYear();
  let m = e.getMonth() - s.getMonth();
  let d = e.getDate() - s.getDate();
  if (d < 0) {
    m -= 1;
    const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
    d += prevMonth.getDate();
  }
  if (m < 0) { y -= 1; m += 12; }

  const workdays = countWorkdays(s, e);
  const hours = totalDays * 24;
  const minutes = hours * 60;

  return { totalDays, weeks, remainingDays, workdays, years: y, months: m, days: d, hours, minutes };
}

function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export function DaysBetweenDates() {
  const today = todayStr();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [swapped, setSwapped] = useState(false);

  const calculate = useCallback(() => {
    setError("");
    if (!startDate || !endDate) { setError("Please select both a start and end date."); return; }
    const r = calcDiff(startDate, endDate);
    if (!r) { setError("Invalid dates. Please try again."); return; }
    setSwapped(new Date(endDate) < new Date(startDate));
    setResult(r);
  }, [startDate, endDate]);

  const setPreset = (days: number) => {
    const t = new Date();
    const future = new Date(t);
    future.setDate(t.getDate() + days);
    setStartDate(todayStr());
    const fs = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`;
    setEndDate(fs);
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text mb-5">Select Date Range</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="start">
              Start Date
            </label>
            <input
              id="start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="end">
              End Date
            </label>
            <input
              id="end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Quick presets */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Quick select (from today)</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "30 days", days: 30 },
              { label: "90 days", days: 90 },
              { label: "6 months", days: 183 },
              { label: "1 year", days: 365 },
              { label: "2 years", days: 730 },
            ].map(({ label, days }) => (
              <button
                key={days}
                onClick={() => setPreset(days)}
                className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 text-text-secondary transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}
        <button
          onClick={calculate}
          className="mt-5 w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
        >
          Calculate
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {swapped && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              End date is before start date — showing the absolute difference.
            </p>
          )}
          {/* Hero stat */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200 mb-1">Total Days</p>
            <p className="text-6xl font-extrabold">{result.totalDays.toLocaleString()}</p>
            <p className="text-emerald-200 mt-1">
              {result.years > 0 && `${result.years} year${result.years !== 1 ? "s" : ""}, `}
              {result.months > 0 && `${result.months} month${result.months !== 1 ? "s" : ""}, `}
              {result.days} day{result.days !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Stat grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Weeks" value={result.weeks.toLocaleString()} sub={`+ ${result.remainingDays} day${result.remainingDays !== 1 ? "s" : ""}`} color="blue" />
            <StatCard label="Workdays" value={result.workdays.toLocaleString()} sub="Mon–Fri only" color="purple" />
            <StatCard label="Hours" value={result.hours.toLocaleString()} sub={`${result.totalDays} × 24`} color="amber" />
            <StatCard label="Minutes" value={result.minutes.toLocaleString()} sub={`${result.hours.toLocaleString()} × 60`} color="rose" />
          </div>

          {/* Calendar breakdown */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-semibold text-text mb-3">Calendar Breakdown</h3>
            <dl className="grid grid-cols-3 gap-4 text-center">
              {[
                ["Years", result.years],
                ["Months", result.months],
                ["Days", result.days],
              ].map(([label, val]) => (
                <div key={label as string} className="bg-surface-alt rounded-lg p-3">
                  <dt className="text-xs text-text-secondary uppercase tracking-wide">{label}</dt>
                  <dd className="text-2xl font-bold text-text mt-1">{(val as number).toLocaleString()}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: "blue" | "purple" | "amber" | "rose" }) {
  const palettes = {
    blue: "bg-blue-50 border-blue-200 text-blue-700 text-blue-900 text-blue-600",
    purple: "bg-purple-50 border-purple-200 text-purple-700 text-purple-900 text-purple-600",
    amber: "bg-amber-50 border-amber-200 text-amber-700 text-amber-900 text-amber-600",
    rose: "bg-rose-50 border-rose-200 text-rose-700 text-rose-900 text-rose-600",
  };
  const classes = palettes[color].split(" ");
  return (
    <div className={`${classes[0]} ${classes[1]} border rounded-xl p-4 text-center`}>
      <p className={`text-sm font-semibold uppercase tracking-wide mb-1 ${classes[2]}`}>{label}</p>
      <p className={`text-2xl font-extrabold ${classes[3]}`}>{value}</p>
      <p className={`text-xs mt-1 ${classes[4]}`}>{sub}</p>
    </div>
  );
}

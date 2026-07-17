"use client";

import { useState, useCallback } from "react";

interface Result {
  roi: number;
  netProfit: number;
  annualizedRoi: number | null;
  multiple: number;
}

function calcRoi(initial: number, finalVal: number, years: number | null): Result {
  const netProfit = finalVal - initial;
  const roi = (netProfit / initial) * 100;
  const multiple = finalVal / initial;
  let annualizedRoi: number | null = null;
  if (years && years > 0) {
    annualizedRoi = (Math.pow(multiple, 1 / years) - 1) * 100;
  }
  return { roi, netProfit, annualizedRoi, multiple };
}

function fmtPct(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
}

function fmtUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function RoiCalculator() {
  const [initial, setInitial] = useState("10000");
  const [finalVal, setFinalVal] = useState("15000");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const calculate = useCallback(() => {
    setError("");
    const inv = parseFloat(initial.replace(/,/g, ""));
    const fin = parseFloat(finalVal.replace(/,/g, ""));
    const yrs = years ? parseFloat(years) : null;

    if (isNaN(inv) || inv <= 0) { setError("Enter a valid initial investment (greater than 0)."); return; }
    if (isNaN(fin) || fin < 0) { setError("Enter a valid final value."); return; }
    if (yrs !== null && (isNaN(yrs) || yrs <= 0)) { setError("Enter a valid time period in years."); return; }

    setResult(calcRoi(inv, fin, yrs));
  }, [initial, finalVal, years]);

  const isPositive = result && result.roi >= 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text mb-5">Enter Investment Details</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="initial">
              Initial Investment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">$</span>
              <input
                id="initial"
                type="number"
                min="0.01"
                step="100"
                value={initial}
                onChange={(e) => setInitial(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="10000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="final">
              Final Value (or Net Gain)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">$</span>
              <input
                id="final"
                type="number"
                min="0"
                step="100"
                value={finalVal}
                onChange={(e) => setFinalVal(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="15000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="years">
              Time Period (years) <span className="font-normal text-text-secondary">— optional</span>
            </label>
            <input
              id="years"
              type="number"
              min="0.1"
              step="0.5"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="e.g. 3"
            />
            <p className="text-xs text-text-secondary mt-1">Fill in to calculate annualized ROI</p>
          </div>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}
        <button
          onClick={calculate}
          className="mt-5 w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Calculate ROI
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`rounded-xl p-5 text-center border ${isPositive ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
              <p className={`text-sm font-semibold uppercase tracking-wide mb-1 ${isPositive ? "text-emerald-700" : "text-red-700"}`}>ROI</p>
              <p className={`text-3xl font-extrabold ${isPositive ? "text-emerald-900" : "text-red-900"}`}>
                {result.roi >= 0 ? "+" : ""}{fmtPct(result.roi)}
              </p>
              <p className={`text-xs mt-1 ${isPositive ? "text-emerald-600" : "text-red-600"}`}>return on investment</p>
            </div>
            <div className={`rounded-xl p-5 text-center border ${isPositive ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
              <p className={`text-sm font-semibold uppercase tracking-wide mb-1 ${isPositive ? "text-blue-700" : "text-red-700"}`}>Net Profit</p>
              <p className={`text-3xl font-extrabold ${isPositive ? "text-blue-900" : "text-red-900"}`}>
                {result.netProfit >= 0 ? "+" : ""}{fmtUsd(result.netProfit)}
              </p>
              <p className={`text-xs mt-1 ${isPositive ? "text-blue-600" : "text-red-600"}`}>gain / loss</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">Return Multiple</p>
              <p className="text-3xl font-extrabold text-purple-900">{result.multiple.toFixed(2)}x</p>
              <p className="text-xs text-purple-600 mt-1">of initial investment</p>
            </div>
            {result.annualizedRoi !== null ? (
              <div className={`rounded-xl p-5 text-center border ${result.annualizedRoi >= 0 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                <p className={`text-sm font-semibold uppercase tracking-wide mb-1 ${result.annualizedRoi >= 0 ? "text-amber-700" : "text-red-700"}`}>Annualized ROI</p>
                <p className={`text-3xl font-extrabold ${result.annualizedRoi >= 0 ? "text-amber-900" : "text-red-900"}`}>
                  {result.annualizedRoi >= 0 ? "+" : ""}{fmtPct(result.annualizedRoi)}
                </p>
                <p className={`text-xs mt-1 ${result.annualizedRoi >= 0 ? "text-amber-600" : "text-red-600"}`}>per year (CAGR)</p>
              </div>
            ) : (
              <div className="bg-surface-alt border border-border rounded-xl p-5 text-center flex items-center justify-center">
                <p className="text-sm text-text-secondary">Add time period for annualized ROI</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-semibold text-text mb-3">Summary</h3>
            <dl className="space-y-2">
              {[
                ["Initial Investment", fmtUsd(parseFloat(initial))],
                ["Final Value", fmtUsd(parseFloat(finalVal))],
                ["Net Profit / Loss", (result.netProfit >= 0 ? "+" : "") + fmtUsd(result.netProfit)],
                ["ROI", (result.roi >= 0 ? "+" : "") + fmtPct(result.roi)],
                ...(result.annualizedRoi !== null ? [["Annualized ROI (CAGR)", (result.annualizedRoi >= 0 ? "+" : "") + fmtPct(result.annualizedRoi)]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="font-semibold text-text">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

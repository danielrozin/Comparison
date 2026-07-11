"use client";

import { useState, useCallback } from "react";

interface Result {
  months: number;
  totalPaid: number;
  totalInterest: number;
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
}

function calcLoanPayoff(balance: number, annualRate: number, monthlyPayment: number): Result | null {
  if (balance <= 0 || annualRate < 0 || monthlyPayment <= 0) return null;
  const r = annualRate / 100 / 12;
  const minPayment = r > 0 ? balance * r : 1;
  if (monthlyPayment <= minPayment && r > 0) return null;

  const schedule: Result["schedule"] = [];
  let bal = balance;
  let month = 0;

  while (bal > 0 && month < 600) {
    month++;
    const interestCharge = r > 0 ? bal * r : 0;
    const principalCharge = Math.min(monthlyPayment - interestCharge, bal);
    const payment = interestCharge + principalCharge;
    bal = Math.max(0, bal - principalCharge);
    schedule.push({
      month,
      payment: parseFloat(payment.toFixed(2)),
      principal: parseFloat(principalCharge.toFixed(2)),
      interest: parseFloat(interestCharge.toFixed(2)),
      balance: parseFloat(bal.toFixed(2)),
    });
    if (bal < 0.01) break;
  }

  const totalPaid = schedule.reduce((s, r) => s + r.payment, 0);
  return {
    months: month,
    totalPaid: parseFloat(totalPaid.toFixed(2)),
    totalInterest: parseFloat((totalPaid - balance).toFixed(2)),
    schedule,
  };
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function LoanPayoffCalculator() {
  const [balance, setBalance] = useState("10000");
  const [rate, setRate] = useState("6.5");
  const [payment, setPayment] = useState("200");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const calculate = useCallback(() => {
    setError("");
    const b = parseFloat(balance.replace(/,/g, ""));
    const r = parseFloat(rate);
    const p = parseFloat(payment.replace(/,/g, ""));
    if (isNaN(b) || b <= 0) { setError("Enter a valid loan balance."); return; }
    if (isNaN(r) || r < 0 || r > 100) { setError("Enter a valid interest rate (0–100%)."); return; }
    if (isNaN(p) || p <= 0) { setError("Enter a valid monthly payment."); return; }
    const res = calcLoanPayoff(b, r, p);
    if (!res) {
      setError("Monthly payment is too low to cover interest. Increase your payment.");
      return;
    }
    setResult(res);
    setShowSchedule(false);
  }, [balance, rate, payment]);

  const years = result ? Math.floor(result.months / 12) : 0;
  const months = result ? result.months % 12 : 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text mb-5">Enter Your Loan Details</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="balance">
              Current Loan Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">$</span>
              <input
                id="balance"
                type="number"
                min="1"
                step="100"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="10000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="rate">
              Annual Interest Rate (APR)
            </label>
            <div className="relative">
              <input
                id="rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="6.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="payment">
              Monthly Payment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">$</span>
              <input
                id="payment"
                type="number"
                min="1"
                step="10"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="200"
              />
            </div>
          </div>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}
        <button
          onClick={calculate}
          className="mt-5 w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
        >
          Calculate Payoff
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-1">Payoff Time</p>
              <p className="text-3xl font-extrabold text-emerald-900">
                {years > 0 ? `${years}y ` : ""}{months > 0 ? `${months}m` : years > 0 ? "" : `${result.months}mo`}
              </p>
              <p className="text-xs text-emerald-600 mt-1">{result.months} total payments</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">Total Paid</p>
              <p className="text-3xl font-extrabold text-blue-900">{fmt(result.totalPaid)}</p>
              <p className="text-xs text-blue-600 mt-1">principal + interest</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-1">Total Interest</p>
              <p className="text-3xl font-extrabold text-amber-900">{fmt(result.totalInterest)}</p>
              <p className="text-xs text-amber-600 mt-1">
                {((result.totalInterest / result.totalPaid) * 100).toFixed(1)}% of total cost
              </p>
            </div>
          </div>

          {/* Visual breakdown bar */}
          <div className="bg-white border border-border rounded-xl p-5">
            <p className="text-sm font-semibold text-text mb-3">Cost Breakdown</p>
            <div className="flex rounded-full overflow-hidden h-5 mb-2">
              <div
                className="bg-primary-500"
                style={{ width: `${((parseFloat(balance) / result.totalPaid) * 100).toFixed(1)}%` }}
                title={`Principal: ${fmt(parseFloat(balance))}`}
              />
              <div
                className="bg-amber-400"
                style={{ width: `${((result.totalInterest / result.totalPaid) * 100).toFixed(1)}%` }}
                title={`Interest: ${fmt(result.totalInterest)}`}
              />
            </div>
            <div className="flex gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" />Principal {fmt(parseFloat(balance))}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />Interest {fmt(result.totalInterest)}</span>
            </div>
          </div>

          {/* Amortization schedule toggle */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowSchedule((s) => !s)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-text hover:bg-surface-alt transition-colors"
            >
              <span>Amortization Schedule (first 24 payments)</span>
              <span className="text-text-secondary text-lg">{showSchedule ? "−" : "+"}</span>
            </button>
            {showSchedule && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-alt">
                      <th className="px-4 py-2.5 text-left text-text font-semibold">Month</th>
                      <th className="px-4 py-2.5 text-right text-text font-semibold">Payment</th>
                      <th className="px-4 py-2.5 text-right text-text font-semibold">Principal</th>
                      <th className="px-4 py-2.5 text-right text-text font-semibold">Interest</th>
                      <th className="px-4 py-2.5 text-right text-text font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, 24).map((row) => (
                      <tr key={row.month} className={row.month % 2 === 0 ? "bg-surface-alt" : ""}>
                        <td className="px-4 py-2 text-text-secondary">{row.month}</td>
                        <td className="px-4 py-2 text-right text-text-secondary">{fmt(row.payment)}</td>
                        <td className="px-4 py-2 text-right text-emerald-600">{fmt(row.principal)}</td>
                        <td className="px-4 py-2 text-right text-amber-600">{fmt(row.interest)}</td>
                        <td className="px-4 py-2 text-right font-medium text-text">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

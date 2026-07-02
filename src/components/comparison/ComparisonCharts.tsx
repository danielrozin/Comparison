"use client";

import { useState, useMemo } from "react";
import type { ComparisonAttribute, ComparisonEntityData } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ComparisonChartsProps {
  attributes: ComparisonAttribute[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

type TabType = "bar" | "radar" | "score";

const ENTITY_A_COLOR = "#6366f1";
const ENTITY_B_COLOR = "#a855f7";

export function ComparisonCharts({
  attributes,
  entityA,
  entityB,
}: ComparisonChartsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("bar");

  const numericAttributes = useMemo(
    () =>
      attributes.filter((attr) =>
        attr.values.some((v) => v.valueNumber != null)
      ),
    [attributes]
  );

  const barData = useMemo(
    () =>
      numericAttributes.map((attr) => {
        const valA =
          attr.values.find((v) => v.entityId === entityA.id)?.valueNumber ?? 0;
        const valB =
          attr.values.find((v) => v.entityId === entityB.id)?.valueNumber ?? 0;
        return {
          name: attr.name,
          [entityA.name]: valA,
          [entityB.name]: valB,
          unit: attr.unit || "",
        };
      }),
    [numericAttributes, entityA, entityB]
  );

  const radarData = useMemo(
    () =>
      numericAttributes.map((attr) => {
        const valA =
          attr.values.find((v) => v.entityId === entityA.id)?.valueNumber ?? 0;
        const valB =
          attr.values.find((v) => v.entityId === entityB.id)?.valueNumber ?? 0;
        const max = Math.max(Math.abs(valA), Math.abs(valB), 1);
        return {
          attribute: attr.name,
          [entityA.name]: Math.round((Math.abs(valA) / max) * 100),
          [entityB.name]: Math.round((Math.abs(valB) / max) * 100),
        };
      }),
    [numericAttributes, entityA, entityB]
  );

  const scoreData = useMemo(() => {
    let winsA = 0;
    let winsB = 0;
    let ties = 0;
    for (const attr of numericAttributes) {
      const valObjA = attr.values.find((v) => v.entityId === entityA.id);
      const valObjB = attr.values.find((v) => v.entityId === entityB.id);
      if (valObjA?.winner && !valObjB?.winner) winsA++;
      else if (valObjB?.winner && !valObjA?.winner) winsB++;
      else {
        const numA = valObjA?.valueNumber ?? 0;
        const numB = valObjB?.valueNumber ?? 0;
        if (attr.higherIsBetter === true) {
          if (numA > numB) winsA++;
          else if (numB > numA) winsB++;
          else ties++;
        } else if (attr.higherIsBetter === false) {
          if (numA < numB) winsA++;
          else if (numB < numA) winsB++;
          else ties++;
        } else {
          ties++;
        }
      }
    }
    const total = winsA + winsB + ties;
    return {
      winsA,
      winsB,
      ties,
      total,
      pctA: total > 0 ? Math.round((winsA / total) * 100) : 0,
      pctB: total > 0 ? Math.round((winsB / total) * 100) : 0,
    };
  }, [numericAttributes, entityA, entityB]);

  if (numericAttributes.length === 0) return null;

  const tabs: { key: TabType; label: string }[] = [
    { key: "bar", label: "Bar Chart" },
    { key: "radar", label: "Radar Chart" },
    { key: "score", label: "Score Card" },
  ];

  return (
    <section aria-labelledby="visual-comparison-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 id="visual-comparison-heading" className="text-2xl font-display font-bold text-text">Visual Comparison</h2>
      </div>

      <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-border rounded-xl p-4 sm:p-6">
        {/* Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div role="tablist" aria-label="Chart type" className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-border">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`chart-panel-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-text-secondary hover:text-text hover:bg-surface-alt"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Content */}
        <div role="tabpanel" id={`chart-panel-${activeTab}`} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-border min-h-[350px]">
          {activeTab === "bar" && (
            <BarChartView
              data={barData}
              entityAName={entityA.name}
              entityBName={entityB.name}
            />
          )}
          {activeTab === "radar" && (
            <RadarChartView
              data={radarData}
              entityAName={entityA.name}
              entityBName={entityB.name}
            />
          )}
          {activeTab === "score" && (
            <ScoreCardView
              data={scoreData}
              entityAName={entityA.name}
              entityBName={entityB.name}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ========== Bar Chart ========== */
function BarChartView({
  data,
  entityAName,
  entityBName,
}: {
  data: Record<string, unknown>[];
  entityAName: string;
  entityBName: string;
}) {
  const chartHeight = Math.max(300, data.length * 50);

  return (
    <div>
      <p className="text-sm text-text-secondary mb-4 text-center">
        Side-by-side comparison of numeric attributes
      </p>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value, _name, props: any) => {
              const unit = (props?.payload?.unit as string) || "";
              return [`${value}${unit ? ` ${unit}` : ""}`, _name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />
          <Bar
            dataKey={entityAName}
            fill={ENTITY_A_COLOR}
            radius={[0, 4, 4, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey={entityBName}
            fill={ENTITY_B_COLOR}
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            animationBegin={200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ========== Radar Chart ========== */
function RadarChartView({
  data,
  entityAName,
  entityBName,
}: {
  data: Record<string, unknown>[];
  entityAName: string;
  entityBName: string;
}) {
  return (
    <div>
      <p className="text-sm text-text-secondary mb-4 text-center">
        Normalized scores (0-100) for at-a-glance comparison
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="attribute"
            tick={{ fontSize: 11, fill: "#6b7280" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name={entityAName}
            dataKey={entityAName}
            stroke={ENTITY_A_COLOR}
            fill={ENTITY_A_COLOR}
            fillOpacity={0.2}
            animationDuration={800}
          />
          <Radar
            name={entityBName}
            dataKey={entityBName}
            stroke={ENTITY_B_COLOR}
            fill={ENTITY_B_COLOR}
            fillOpacity={0.2}
            animationDuration={800}
            animationBegin={200}
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ========== Score Card ========== */
function ScoreCardView({
  data,
  entityAName,
  entityBName,
}: {
  data: {
    winsA: number;
    winsB: number;
    ties: number;
    total: number;
    pctA: number;
    pctB: number;
  };
  entityAName: string;
  entityBName: string;
}) {
  return (
    <div>
      <p className="text-sm text-text-secondary mb-6 text-center">
        Category wins across {data.total} numeric attributes
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto list-none">
        {/* Entity A */}
        <li className="flex flex-col items-center">
          <CircularProgress
            percentage={data.pctA}
            color={ENTITY_A_COLOR}
            size={120}
          />
          <h3 className="mt-3 font-semibold text-text text-center">
            {entityAName}
          </h3>
          <p className="text-sm text-text-secondary">
            {data.winsA} win{data.winsA !== 1 ? "s" : ""}
          </p>
        </li>

        {/* Ties */}
        <li className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-surface-alt flex items-center justify-center">
            <span className="text-2xl font-bold text-text-secondary">
              {data.ties}
            </span>
          </div>
          <h3 className="mt-3 font-semibold text-text-secondary">Ties</h3>
          <p className="text-sm text-text-secondary">
            {data.total > 0
              ? Math.round((data.ties / data.total) * 100)
              : 0}
            %
          </p>
        </li>

        {/* Entity B */}
        <li className="flex flex-col items-center">
          <CircularProgress
            percentage={data.pctB}
            color={ENTITY_B_COLOR}
            size={120}
          />
          <h3 className="mt-3 font-semibold text-text text-center">
            {entityBName}
          </h3>
          <p className="text-sm text-text-secondary">
            {data.winsB} win{data.winsB !== 1 ? "s" : ""}
          </p>
        </li>
      </ul>

      {/* Summary bar */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="flex h-3 rounded-full overflow-hidden bg-surface-alt">
          {data.pctA > 0 && (
            <div
              className="transition-all duration-1000 ease-out rounded-l-full"
              style={{
                width: `${data.pctA}%`,
                backgroundColor: ENTITY_A_COLOR,
              }}
            />
          )}
          {data.ties > 0 && (
            <div
              className="transition-all duration-1000 ease-out bg-border"
              style={{
                width: `${
                  data.total > 0
                    ? Math.round((data.ties / data.total) * 100)
                    : 0
                }%`,
              }}
            />
          )}
          {data.pctB > 0 && (
            <div
              className="transition-all duration-1000 ease-out rounded-r-full"
              style={{
                width: `${data.pctB}%`,
                backgroundColor: ENTITY_B_COLOR,
              }}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-text-secondary">
          <span>{entityAName}</span>
          <span>{entityBName}</span>
        </div>
      </div>
    </div>
  );
}

/* ========== Circular Progress ========== */
function CircularProgress({
  percentage,
  color,
  size = 120,
}: {
  percentage: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            animation: "circularFill 1s ease-out forwards",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

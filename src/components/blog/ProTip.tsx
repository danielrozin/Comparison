interface ProTipProps {
  children: string;
  type?: "tip" | "warning" | "info";
}

const styles = {
  tip: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "💡",
    label: "Pro Tip",
    labelColor: "text-green-700",
    textColor: "text-green-800",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "⚠️",
    label: "Warning",
    labelColor: "text-amber-700",
    textColor: "text-amber-800",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "ℹ️",
    label: "Note",
    labelColor: "text-blue-700",
    textColor: "text-blue-800",
  },
};

export function ProTip({ children, type = "tip" }: ProTipProps) {
  const s = styles[type];
  return (
    <div className={`my-6 p-4 ${s.bg} border ${s.border} rounded-xl`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{s.icon}</span>
        <span className={`text-xs font-semibold uppercase tracking-wider ${s.labelColor}`}>
          {s.label}
        </span>
      </div>
      <p className={`text-sm ${s.textColor} leading-relaxed`}>{children}</p>
    </div>
  );
}

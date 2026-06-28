import Link from "next/link";

const CATEGORY_GRADIENTS: Record<string, string> = {
  sports: "from-orange-50 to-amber-50 group-hover:from-orange-100 group-hover:to-amber-100",
  countries: "from-cyan-50 to-sky-50 group-hover:from-cyan-100 group-hover:to-sky-100",
  technology: "from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100",
  products: "from-violet-50 to-purple-50 group-hover:from-violet-100 group-hover:to-purple-100",
  health: "from-emerald-50 to-green-50 group-hover:from-emerald-100 group-hover:to-green-100",
  finance: "from-lime-50 to-emerald-50 group-hover:from-lime-100 group-hover:to-emerald-100",
  education: "from-sky-50 to-blue-50 group-hover:from-sky-100 group-hover:to-blue-100",
  entertainment: "from-pink-50 to-rose-50 group-hover:from-pink-100 group-hover:to-rose-100",
  history: "from-amber-50 to-yellow-50 group-hover:from-amber-100 group-hover:to-yellow-100",
  automotive: "from-slate-50 to-gray-50 group-hover:from-slate-100 group-hover:to-gray-100",
  companies: "from-indigo-50 to-blue-50 group-hover:from-indigo-100 group-hover:to-blue-100",
  brands: "from-purple-50 to-fuchsia-50 group-hover:from-purple-100 group-hover:to-fuchsia-100",
  celebrities: "from-rose-50 to-pink-50 group-hover:from-rose-100 group-hover:to-pink-100",
};

const ICON_BG: Record<string, string> = {
  sports: "bg-orange-100 group-hover:bg-orange-200",
  countries: "bg-cyan-100 group-hover:bg-cyan-200",
  technology: "bg-blue-100 group-hover:bg-blue-200",
  products: "bg-violet-100 group-hover:bg-violet-200",
  health: "bg-emerald-100 group-hover:bg-emerald-200",
  finance: "bg-lime-100 group-hover:bg-lime-200",
  education: "bg-sky-100 group-hover:bg-sky-200",
  entertainment: "bg-pink-100 group-hover:bg-pink-200",
  history: "bg-amber-100 group-hover:bg-amber-200",
  automotive: "bg-slate-100 group-hover:bg-slate-200",
  companies: "bg-indigo-100 group-hover:bg-indigo-200",
  brands: "bg-purple-100 group-hover:bg-purple-200",
  celebrities: "bg-rose-100 group-hover:bg-rose-200",
};

export function CategoryCard({
  category,
}: {
  category: { slug: string; name: string; icon: string };
}) {
  const gradient = CATEGORY_GRADIENTS[category.slug] ?? "from-gray-50 to-white group-hover:from-gray-100 group-hover:to-gray-50";
  const iconBg = ICON_BG[category.slug] ?? "bg-gray-100 group-hover:bg-gray-200";

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group relative flex flex-col items-center gap-3 p-5 bg-gradient-to-br ${gradient} border border-border rounded-2xl hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center overflow-hidden`}
    >
      {/* Subtle shine on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className={`relative w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center transition-all duration-200 group-hover:scale-110`}>
        <span className="text-2xl leading-none">{category.icon}</span>
      </div>
      <span className="relative text-sm font-semibold text-text group-hover:text-primary-700 transition-colors leading-snug">
        {category.name}
      </span>
      <svg
        className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

import Link from "next/link";
import { CategoryIcon } from "@/lib/utils/category-icons";

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
  automotive: "from-slate-50 to-zinc-50 group-hover:from-slate-100 group-hover:to-zinc-100",
  companies: "from-indigo-50 to-blue-50 group-hover:from-indigo-100 group-hover:to-blue-100",
  brands: "from-purple-50 to-fuchsia-50 group-hover:from-purple-100 group-hover:to-fuchsia-100",
  celebrities: "from-rose-50 to-pink-50 group-hover:from-rose-100 group-hover:to-pink-100",
  software: "from-sky-50 to-blue-50 group-hover:from-sky-100 group-hover:to-blue-100",
  military: "from-green-50 to-teal-50 group-hover:from-green-100 group-hover:to-teal-100",
  economy: "from-teal-50 to-cyan-50 group-hover:from-teal-100 group-hover:to-cyan-100",
  travel: "from-sky-50 to-indigo-50 group-hover:from-sky-100 group-hover:to-indigo-100",
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
  software: "bg-sky-100 group-hover:bg-sky-200",
  military: "bg-green-100 group-hover:bg-green-200",
  economy: "bg-teal-100 group-hover:bg-teal-200",
  travel: "bg-sky-100 group-hover:bg-indigo-100",
};

export function CategoryCard({
  category,
}: {
  category: { slug: string; name: string; icon: string };
}) {
  const gradient = CATEGORY_GRADIENTS[category.slug] ?? "from-surface-alt to-white group-hover:from-surface group-hover:to-surface-alt";
  const iconBg = ICON_BG[category.slug] ?? "bg-primary-100 group-hover:bg-primary-200";

  return (
    <Link
      href={`/category/${category.slug}`}
      aria-label={`Browse ${category.name} comparisons`}
      className={`group relative flex flex-col items-center gap-3 p-5 bg-gradient-to-br ${gradient} border border-border rounded-2xl hover:border-primary-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center overflow-hidden`}
    >
      {/* Shine sweep on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Glow dot in corner */}
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className={`relative w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm`}>
        <CategoryIcon category={category.slug} className="w-6 h-6" />
      </div>
      <span className="relative text-sm font-semibold text-text group-hover:text-primary-700 transition-colors leading-snug">
        {category.name}
      </span>

      {/* Arrow — always visible on mobile (no hover on touch), fade-in on desktop hover.
          aria-hidden: link already announces "Browse {category} comparisons". */}
      <div aria-hidden="true" className="flex items-center gap-1 text-xs font-semibold text-primary-500 sm:opacity-0 sm:-mt-1 sm:group-hover:opacity-100 sm:group-hover:mt-0 sm:transition-all sm:duration-200">
        Browse
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

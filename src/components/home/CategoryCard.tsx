import Link from "next/link";

export function CategoryCard({
  category,
}: {
  category: { slug: string; name: string; icon: string };
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-2 p-6 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200 text-center"
    >
      <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
        {category.icon}
      </span>
      <span className="text-sm font-semibold text-text group-hover:text-primary-700 transition-colors">
        {category.name}
      </span>
    </Link>
  );
}

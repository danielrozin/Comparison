"use client";

import Link from "next/link";

interface CTABlockProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
  variant?: "primary" | "newsletter";
}

export function CTABlock({
  title = "Find Your Perfect Match",
  description = "Use our comparison tools to make data-driven decisions.",
  buttonText = "Explore Comparisons",
  href = "/trending",
  variant = "primary",
}: CTABlockProps) {
  if (variant === "newsletter") {
    return (
      <div className="my-6 p-6 bg-gradient-to-br from-indigo-600 to-primary-700 rounded-xl text-white text-center">
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-indigo-100 text-sm mb-4">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    );
  }

  return (
    <div className="my-6 p-5 bg-surface-alt border border-border rounded-xl flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-1">
        <h4 className="text-lg font-bold text-text mb-1">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <Link
        href={href}
        className="flex-shrink-0 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        {buttonText}
      </Link>
    </div>
  );
}

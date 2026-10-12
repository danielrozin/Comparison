"use client";

import Link from "next/link";

/**
 * Points at a live comparison when the typed query is close but not the
 * page title. The link never creates a page — `href` is an existing slug.
 */
export function DidYouMean({
  title,
  href,
  onSelect,
}: {
  title: string;
  href: string;
  onSelect: () => void;
}) {
  return (
    <p className="px-4 py-2.5 text-sm text-text bg-primary-50/70 border-b border-primary-100">
      Did you mean{" "}
      <Link
        href={href}
        onClick={onSelect}
        className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
      >
        {title}
      </Link>
      ?
    </p>
  );
}

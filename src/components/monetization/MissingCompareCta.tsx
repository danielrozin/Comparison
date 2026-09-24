"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * 404s do not receive the missing path on the server. On a /compare/{slug}
 * miss, point the request button at that slug so the form is already filled in.
 */
export function MissingCompareCta({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [href, setHref] = useState("/custom-compare");

  useEffect(() => {
    const match = window.location.pathname.match(/^\/compare\/([a-z0-9-]+)\/?$/i);
    if (match) {
      setHref(`/custom-compare?slug=${encodeURIComponent(match[1].toLowerCase())}`);
    }
  }, []);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

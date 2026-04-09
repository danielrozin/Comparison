"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { tagPageType, tagViewport } from "@/lib/services/clarity-service";

type PageType = "home" | "search" | "category" | "comparison" | "blog" | "embed" | "other";

function detectPageType(pathname: string): PageType {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/category/")) return "category";
  if (pathname.startsWith("/compare/")) return "comparison";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/embed")) return "embed";
  return "other";
}

export function ClarityTags() {
  const pathname = usePathname();

  useEffect(() => {
    tagPageType(detectPageType(pathname));
    tagViewport();
  }, [pathname]);

  return null;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Comparisons | A Versus B",
  description:
    "Search and compare anything — sports players, countries, products, technology, and more. Type any two things to get an instant, data-driven comparison.",
  alternates: {
    canonical: "https://www.aversusb.net/search",
  },
  openGraph: {
    title: "Search Comparisons | A Versus B",
    description:
      "Search and compare anything — sports players, countries, products, technology, and more.",
    url: "https://www.aversusb.net/search",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Search Comparisons | A Versus B",
    description:
      "Search and compare anything — sports players, countries, products, technology, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

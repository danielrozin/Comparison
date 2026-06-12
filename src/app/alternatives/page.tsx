import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { breadcrumbSchema } from "@/lib/seo/schema";

// /alternatives hub index. Gives the dedicated "Alternative to" pages (and the
// dynamic /alternatives/[slug] pages) a real parent so their breadcrumb position-2
// crumb resolves instead of 404ing. Added alongside the Photoshop ship (DAN-1056).

export const revalidate = 3600;

const TITLE = "Software & Product Alternatives — Compared by Use Case";
const DESC =
  "Find the best alternative to popular software and products. Side-by-side picks by use case, budget, and platform — from image editors to productivity tools.";
const CANONICAL = `${SITE_URL}/alternatives`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: CANONICAL,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

// Curated "Alternative to" hubs. Dedicated rich pages live at their own route;
// the rest are served by /alternatives/[slug] from entity content.
const HUBS: { slug: string; name: string; note: string }[] = [
  { slug: "photoshop", name: "Photoshop", note: "8 image editors — free pro, one-time, Mac, RAW" },
  { slug: "chatgpt", name: "ChatGPT", note: "AI assistants and chatbots compared" },
  { slug: "notion", name: "Notion", note: "All-in-one workspace alternatives" },
  { slug: "slack", name: "Slack", note: "Team chat and messaging tools" },
  { slug: "figma", name: "Figma", note: "Design and prototyping tools" },
  { slug: "nordvpn", name: "NordVPN", note: "VPN services compared" },
];

export default function AlternativesIndexPage() {
  const breadcrumbs = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Alternatives", url: CANONICAL },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-text font-medium">Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-3 leading-tight">
            Software &amp; Product Alternatives
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Looking to switch? Each guide compares the best alternatives by use case, budget, and platform —
            so you find the right replacement, not a downgrade you&rsquo;ll regret.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HUBS.map((h) => (
            <Link
              key={h.slug}
              href={`/alternatives/${h.slug}`}
              className="block bg-white border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <h2 className="font-bold text-text mb-1">Alternatives to {h.name}</h2>
              <p className="text-sm text-text-secondary">{h.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

// Web App Manifest — Next.js App Router convention.
// Enables "Add to Home Screen" on mobile, provides icons to OS launchers,
// and gives Bing and Google explicit PWA signals (start_url, display, shortcuts).
// Shortcuts are surfaced in Android/Chrome "long press" menus and Windows jump lists,
// driving re-engagement from installed users and giving search engines extra
// navigational anchors for crawl priority signals.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Compare Anything`,
    short_name: "A Versus B",
    description:
      "The internet's most comprehensive comparison platform — 3,000+ side-by-side comparisons across technology, sports, countries, products, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a56db",
    orientation: "any",
    scope: "/",
    lang: "en",
    categories: ["reference", "education", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: `${SITE_URL}/api/og?title=Compare+Anything&type=home`,
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "A Versus B homepage — Compare Anything",
      },
    ],
    shortcuts: [
      {
        name: "Technology Comparisons",
        short_name: "Tech",
        description: "Compare software, apps, platforms, and devices",
        url: "/category/technology",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
      {
        name: "Sports Comparisons",
        short_name: "Sports",
        description: "Compare athletes, teams, and sports records",
        url: "/category/sports",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
      {
        name: "Country Comparisons",
        short_name: "Countries",
        description: "Compare nations, economies, and cultures",
        url: "/category/countries",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
      {
        name: "Trending Comparisons",
        short_name: "Trending",
        description: "See what the world is comparing right now",
        url: "/trending",
        icons: [{ src: "/favicon.svg", sizes: "any" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}

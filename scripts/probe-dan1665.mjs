import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();

// Check the two target pages
const kobeSlug = "kobe-bryant-vs-lebron-james";
const expediaSlug = "expedia-vs-kayak";

const kobe = await prisma.comparison.findUnique({
  where: { slug: kobeSlug },
  select: { id: true, title: true, status: true, category: true, shortAnswer: true, metaTitle: true, metaDescription: true,
    faqs: { select: { question: true, sortOrder: true } }
  }
});

const expedia = await prisma.comparison.findUnique({
  where: { slug: expediaSlug },
  select: { id: true, title: true, status: true, category: true, shortAnswer: true, metaTitle: true, metaDescription: true,
    faqs: { select: { question: true, sortOrder: true } }
  }
});

console.log("=== KOBE VS LEBRON ===");
console.log("id:", kobe?.id);
console.log("title:", kobe?.title);
console.log("status:", kobe?.status);
console.log("category:", kobe?.category);
console.log("metaTitle:", kobe?.metaTitle);
console.log("shortAnswer (first 150):", kobe?.shortAnswer?.slice(0,150));
console.log("FAQs:", kobe?.faqs?.length);
if (kobe?.faqs) { for (const f of kobe.faqs) console.log("  -", f.question); }

console.log("\n=== EXPEDIA VS KAYAK ===");
console.log("id:", expedia?.id);
console.log("title:", expedia?.title);
console.log("status:", expedia?.status);
console.log("category:", expedia?.category);
console.log("metaTitle:", expedia?.metaTitle);
console.log("shortAnswer (first 150):", expedia?.shortAnswer?.slice(0,150));
console.log("FAQs:", expedia?.faqs?.length);
if (expedia?.faqs) { for (const f of expedia.faqs) console.log("  -", f.question); }

// Existing inbound internal links
const kobeLinks = await prisma.internalLink.findMany({ where: { toPath: `/compare/${kobeSlug}` } });
const expediaLinks = await prisma.internalLink.findMany({ where: { toPath: `/compare/${expediaSlug}` } });
console.log("\n=== EXISTING INBOUND LINKS to kobe ===");
for (const l of kobeLinks) console.log("  ", l.fromPath, "→", l.anchorText);
console.log("\n=== EXISTING INBOUND LINKS to expedia ===");
for (const l of expediaLinks) console.log("  ", l.fromPath, "→", l.anchorText);

// Find sports/basketball comparisons for kobe links
const sportsComps = await prisma.comparison.findMany({
  where: { status: "published", OR: [
    { category: { contains: "sport", mode: "insensitive" } },
    { slug: { contains: "basketball" } },
    { slug: { contains: "nba" } },
    { slug: { contains: "lebron" } },
    { slug: { contains: "kobe" } },
    { slug: { contains: "michael-jordan" } },
    { slug: { contains: "athlete" } },
    { title: { contains: "basketball", mode: "insensitive" } },
    { title: { contains: "NBA", mode: "insensitive" } },
    { title: { contains: "athlete", mode: "insensitive" } },
  ]},
  select: { slug: true, title: true, category: true },
  take: 30
});

console.log("\n=== SPORTS/NBA COMPARISONS ===");
for (const c of sportsComps) console.log(`  /compare/${c.slug}  [${c.category}]  "${c.title}"`);

// Find travel comparisons for expedia links
const travelComps = await prisma.comparison.findMany({
  where: { status: "published", OR: [
    { category: { contains: "travel", mode: "insensitive" } },
    { slug: { contains: "travel" } },
    { slug: { contains: "hotel" } },
    { slug: { contains: "airline" } },
    { slug: { contains: "airbnb" } },
    { slug: { contains: "booking" } },
    { slug: { contains: "vrbo" } },
    { slug: { contains: "delta" } },
    { slug: { contains: "united" } },
    { slug: { contains: "american-airlines" } },
    { title: { contains: "airline", mode: "insensitive" } },
    { title: { contains: "travel", mode: "insensitive" } },
    { title: { contains: "hotel", mode: "insensitive" } },
    { title: { contains: "flight", mode: "insensitive" } },
  ]},
  select: { slug: true, title: true, category: true },
  take: 30
});

console.log("\n=== TRAVEL COMPARISONS ===");
for (const c of travelComps) console.log(`  /compare/${c.slug}  [${c.category}]  "${c.title}"`);

// Check for existing kobe vs lebron blog posts
const blogPosts = await prisma.blogArticle.findMany({
  where: { OR: [
    { slug: { contains: "kobe", mode: "insensitive" } },
    { slug: { contains: "lebron", mode: "insensitive" } },
    { title: { contains: "kobe", mode: "insensitive" } },
    { title: { contains: "LeBron", mode: "insensitive" } },
  ]},
  select: { slug: true, title: true, status: true },
});
console.log("\n=== EXISTING KOBE/LEBRON BLOG POSTS ===");
for (const b of blogPosts) console.log(`  /blog/${b.slug}  [${b.status}]  "${b.title}"`);

await prisma.$disconnect();

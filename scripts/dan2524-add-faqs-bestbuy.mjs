/**
 * DAN-2524 — Add 5 FAQs to best-buy-vs-amazon-electronics (was at 5, needs 10)
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

const newFaqs = [
  {
    question: "Does Best Buy price match Amazon?",
    answer: "Yes — Best Buy price matches Amazon on identical in-stock products. Show a Best Buy associate the lower Amazon price at the time of purchase. Best Buy excludes marketplace sellers, third-party merchants on Amazon, and promotional/clearance prices. Price matching works both in-store and within 15 days of purchase if the price drops.",
  },
  {
    question: "Is it safer to buy electronics from Best Buy or Amazon?",
    answer: "Best Buy is safer for high-value electronics. All Best Buy products are sold directly by Best Buy — no counterfeit risk. Amazon marketplace mixing means even items listed as sold by Amazon can contain third-party units with counterfeit risk. For TVs, laptops, and major appliances, Best Buy or Amazon direct (not marketplace) is recommended.",
  },
  {
    question: "Which is better for TV deals — Best Buy or Amazon?",
    answer: "Both offer strong TV deals but in different ways. Best Buy lets you compare picture quality in-store and includes Geek Squad installation. Amazon offers more frequent price drops and bundle deals. For flagship TVs (OLED, QLED), Best Buy is better for comparison shopping; for budget/mid-range TVs, Amazon often has lower prices. During Prime Day and Black Friday, Amazon frequently undercuts Best Buy on identical models.",
  },
  {
    question: "Does Best Buy have better Black Friday deals than Amazon?",
    answer: "Best Buy and Amazon both run major Black Friday sales. Amazon now runs deals throughout all of November. Best Buy concentrates deeper discounts in the Thanksgiving–Cyber Monday window with in-store doorbuster deals Amazon cannot match. For TVs and laptops, Best Buy Black Friday doorbusters are often the lowest prices of the year; Amazon wins on smaller electronics and everyday items throughout November.",
  },
  {
    question: "Can Best Buy deliver and install appliances like Amazon does?",
    answer: "Yes — Best Buy offers free delivery and haul-away for most major appliances over $399, plus Geek Squad installation for an added fee. Amazon offers appliance delivery through third-party partners and Amazon Home Services, but Best Buy has more consistent installation coverage for built-in appliances, washers/dryers, and refrigerators.",
  },
];

const comp = await prisma.comparison.findUnique({
  where: { slug: "best-buy-vs-amazon-electronics" },
  select: { id: true, faqs: { select: { question: true } } },
});

if (!comp) {
  console.log("Page not found");
  process.exit(1);
}

const existing = new Set(comp.faqs.map((f) => f.question?.toLowerCase().trim()));
const toAdd = newFaqs.filter((f) => !existing.has(f.question.toLowerCase().trim()));
console.log(`Existing FAQs: ${comp.faqs.length} | Adding: ${toAdd.length}`);

if (toAdd.length > 0) {
  await prisma.fAQ.createMany({
    data: toAdd.map((f) => ({
      question: f.question,
      answer: f.answer,
      comparisonId: comp.id,
      sortOrder: 99,
    })),
  });
  await prisma.comparison.update({
    where: { slug: "best-buy-vs-amazon-electronics" },
    data: { lastRefreshedAt: new Date(), contentScore: 80 },
  });
  console.log(`Done. New FAQ count: ${comp.faqs.length + toAdd.length}`);
}

await prisma.$disconnect();

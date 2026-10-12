/**
 * Add Lark as entry #11 to /blog/google-workspace-alternatives-2026
 * (Lark link exchange).
 *
 * Facts come from Lark's product brief (Lark Global Growth, Sep 2026):
 * what the suite includes, and the plan prices Lark publishes. The copy stays
 * in the same voice as the other entries. It does not use review-site ratings,
 * and it does not repeat the brief's comparisons against Google.
 *
 * Idempotent: targeted string edits on the current DB content. If the Lark
 * section already exists the script exits without writing. Every anchor is
 * asserted so a drifted article fails loudly instead of being half-patched.
 *
 * Dry run (no DB; prints the patched markdown for a saved copy of the article):
 *   DRY_RUN_FILE=/tmp/article.md npx tsx scripts/update-google-workspace-alternatives-add-lark.ts
 *
 * Run (prod, via CI, after this file is on main):
 *   gh workflow run publish-editorial.yml -f script=scripts/update-google-workspace-alternatives-add-lark.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
  override: true,
  // Keep DRY_RUN_FILE stdout as pure markdown. Dotenv 17 otherwise logs to stdout.
  quiet: true,
});

import { PrismaClient } from "@prisma/client";

const SLUG = "google-workspace-alternatives-2026";
const LARK_HEADING = "## 11. Lark — the all-in-one workspace with a built-in database";

// No logo: none of the other entries embed one. Pricing is attributed to Lark.
const LARK_SECTION = `${LARK_HEADING}

[Lark](https://www.larksuite.com/), from ByteDance, bundles team chat, video meetings, collaborative docs, calendar, email, a wiki, approvals, and a no-code database called Base. Base covers project trackers, lightweight CRMs, and ticket queues inside the suite instead of in a separate tool. AI features run across chat, meetings (automatic meeting minutes), and docs, and chat and documents include built-in translation for multilingual teams. According to Lark's own pricing, a free Starter tier covers up to 20 users with 100 GB of storage; Basic costs $6/user/month and Pro $12/user/month (billed annually), with Enterprise priced on request.<sup>[5]</sup> The tradeoff is familiarity — outside collaborators are less likely to already know Lark than Google or Microsoft. **Migration effort:** moderate; email and calendar move like any suite switch, while Base workflows are built fresh. **Best for:** distributed, multilingual teams that want messaging, docs, and project tracking in one place, and small teams that fit inside the free tier.

`;

type Edit = { find: string; replace: string; label: string };

const CONTENT_EDITS: Edit[] = [
  {
    label: "content H1 count",
    find: "# 10 Alternatives to Google Workspace That Teams Are Switching To",
    replace: "# 11 Alternatives to Google Workspace That Teams Are Switching To",
  },
  {
    label: "intro count",
    find: "Here are 10 alternatives teams are actually switching to",
    replace: "Here are 11 alternatives teams are actually switching to",
  },
  {
    label: "lead-in count",
    find: "With that context, here are the ten alternatives.",
    replace: "With that context, here are the eleven alternatives.",
  },
  {
    label: "Lark section (before comparison table)",
    find: "## Comparison at a glance",
    replace: `${LARK_SECTION}## Comparison at a glance`,
  },
  {
    label: "comparison table row",
    find: "| Encrypted EU email | €1-3 | Privacy, cheap | Low-Moderate |",
    replace:
      "| Encrypted EU email | €1-3 | Privacy, cheap | Low-Moderate |\n| Lark | Free-$12 | Chat, docs + no-code database | Moderate |",
  },
  {
    label: "who-should-switch bullet",
    find: "- **You are a tiny Apple-only shop:** iCloud+ with a custom domain.",
    replace:
      "- **You are a tiny Apple-only shop:** iCloud+ with a custom domain.\n- **You want chat, docs, and project tracking in one app, across languages:** Lark.",
  },
  {
    label: "sources footer",
    find: "*Sources: [1]-[4] Vendor pricing and product pages, verified 2026.*",
    replace:
      "*Sources: [1]-[4] Vendor pricing and product pages, verified 2026. [5] Lark pricing and product information supplied by Lark, September 2026.*",
  },
];

function applyEdits(input: string, edits: Edit[]): string {
  let out = input;
  for (const e of edits) {
    if (!out.includes(e.find)) {
      throw new Error(`Anchor not found (${e.label}) — article drifted; aborting without writing.`);
    }
    // Function replacer so prices like "$6" and "$12" stay literal.
    // String replacers treat $n as a capture group.
    out = out.replace(e.find, () => e.replace);
  }
  return out;
}

function assertLarkCopy(content: string): void {
  const start = content.indexOf(LARK_HEADING);
  const end = content.indexOf("## Comparison at a glance");
  if (start < 0 || end < start) {
    throw new Error("Lark section missing after edits; aborting without writing.");
  }
  if (content.indexOf(LARK_HEADING, start + 1) !== -1) {
    throw new Error("Lark heading appears more than once; aborting without writing.");
  }
  const section = content.slice(start, end);
  if (section.includes("lark.svg") || section.includes("<img")) {
    throw new Error("Lark section must not embed a logo; aborting without writing.");
  }
  if (/\bG2\b|\bCapterra\b/i.test(section)) {
    throw new Error("Lark section must not include review-site ratings; aborting without writing.");
  }
  if (!section.includes("According to Lark's own pricing")) {
    throw new Error("Lark pricing must stay attributed to Lark; aborting without writing.");
  }
  if (!section.includes("$6/user/month") || !section.includes("$12/user/month")) {
    throw new Error("Lark prices were altered during replace; aborting without writing.");
  }
}

// "10 ..." -> "11 ..." at the start of title-like fields, only when present.
const bumpCount = (s: string | null) => (s ? s.replace(/^10(\s)/, "11$1") : s);

function bumpCountedField(value: string | null, label: string): string | null {
  if (!value) return value;
  if (!/^10\s/.test(value)) {
    throw new Error(`Anchor not found (${label} count) — article drifted; aborting without writing.`);
  }
  return bumpCount(value);
}

async function main() {
  if (process.env.DRY_RUN_FILE) {
    const fs = await import("fs");
    const raw = fs.readFileSync(process.env.DRY_RUN_FILE, "utf8");
    if (raw.includes(LARK_HEADING)) {
      console.error("Lark section already present — nothing to do.");
      return;
    }
    const patched = applyEdits(raw, CONTENT_EDITS);
    assertLarkCopy(patched);
    process.stdout.write(patched);
    return;
  }

  // prisma/schema.prisma requires DIRECT_URL. The publish workflow only injects
  // DATABASE_URL, so derive the non-pooler host the same way other publishers do.
  if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
    process.env.DIRECT_URL = process.env.DATABASE_URL.replace(
      /-pooler(\.[^/]+\.aws\.neon\.tech)/,
      "$1"
    );
  }

  const prisma = new PrismaClient();
  try {
    const article = await prisma.blogArticle.findUnique({ where: { slug: SLUG } });
    if (!article) throw new Error(`Blog article ${SLUG} not found`);

    if (article.content.includes(LARK_HEADING)) {
      console.log("Lark section already present — nothing to do.");
      return;
    }

    const content = applyEdits(article.content, CONTENT_EDITS);
    assertLarkCopy(content);

    const excerpt = article.excerpt
      ? article.excerpt
          .replace("Here are 10 real alternatives", () => "Here are 11 real alternatives")
          .replace("Microsoft 365, Zoho, Proton, and more", () => "Microsoft 365, Zoho, Proton, Lark, and more")
      : article.excerpt;
    if (article.excerpt) {
      if (!article.excerpt.includes("Here are 10 real alternatives")) {
        throw new Error("Anchor not found (excerpt count) — article drifted; aborting without writing.");
      }
      if (!article.excerpt.includes("Microsoft 365, Zoho, Proton, and more")) {
        throw new Error("Anchor not found (excerpt product list) — article drifted; aborting without writing.");
      }
      if (!excerpt!.includes("Here are 11 real alternatives") || !excerpt!.includes("Proton, Lark, and more")) {
        throw new Error("Excerpt was not updated; aborting without writing.");
      }
    }

    const metaDescription = article.metaDescription
      ? bumpCountedField(article.metaDescription, "meta description")!.replace(
          "Microsoft 365, Zoho, Proton &",
          () => "Microsoft 365, Zoho, Proton, Lark &"
        )
      : article.metaDescription;
    if (article.metaDescription && !article.metaDescription.includes("Microsoft 365, Zoho, Proton &")) {
      throw new Error("Anchor not found (meta description product list) — article drifted; aborting without writing.");
    }

    const updated = await prisma.blogArticle.update({
      where: { slug: SLUG },
      data: {
        title: bumpCountedField(article.title, "title")!,
        metaTitle: bumpCountedField(article.metaTitle, "meta title"),
        metaDescription,
        excerpt,
        content,
      },
    });

    console.log(`Updated ${updated.slug}`);
    console.log(`  title:       ${updated.title}`);
    console.log(`  metaTitle:   ${updated.metaTitle}`);
    console.log(`  content has Lark section: ${updated.content.includes(LARK_HEADING)}`);
    console.log(`  content embeds a logo: ${updated.content.includes("lark.svg")}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

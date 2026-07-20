import { resolveCanonicalComparisonSlugs } from "@/lib/services/comparison-service";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";

const PAGES: Record<string, string[]> = {
  grammarly: ["grammarly-vs-prowritingaid","grammarly-vs-quillbot","grammarly-vs-languagetool","grammarly-vs-hemingway","quillbot-vs-wordtune"],
  "google-workspace": ["google-workspace-vs-microsoft-365","google-workspace-vs-zoho"],
  monday: ["monday-vs-asana","monday-vs-clickup","monday-vs-trello","monday-vs-notion"],
  notion: ["notion-vs-obsidian","notion-vs-coda","notion-vs-confluence","notion-vs-clickup","obsidian-vs-logseq"],
  figma: ["figma-vs-sketch","figma-vs-adobe-xd","figma-vs-sketch-vs-adobe-xd","figma-vs-framer","figma-vs-canva"],
  salesforce: ["salesforce-vs-hubspot","salesforce-vs-pipedrive","salesforce-vs-zoho-crm","salesforce-vs-microsoft-dynamics"],
};

async function main() {
  for (const [page, raw] of Object.entries(PAGES)) {
    const slugs = raw.map((s) => getConsolidatedCompareSlug(s) ?? s);
    const live = await resolveCanonicalComparisonSlugs(slugs);
    const ok = slugs.filter((s) => live.has(s));
    console.log(`${page}: ${ok.length}/${slugs.length} live -> section ${ok.length ? "RENDERS" : "HIDDEN"}`);
    slugs.forEach((s, i) => console.log(`   ${live.has(s) ? "live" : "DEAD"}  ${raw[i]}${s !== raw[i] ? ` -> ${s}` : ""}`));
  }
}
main().then(() => process.exit(0));

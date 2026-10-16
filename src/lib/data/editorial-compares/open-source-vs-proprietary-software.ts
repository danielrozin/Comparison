import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Open Source Software vs Proprietary Software.
 * Open Source Initiative: Open Source Definition; GNU Project: What is Free Software?
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Open source software uses a license that meets the Open Source Initiative's 10-point Open Source Definition: it must include source code, allow modifications and derived works, allow free redistribution without royalties, and not discriminate against people or fields of use. Proprietary software, which the GNU Project also calls nonfree, withholds one or more of those freedoms, usually keeping source code private and limiting copying or changes. Open source can still be sold or used commercially. Choose by control, support and total cost.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Open source licenses must meet the 10 criteria of the Open Source Definition.
- Source code must be included or available, and modifications must be allowed.
- Redistribution cannot require a royalty or fee.
- Proprietary licenses restrict use, study, modification or redistribution.
- Open source and free software can be commercial.

What makes software open source

The Open Source Definition sets 10 criteria, including free redistribution, source code, derived works, integrity of the author's source code, no discrimination against persons, groups or fields of endeavour, and technology-neutral licenses. The GNU Project defines free software by four essential freedoms: to run, study and change, redistribute, and distribute modified copies.

Proprietary software

A program that does not give users these freedoms is called nonfree or proprietary. The vendor typically keeps the source code private and sets the terms for installing, copying and modifying it.

Practical trade-offs

1. Open source: inspect and modify the code, self-host, switch vendors; support comes from the community or paid providers.
2. Proprietary: one accountable vendor, bundled support and hosting; less control over the code.
3. Licenses vary: some open source licenses require sharing changes under the same terms.

Who should pick which

Pick open source when you need control, auditability or self-hosting. Pick proprietary when a vendor-backed product with support fits better. MySQL vs PostgreSQL compares two open source databases.`;

const BUILT = buildEditorialComparison({
  slug: "open-source-vs-proprietary-software",
  title: "Open Source vs Proprietary Software Explained",
  shortAnswer: SHORT_ANSWER,
  verdict: "Open source: license meets the 10-point Open Source Definition; source available, changes and redistribution allowed.\n\nProprietary: license restricts one or more of those freedoms.\n\nRead each license before you build on it.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "open-source", "slug": "open-source", "name": "Open Source Software", "shortDesc": "Software whose license meets the Open Source Definition: source code, modification and redistribution allowed.", "imageUrl": null, "entityType": "concept", "position": 0, "pros": ["Source code included or freely available", "Modifications and derived works allowed", "No royalty for redistribution"], "cons": ["Support may come from the community or paid vendors", "Some licenses require sharing changes under the same terms"], "bestFor": "Teams that want to inspect, modify or self-host"},
    {"id": "proprietary", "slug": "proprietary", "name": "Proprietary Software", "shortDesc": "Software whose license withholds one or more of these freedoms.", "imageUrl": null, "entityType": "concept", "position": 1, "pros": ["Single vendor responsible for the product", "Often bundled with support and hosting", "Clear commercial terms"], "cons": ["Source code usually not available", "Use, modification or redistribution restricted by the license"], "bestFor": "Organisations that want a vendor-backed product"},
  ],
  keyDifferences: [{"label": "Source code", "entityAValue": "Included or freely available", "entityBValue": "Usually private", "winner": "tie"}, {"label": "Modification", "entityAValue": "Allowed", "entityBValue": "Restricted", "winner": "tie"}, {"label": "Redistribution", "entityAValue": "Allowed without royalty", "entityBValue": "Restricted by license", "winner": "tie"}, {"label": "Commercial use", "entityAValue": "Allowed", "entityBValue": "Set by vendor", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Defined by", "Licensing", "open-source", "proprietary", "Open Source Definition (10 criteria)", "Any license that withholds these freedoms"),
    textAttr("a1", "Field-of-use restrictions", "Licensing", "open-source", "proprietary", "Not allowed", "Common"),
    textAttr("a2", "Support", "Licensing", "open-source", "proprietary", "Community or paid vendors", "Vendor"),
    textAttr("a3", "Self-hosting", "Licensing", "open-source", "proprietary", "Possible", "Depends on vendor"),
    textAttr("a4", "Also called", "Licensing", "open-source", "proprietary", "Free software (most programs)", "Nonfree software"),
  ],
  faqs: [{"question": "What is the difference between open source and proprietary software?", "answer": "Open source licenses allow anyone to get the source code, modify it and redistribute it. Proprietary licenses restrict one or more of those rights, and the source code is usually private."}, {"question": "Is open source software free of charge?", "answer": "Often, but not always. The Open Source Definition bars royalties on redistribution, and open source software can still be sold or offered with paid support."}, {"question": "Can open source software be used commercially?", "answer": "Yes. Licenses meeting the Open Source Definition cannot restrict fields of use, including business."}, {"question": "What is the Open Source Definition?", "answer": "A set of 10 criteria from the Open Source Initiative, covering free redistribution, source code, derived works, integrity of source, non-discrimination and technology-neutral licensing."}, {"question": "Is free software the same as open source?", "answer": "They are defined differently. The GNU Project defines free software by four essential freedoms; nearly all open source programs also qualify as free software."}, {"question": "Is proprietary software less secure?", "answer": "Not by definition. Open source code can be audited by anyone; proprietary security depends on the vendor. Evaluate each product's update and disclosure practices."}],
  relatedComparisons: [{"slug": "mysql-vs-postgresql", "title": "MySQL vs PostgreSQL", "category": "software"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Open source for control, auditability and self-hosting; proprietary for a single vendor-backed product.", keyFact: "The Open Source Definition has 10 criteria, including source code access and royalty-free redistribution." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Open Source Initiative: The Open Source Definition", "url": "https://opensource.org/osd"}, {"name": "GNU Project: What is Free Software?", "url": "https://www.gnu.org/philosophy/free-sw.en.html"}]},
  resources: [{"type": "external", "label": "Open Source Initiative: The Open Source Definition", "url": "https://opensource.org/osd", "description": "10 criteria: free redistribution, source code, derived works, technology-neutral licensing and more."}, {"type": "external", "label": "GNU Project: What is Free Software?", "url": "https://www.gnu.org/philosophy/free-sw.en.html", "description": "Four essential freedoms; nonfree or proprietary programs; free software can be commercial."}],
  metaTitle: "Open Source Software vs Proprietary Software | A Versus B",
});

BUILT.metadata.metaDescription = "Open source vs proprietary software: the 10-point Open Source Definition, the four freedoms, licensing, commercial use, support and control.";

export const OPEN_SOURCE_VS_PROPRIETARY_SOFTWARE: EditorialComparison = BUILT;

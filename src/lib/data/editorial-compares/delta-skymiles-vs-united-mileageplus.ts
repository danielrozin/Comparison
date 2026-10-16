import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Delta SkyMiles vs United MileagePlus.
 * Delta SkyMiles overview and Medallion qualification; United MileagePlus overview and Premier qualification.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Both programs have miles that don't expire and four elite tiers. Delta SkyMiles awards Medallion status on spending alone: $5,000, $10,000, $15,000 or $28,000 Medallion Qualification Dollars (MQDs) for Silver, Gold, Platinum or Diamond. United MileagePlus Premier needs Premier qualifying points (PQP) with flights (PQF) or more PQP alone, for example 5,000 PQP plus 15 flights or 6,000 PQP for Silver, up to 28,000 PQP for 1K, plus at least 4 United flights; PQF ends on January 1, 2027. Choose the airline that serves your home airport.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Delta Medallion thresholds for 2027 status: Silver $5,000, Gold $10,000, Platinum $15,000, Diamond $28,000 MQDs.
- United Premier thresholds: Silver 15 PQF + 5,000 PQP or 6,000 PQP; Gold 30 + 10,000 or 12,000; Platinum 45 + 15,000 or 18,000; 1K 60 + 22,000 or 28,000.
- Both earn one status unit per dollar of base fare and carrier-imposed surcharges on their own flights.
- United requires at least 4 United or United Express flights a year; from January 1, 2027, PQF will be removed.
- Miles don't expire in either program.

Earning status

Delta counts only MQDs. You earn $1 MQD per $1 of ticket price on Delta-marketed flights, MQDs on Delta Vacations, and a $2,500 MQD Headstart each year on the Delta SkyMiles Platinum, Platinum Business, Reserve and Reserve Business American Express Cards, plus MQDs on card spend. United counts PQP, earned at 1 per dollar on United flights and on partner flights by award miles, and PQF, one per flight. Eligible United Chase cards earn PQP on purchases up to a yearly cap.

Fares that don't count

Delta Main Basic tickets earn no miles or MQDs. United Basic Economy tickets earn PQP but not PQF.

Status length and lifetime status

1. Delta 2027 status is earned on 2026 activity and lasts until January 31, 2028.
2. United status reached in 2026 lasts until January 31, 2028.
3. United offers lifetime Gold after 1 million miles, Platinum after 2 million and 1K after 3 million.

Who should pick which

Pick the program of the airline with the most flights from your home airport. Delta Vacations and Amex cards help in SkyMiles; Star Alliance flights and Chase cards help in MileagePlus. Delta vs United compares the airlines.`;

const BUILT = buildEditorialComparison({
  slug: "delta-skymiles-vs-united-mileageplus",
  title: "Delta SkyMiles vs United MileagePlus: Status Rules",
  shortAnswer: SHORT_ANSWER,
  verdict: "Delta SkyMiles: status on spend alone, $5,000 to $28,000 MQDs.\n\nUnited MileagePlus: PQP with flights, or PQP alone, plus 4 United flights; PQF ends January 1, 2027.\n\nMiles don't expire in either.",
  category: "travel",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "delta-skymiles", "slug": "delta-skymiles", "name": "Delta SkyMiles", "shortDesc": "Delta Air Lines' loyalty program, with Medallion status earned through MQDs.", "imageUrl": null, "entityType": "brand", "position": 0, "pros": ["Miles don't expire", "Status earned on spend alone: MQDs", "Card members get a $2,500 MQD Headstart on eligible Amex cards"], "cons": ["Delta Main Basic tickets earn no miles or MQDs", "Diamond needs $28,000 MQDs"], "bestFor": "Travelers based at Delta hubs who spend on Delta flights"},
    {"id": "united-mileageplus", "slug": "united-mileageplus", "name": "United MileagePlus", "shortDesc": "United Airlines' loyalty program, with Premier status earned through PQP and PQF.", "imageUrl": null, "entityType": "brand", "position": 1, "pros": ["Miles never expire", "Earn on Star Alliance and other partners", "Lifetime status after 1, 2 or 3 million miles"], "cons": ["At least 4 United or United Express flights a year needed for status", "Basic Economy earns PQP but not PQF"], "bestFor": "Travelers based at United hubs or flying Star Alliance"},
  ],
  keyDifferences: [{"label": "Status currency", "entityAValue": "MQDs (dollars)", "entityBValue": "PQP plus PQF, or PQP only", "winner": "tie"}, {"label": "Top tier", "entityAValue": "Diamond: $28,000 MQDs", "entityBValue": "1K: 60 PQF + 22,000 PQP or 28,000 PQP", "winner": "tie"}, {"label": "Entry tier", "entityAValue": "Silver: $5,000 MQDs", "entityBValue": "Silver: 15 PQF + 5,000 PQP or 6,000 PQP", "winner": "tie"}, {"label": "Mileage expiry", "entityAValue": "Miles don't expire", "entityBValue": "Miles never expire", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Tiers", "Airline loyalty", "delta-skymiles", "united-mileageplus", "Silver, Gold, Platinum, Diamond", "Premier Silver, Gold, Platinum, 1K"),
    textAttr("a1", "Thresholds", "Airline loyalty", "delta-skymiles", "united-mileageplus", "$5,000 / $10,000 / $15,000 / $28,000 MQDs", "6,000 / 12,000 / 18,000 / 28,000 PQP (PQP only)"),
    textAttr("a2", "Earning on own flights", "Airline loyalty", "delta-skymiles", "united-mileageplus", "$1 MQD per $1 of ticket price", "1 PQP per $1 of base fare and surcharges"),
    textAttr("a3", "Basic fares", "Airline loyalty", "delta-skymiles", "united-mileageplus", "Delta Main Basic earns no miles or MQDs", "Basic Economy earns PQP, not PQF"),
    textAttr("a4", "Card boost", "Airline loyalty", "delta-skymiles", "united-mileageplus", "$2,500 MQD Headstart on eligible Amex cards", "PQP on eligible United Chase card spend, capped"),
    textAttr("a5", "Lifetime status", "Airline loyalty", "delta-skymiles", "united-mileageplus", "Million Miler program", "Gold at 1M, Platinum at 2M, 1K at 3M miles"),
  ],
  faqs: [{"question": "How do I earn Delta Medallion status?", "answer": "Earn Medallion Qualification Dollars (MQDs): $5,000 for Silver, $10,000 for Gold, $15,000 for Platinum and $28,000 for Diamond in a calendar year. MQDs come from Delta flights, Delta Vacations and eligible Delta SkyMiles American Express Cards."}, {"question": "How do I earn United Premier status?", "answer": "Earn Premier qualifying points (PQP) with Premier qualifying flights (PQF), or a higher number of PQP alone, and take at least 4 United or United Express flights. Silver needs 15 PQF and 5,000 PQP, or 6,000 PQP."}, {"question": "Do SkyMiles or MileagePlus miles expire?", "answer": "No. Miles don't expire in either program."}, {"question": "What is changing at United in 2027?", "answer": "Starting January 1, 2027, United will remove Premier qualifying flights (PQF), and PQP will become the primary way to earn Premier status."}, {"question": "Do basic economy tickets count?", "answer": "Delta Main Basic tickets earn no miles or MQDs. United Basic Economy tickets earn PQP but not PQF."}, {"question": "Can a credit card help me earn status?", "answer": "Yes. Eligible Delta SkyMiles Amex cards give a $2,500 MQD Headstart each year and MQDs on spend. Eligible United Chase cards earn PQP on purchases up to a yearly cap."}],
  relatedComparisons: [{"slug": "delta-vs-united", "title": "Delta vs United", "category": "travel"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Delta SkyMiles for status earned on spend alone; United MileagePlus for Star Alliance reach and lifetime status by miles flown.", keyFact: "Delta Diamond needs $28,000 MQDs; United 1K needs 28,000 PQP alone or 60 PQF plus 22,000 PQP." },
  citationStats: {"sourceCount": 4, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Delta: How to qualify for Medallion Status", "url": "https://www.delta.com/us/en/skymiles/medallion-program/how-to-qualify"}, {"name": "Delta: SkyMiles overview", "url": "https://www.delta.com/us/en/skymiles/overview"}, {"name": "United: How to earn Premier status", "url": "https://www.united.com/en/us/fly/mileageplus/premier/qualify.html"}, {"name": "United: MileagePlus", "url": "https://www.united.com/en/us/fly/mileageplus.html"}]},
  resources: [{"type": "external", "label": "Delta: How to qualify for Medallion Status", "url": "https://www.delta.com/us/en/skymiles/medallion-program/how-to-qualify", "description": "MQD thresholds $5,000/$10,000/$15,000/$28,000; $1 MQD per $1; $2,500 MQD Headstart; Basic not eligible."}, {"type": "external", "label": "Delta: SkyMiles overview", "url": "https://www.delta.com/us/en/skymiles/overview", "description": "Miles don't expire; 20+ partner airlines; Delta Main Basic earns no miles."}, {"type": "external", "label": "United: How to earn Premier status", "url": "https://www.united.com/en/us/fly/mileageplus/premier/qualify.html", "description": "PQF/PQP thresholds; 4 United flights minimum; PQF removed from January 1, 2027; lifetime status by miles."}, {"type": "external", "label": "United: MileagePlus", "url": "https://www.united.com/en/us/fly/mileageplus.html", "description": "Miles never expire; use miles on United and partner airlines."}],
  metaTitle: "Delta SkyMiles vs United MileagePlus | A Versus B",
});

BUILT.metadata.metaDescription = "Delta SkyMiles vs United MileagePlus: Medallion MQD thresholds vs Premier PQP and PQF rules, the 2027 United change, basic fares, cards and miles expiry.";

export const DELTA_SKYMILES_VS_UNITED_MILEAGEPLUS: EditorialComparison = BUILT;

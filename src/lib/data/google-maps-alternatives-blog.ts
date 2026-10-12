/**
 * ROO-183 — Google Maps alternatives that don't use Google.
 * Facts read on 12 October 2026 from each app's own site or App Store
 * listing: organicmaps.app, comaps.app, osmand.net (+ purchases docs),
 * magicearth.com + Magic Earth App Store listing, HERE WeGo App Store
 * listing, and Google's 2013 Waze acquisition post. No ratings, no
 * accuracy claims, no prices beyond what each publisher states.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG = "google-maps-alternatives-without-google";

const UPDATED_AT = "2026-10-12T00:00:00Z";

const CONTENT = `*Analysis. Drafted with AI from web research. Updated October 12, 2026.*

Organic Maps, CoMaps, and OsmAnd are the closest Google-free replacements if you want offline maps and turn-by-turn navigation without a Google account. Magic Earth and HERE WeGo add live traffic or wider public transport, and Apple Maps is the built-in option on iPhone. Waze is not a way out of Google: Google closed its acquisition of Waze in 2013.

**Key takeaways**

- Free, open source, and offline: Organic Maps and CoMaps (CoMaps is a fork of Organic Maps). Both are built on OpenStreetMap.
- Most configurable offline app: OsmAnd. Most features are free, with paid Maps+ and OsmAnd Pro plans.
- Traffic and privacy: Magic Earth is freemium. Premium unlocks traffic-aware navigation and offline maps.
- Public transport: HERE WeGo lists public transport in more than 1,900 cities. The OpenStreetMap apps are weakest here.
- Waze is owned by Google.

## Which Google Maps alternative works offline?

All five work offline in some form. Organic Maps says it supports 100% of its features without an internet connection. CoMaps offers offline search and routing with just GPS. OsmAnd carries fully offline maps of any region and navigates offline. HERE WeGo lets you download a region, country, or continent and finish a trip offline. On Magic Earth, offline maps are part of the Premium subscription.

| App | Map data | Offline | Price model | Platforms |
| --- | --- | --- | --- | --- |
| Organic Maps | OpenStreetMap | All features | Free, no ads | iOS, Android (Google Play, F-Droid, AppGallery) |
| CoMaps | OpenStreetMap | Search and routing | Free | iOS, Android (Google Play, F-Droid, AppGallery) |
| OsmAnd | OpenStreetMap | Maps and navigation | Mostly free; Maps+ and OsmAnd Pro paid | iOS, Android |
| Magic Earth | OpenStreetMap | Premium feature | Freemium; Premium subscription | iOS, Android, CarPlay, Apple Watch |
| HERE WeGo | HERE | Downloadable regions | Free | iOS (App Store), CarPlay |

*Table: Google-free map apps by data source, offline support, price model, and platforms, October 12, 2026.*

## Which alternative is best for privacy?

Organic Maps says it has no ads, no tracking, and no data collection, and needs no registration. CoMaps says it does not identify people, does not track you, and does not collect any information. Magic Earth says it does not collect personal data, track movements, or sell information. All three use OpenStreetMap data instead of Google's.

## Which alternative has public transport directions?

HERE WeGo is the strongest choice for transit, with public transport in more than 1,900 cities. Magic Earth lists public transport info across hundreds of regions. The OpenStreetMap-only apps are weaker: Organic Maps has metro and subway maps, CoMaps has a public transport layer for subway and light rail in a growing list of cities, and OsmAnd can display bus, tram, and train stops with line names. None of the three lists intercity bus routing, so plan long bus trips with the operator's own app or timetable.

## Which alternative is best for hiking and cycling?

Organic Maps lists cycling routes, hiking trails, contour lines, elevation profiles, and walking, cycling, and car navigation with voice guidance. CoMaps has an outdoor mode that highlights hiking trails, campsites, and water sources, plus contour lines. OsmAnd includes foot, hiking, and bike paths, trip recording to GPX, and contour lines and hill-shading through a plugin.

## Does Apple Maps or Waze count as "not Google"?

Apple Maps is Apple's own service, built into iPhone, iPad, and Mac, so it is a Google-free option for Apple users. Waze is not: Google announced in June 2013 that it had closed the acquisition of Waze.

## Compare the big three

- [Google Maps vs Apple Maps](/compare/google-maps-vs-apple-maps)
- [Google Maps vs Waze](/compare/google-maps-vs-waze)
- [Best navigation apps 2026: Google Maps, Waze, and Apple Maps compared](/blog/best-navigation-apps-2026-google-maps-waze-and-apple-maps-compared)
- [All Google Maps alternatives](/alternatives/google-maps)

## Sources

- [Organic Maps](https://organicmaps.app/)
- [CoMaps](https://www.comaps.app/)
- [OsmAnd](https://osmand.net/) and [OsmAnd purchases](https://osmand.net/docs/user/purchases/)
- [Magic Earth](https://www.magicearth.com/) and [Magic Earth on the App Store](https://apps.apple.com/us/app/magic-earth-navigation-maps/id1007331679)
- [HERE WeGo on the App Store](https://apps.apple.com/us/app/here-wego-maps-navigation/id955837609)
- [Google: Google Maps and Waze, outsmarting traffic together](https://blog.google/products-and-platforms/products/maps/google-maps-and-waze-outsmarting/)
`;

export const GOOGLE_MAPS_ALTERNATIVES_ARTICLE: BlogArticle = {
  id: "blog-google-maps-alternatives-without-google",
  slug: GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG,
  title: "Google Maps alternatives that don't use Google",
  excerpt:
    "Organic Maps, CoMaps, OsmAnd, Magic Earth, and HERE WeGo compared on offline maps, privacy, public transport, and price model. Waze is owned by Google.",
  content: CONTENT,
  category: "technology",
  tags: ["maps", "navigation", "privacy", "google-maps-alternatives"],
  metaTitle: "Google Maps Alternatives Without Google (2026)",
  metaDescription:
    "Organic Maps, CoMaps, OsmAnd, Magic Earth, and HERE WeGo compared on offline maps, privacy, transit, and price. Waze is owned by Google.",
  relatedComparisonSlugs: ["google-maps-vs-apple-maps", "google-maps-vs-waze"],
  status: "published",
  publishedAt: UPDATED_AT,
  createdAt: UPDATED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};

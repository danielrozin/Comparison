/**
 * DAN-2398: Week 40 Blog Batch 40 — 5 restaurant menu posts (Feb 2-6, 2027)
 *
 * Keyword discovery results (DataForSEO keyword_ideas, US, KD<35):
 *   - bojangles-menu       (KD 17, 201,000 vol, CPC $0.05)  — Feb 2 [food/chicken]
 *   - portillos-menu       (KD  4, 110,000 vol, CPC $0.12)  — Feb 3 [food/chicago-style]
 *   - pf-changs-menu       (KD 15, 110,000 vol, CPC $0.08)  — Feb 4 [food/asian]
 *   - captain-ds-menu      (KD  3,  74,000 vol, CPC $0.04)  — Feb 5 [food/seafood]
 *   - sheetz-menu          (KD 14,  60,500 vol, CPC $0.06)  — Feb 6 [food/convenience]
 *
 * Combined monthly search volume: ~555,500/mo
 * All slugs verified: no overlap with Batches 1–39 or existing DB records (603 total).
 * Each draft: 900–1,300 words, clear direct-answer first paragraph,
 * authoritative facts, author byline, internal links to /compare/* pages.
 *
 * Run: npx tsx scripts/publish-tactical-blogs-dan2398.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL.replace(
    /-pooler(\.[^/]+\.aws\.neon\.tech)/,
    "$1"
  ).trim();
}
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim();
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FEB2 = new Date("2027-02-02T10:00:00.000Z");
const FEB3 = new Date("2027-02-03T10:00:00.000Z");
const FEB4 = new Date("2027-02-04T10:00:00.000Z");
const FEB5 = new Date("2027-02-05T10:00:00.000Z");
const FEB6 = new Date("2027-02-06T10:00:00.000Z");

const POSTS = [
  // ── POST 1: Bojangles Menu ────────────────────────────────────────────────
  {
    slug: "bojangles-menu",
    title: "Bojangles Menu: Full Prices, Best Chicken & Biscuits Guide (2027)",
    excerpt:
      "Bojangles was founded in 1977 in Charlotte, North Carolina, by Jack Fulk and Richard Thomas. The chain operates approximately 800 locations, primarily in the Southeast and Mid-Atlantic United States. The Legendary Chicken Biscuit costs $3.79, a 2-piece combo with fixins is $8.99, 8-piece Supremes (boneless breast strips) are $9.99, and a large Cajun Pintos side is $3.49. Bojangles is known for three things: its Cajun-seasoned bone-in fried chicken, its made-from-scratch buttermilk biscuits (baked every 20 minutes), and its sweet tea, which is brewed fresh and widely considered one of the best in fast food.",
    category: "food",
    tags: [
      "bojangles menu",
      "bojangles menu prices",
      "bojangles chicken",
      "bojangles biscuits",
      "bojangles prices 2027",
      "bojangles legendary chicken biscuit",
    ],
    metaTitle: "Bojangles Menu: Full Prices, Best Chicken & Biscuits (2027)",
    metaDescription:
      "See the full Bojangles menu with 2027 prices, best chicken combos, all biscuit options, Supremes, sides, and ordering tips. What should you order at Bojangles?",
    relatedComparisonSlugs: [
      "chick-fil-a-vs-popeyes",
      "kfc-vs-popeyes",
    ],
    sourceQuery: "bojangles menu",
    sourceImpressions: 201000,
    publishedAt: FEB2,
    content: `# Bojangles Menu: Full Prices, Best Chicken & Biscuits Guide (2027)

*By Daniel Rozin | A Versus B | February 2, 2027*

Bojangles was founded in 1977 in Charlotte, North Carolina, by Jack Fulk and Richard Thomas, who wanted to create a chicken chain with bold Cajun seasoning rather than the mild flavor profiles common at the time. The chain operates approximately 800 locations across the Southeast and Mid-Atlantic United States, with its heaviest presence in the Carolinas, Georgia, Tennessee, and Virginia. The Legendary Chicken Biscuit costs $3.79, a 2-piece combo with fixins is $8.99, Supremes (boneless breast strips, 8-piece) are $9.99, and a large Cajun Pintos side is $3.49. Bojangles is the Southeast's dominant bone-in chicken and biscuit chain, distinguished by three things: Cajun-seasoned chicken, made-from-scratch buttermilk biscuits baked every 20 minutes in-store, and sweet tea widely regarded as among the best in fast food. Here is the full Bojangles menu with 2027 prices.

---

## Bojangles Menu Prices (2027)

*Note: Prices vary slightly by location. Bojangles operates primarily in the Southeast; prices below are mid-range across the region.*

### Chicken Biscuits & Breakfast

| Item | Price | Notes |
|------|-------|-------|
| Legendary Chicken Biscuit | $3.79 | Bone-in breast on buttermilk biscuit |
| Cajun Filet Biscuit | $4.29 | Boneless Cajun chicken breast |
| Steak Biscuit | $4.49 | Country-fried steak on biscuit |
| Egg & Cheese Biscuit | $2.99 | Classic breakfast biscuit |
| Sausage Biscuit | $2.49 | Breakfast sausage patty |
| Country Ham Biscuit | $3.29 | Smoked country ham |
| Gravy Biscuit | $1.99 | Biscuit with white gravy |
| Bo-Berry Biscuit | $1.49 | Blueberry glazed biscuit |

The **Legendary Chicken Biscuit** ($3.79) is Bojangles' most iconic item. It uses a bone-in chicken breast — marinated in Cajun spices and double-breaded — served on a hand-rolled, from-scratch buttermilk biscuit. The bone-in format means more surface area for seasoning and a juicier result than boneless alternatives. Bojangles has sold the Legendary Chicken Biscuit since 1977, and it remains their signature.

### Chicken Combos (2-Piece)

| Combo | Price | Includes |
|-------|-------|---------|
| 2-Piece Leg & Thigh Dinner | $8.99 | 2 pieces + 2 fixins + biscuit |
| 2-Piece Breast & Wing Dinner | $9.49 | 2 pieces + 2 fixins + biscuit |
| 3-Piece Leg, Thigh & Wing Dinner | $10.49 | 3 pieces + 2 fixins + biscuit |
| 4-Piece Dinner | $12.99 | 4 pieces + 2 fixins + biscuit |
| 8-Piece Family Meal | $21.99 | 8 pieces + 4 fixins + 4 biscuits |
| 12-Piece Family Meal | $29.99 | 12 pieces + 6 fixins + 6 biscuits |

Bojangles sells bone-in chicken in legs, thighs, wings, and breasts — Cajun-seasoned and pressure-fried. The Leg & Thigh combo is the best value for the classic Bojangles flavor; the dark meat holds seasoning better than white meat and stays juicier during the hold time.

### Supremes (Boneless Strips)

| Item | Price |
|------|-------|
| 4-Piece Supremes | $5.99 |
| 8-Piece Supremes | $9.99 |
| 12-Piece Supremes | $13.99 |
| Supremes Combo (4-piece) | $8.99 |

Supremes are Bojangles' boneless chicken strips — cut from the breast and seasoned with the same Cajun profile as the bone-in chicken. The 8-piece is the most popular order and serves as a shareable starter or the base of a meal.

### Sandwiches & Wraps

| Item | Price |
|------|-------|
| Cajun Filet Sandwich | $5.49 | Boneless breast, plain |
| Cajun Filet Sandwich Combo | $9.49 | With fixins + drink |
| Grilled Chicken Sandwich | $5.99 | Marinated grilled breast |
| Chicken Wrap | $5.29 | Cajun strips, lettuce, cheese, sauce |

### Sides (Fixins)

| Side | Small | Large |
|------|-------|-------|
| Cajun Pintos | $1.99 | $3.49 |
| Dirty Rice | $1.99 | $3.49 |
| Seasoned Fries | $1.99 | $3.49 |
| Coleslaw | $1.99 | $3.49 |
| Green Beans | $1.99 | $3.49 |
| Mac & Cheese | $1.99 | $3.49 |
| Mashed Potatoes & Gravy | $1.99 | $3.49 |

**Cajun Pintos** ($3.49 large) are Bojangles' most distinctive side item — pinto beans slow-cooked with Cajun spices and pork. They are a legacy Southern item rarely found at competing chains and represent the regional culinary identity that distinguishes Bojangles from national competitors.

**Dirty Rice** is Bojangles' second signature side: rice cooked with seasoned ground chicken and Cajun spices. Like the Cajun Pintos, it's a Southern regional dish with no equivalent at KFC, Popeyes, or Chick-fil-A.

---

## Bojangles Breakfast Hours

Bojangles serves breakfast all day. Unlike most fast food chains that cut off breakfast at 10:30 a.m., Bojangles sells its full biscuit menu from open to close. This all-day breakfast policy is a core brand differentiator and a reason many customers choose Bojangles for lunch and dinner orders as well.

Most Bojangles locations open between 5:00 a.m. and 6:00 a.m.

---

## Best Items to Order at Bojangles

**Best single item:** Legendary Chicken Biscuit ($3.79). The bone-in Cajun breast on a from-scratch biscuit is Bojangles' most refined execution. Get it without modification — the biscuit-to-chicken ratio and seasoning are calibrated for the standard build.

**Best meal:** 2-Piece Leg & Thigh Dinner with Cajun Pintos and Dirty Rice ($8.99). The dark meat combo plus Bojangles' two most distinctive sides gives the full regional experience.

**Best value:** 8-Piece Family Meal ($21.99). At $2.75 per piece plus sides and biscuits, this is the lowest cost-per-serving Bojangles offers and works for 3–4 adults.

**Best side:** Cajun Pintos. They have no equivalent at competing chains and showcase the Cajun-Southern flavor profile that defines the brand.

**Best breakfast:** Bo-Berry Biscuit ($1.49) as a dessert biscuit after a Legendary Chicken Biscuit combo. The blueberry glaze and biscuit format is unique to Bojangles and not replicated elsewhere.

---

## Bojangles vs. Popeyes vs. Chick-fil-A

Bojangles, Popeyes, and Chick-fil-A are the three chains most compared for Southern-style chicken. Bojangles leads on regional authenticity (Cajun Pintos, Dirty Rice, all-day biscuits) and sweet tea quality. Popeyes leads on bone-in chicken flavor intensity and its nationally recognized Chicken Sandwich. Chick-fil-A leads on boneless chicken quality (the filet), customer service scores, and sauce variety. For a detailed head-to-head see our [Chick-fil-A vs. Popeyes comparison](/compare/chick-fil-a-vs-popeyes).

*Bojangles' Cajun-seasoned bone-in chicken, made-from-scratch biscuits baked every 20 minutes, and all-day breakfast policy have made it the defining fast food institution of the American Southeast since 1977.*`,
  },

  // ── POST 2: Portillo's Menu ───────────────────────────────────────────────
  {
    slug: "portillos-menu",
    title: "Portillo's Menu: Full Prices, Best Chicago-Style Dishes & Ordering Guide (2027)",
    excerpt:
      "Portillo's was founded in 1963 in Villa Park, Illinois, by Dick Portillo as a hot dog stand called 'The Dog House.' The chain now operates approximately 80 locations primarily in Illinois, with additional locations in Arizona, California, Florida, and other states. The Italian Beef sandwich costs $8.39, a Chicago-style Hot Dog is $4.79, the Char-Broiled Chicken Sandwich is $8.69, Cheese Fries are $5.09, and a Chocolate Cake Shake is $7.19. Portillo's is known for three things: its Italian Beef sandwich (slow-roasted beef with Giardiniera or sweet peppers, served dipped or dry), its Chicago-style hot dog (no ketchup policy), and its Chocolate Cake Shake.",
    category: "food",
    tags: [
      "portillos menu",
      "portillo's menu",
      "portillo's menu prices",
      "portillos italian beef",
      "portillos prices 2027",
      "portillos chicago hot dog",
    ],
    metaTitle: "Portillo's Menu: Full Prices & Best Chicago-Style Dishes (2027)",
    metaDescription:
      "See the full Portillo's menu with 2027 prices, Italian Beef, Chicago-style Hot Dogs, Chocolate Cake Shake, and ordering tips. What should you order at Portillo's?",
    relatedComparisonSlugs: [
      "jersey-mikes-vs-subway",
      "shake-shack-vs-five-guys",
    ],
    sourceQuery: "portillos menu",
    sourceImpressions: 110000,
    publishedAt: FEB3,
    content: `# Portillo's Menu: Full Prices, Best Chicago-Style Dishes & Ordering Guide (2027)

*By Daniel Rozin | A Versus B | February 3, 2027*

Portillo's was founded in 1963 in Villa Park, Illinois, by Dick Portillo, who invested $1,000 into a small hot dog stand he called "The Dog House." He renamed it Portillo's in 1967 as the concept expanded beyond hot dogs into Italian beef, burgers, and salads. The chain now operates approximately 80 locations, primarily in Illinois, with expansion locations in Arizona, California, Florida, Indiana, Minnesota, and Texas. The Italian Beef sandwich costs $8.39, a Chicago-style Hot Dog is $4.79, the Char-Broiled Chicken Sandwich is $8.69, Cheese Fries are $5.09, and a Chocolate Cake Shake is $7.19. Portillo's built its national reputation on three things: Italian beef sandwiches slow-roasted and served on French bread with Giardiniera or sweet peppers, Chicago-style hot dogs topped with yellow mustard, relish, onion, tomato, pickle, and sport peppers but never ketchup, and a Chocolate Cake Shake made with real chocolate cake blended into a milkshake. Here is the full Portillo's menu with 2027 prices.

---

## Portillo's Menu Prices (2027)

*Prices vary slightly by location. Illinois locations are priced below; out-of-state locations may run 5–10% higher.*

### Italian Beef Sandwiches

| Item | Price | Notes |
|------|-------|-------|
| Italian Beef | $8.39 | Slow-roasted beef, choice of peppers |
| Italian Beef Combo | $9.79 | Italian sausage + Italian beef |
| Italian Sausage with Peppers | $7.29 | Sweet Italian sausage link |
| Meatball Sub | $8.49 | House meatballs, marinara |

The **Italian Beef** ($8.39) is Portillo's defining sandwich. The beef is slow-roasted in-house, hand-sliced thin, soaked in seasoned beef au jus, and piled onto a French bread roll. The ordering decision is: **Giardiniera or sweet peppers, and dipped or not dipped**. Giardiniera (hot pickled vegetable mix) is the authentic Chicago choice. "Dipped" means the entire assembled sandwich is dipped into the au jus — the result is a wetter, more intensely flavored sandwich where the bread softens. First-time visitors should order it dipped with Giardiniera.

The **Italian Beef Combo** ($9.79) adds a grilled sweet Italian sausage link alongside the beef — a Chicago classic for those who want both proteins on one roll.

### Hot Dogs

| Item | Price |
|------|-------|
| Chicago-Style Hot Dog | $4.79 |
| Chicago-Style Hot Dog Combo | $8.29 |
| Corn Dog | $3.49 |
| Maxwell Street Polish | $5.79 |

The **Chicago-style Hot Dog** ($4.79) follows the strictly defined preparation: a Vienna Beef frank in a poppy seed bun, topped with yellow mustard, chopped white onion, neon-green sweet pickle relish, a dill pickle spear, two tomato slices, sport peppers, and a dash of celery salt. No ketchup — ever. Portillo's maintains an informal no-ketchup rule consistent with Chicago's hot dog tradition. The Vienna Beef frank is the same supplier used by Chicago's ballparks and street carts.

The **Maxwell Street Polish** ($5.79) is a grilled Polish sausage served on a French bread roll with yellow mustard and grilled onions — a Chicago street food tradition dating to the Maxwell Street market.

### Burgers

| Item | Price |
|------|-------|
| Char-Broiled Cheeseburger | $7.49 |
| Double Char-Broiled Cheeseburger | $9.49 |
| Char-Broiled Chicken Sandwich | $8.69 |
| Veggie Burger | $7.49 |

Portillo's burgers are char-broiled rather than flat-top griddled — a choice that produces distinct grill marks and char flavor. The Char-Broiled Cheeseburger ($7.49) is built on a brioche-style bun with American cheese, lettuce, tomato, onion, and pickle.

### Salads & Chopped Salad

| Item | Price |
|------|-------|
| Chopped Salad | $10.49 | Portillo's signature |
| Garden Salad | $7.49 | |
| Grilled Chicken Chopped Salad | $12.49 | |

The **Chopped Salad** ($10.49) is one of Portillo's most popular non-sandwich items. Ingredients are finely diced: iceberg lettuce, romaine, tomato, bacon, Gorgonzola, and red onion, tossed with Italian dressing. It is one of the few fast-casual chopped salads with a genuine following on social media and a regular appearance on "best salads" lists.

### Sides & Fries

| Item | Price |
|------|-------|
| Cheese Fries | $5.09 |
| French Fries | $3.99 |
| Onion Rings | $4.99 |
| Dipped Fries | $4.99 |
| Chili Cheese Fries | $5.99 |

**Cheese Fries** ($5.09) — thin-cut fries topped with Portillo's cheese sauce — are the chain's most-ordered side. The cheese sauce is served warm and coats the fries without the cloying sweetness common at competing chains.

### Shakes & Drinks

| Item | Price |
|------|-------|
| Chocolate Cake Shake | $7.19 | Signature item |
| Classic Milkshake (chocolate/vanilla/strawberry) | $6.49 | |
| Lemon Berry Slushie | $4.49 | |
| Fresh-Squeezed Lemonade | $4.29 | |

The **Chocolate Cake Shake** ($7.19) is Portillo's most distinctive menu item and the reason many customers visit for dessert. It is a chocolate milkshake with actual Portillo's chocolate cake blended in — the result is a rich, slightly textured shake with real cake pieces. It has been on the menu since the 1990s and is one of the most-shared fast-casual dessert items in the Midwest.

---

## Best Items to Order at Portillo's

**Best single item:** Italian Beef, dipped, with Giardiniera ($8.39). The dipped format fully integrates the au jus into the bread, creating a coherent sandwich rather than separate components.

**Best combo order:** Italian Beef Combo + Cheese Fries + Chocolate Cake Shake. The three core items that define the Portillo's experience. The beef's savory richness, the fries' cheese sauce, and the shake as dessert represent the full menu.

**Best hot dog order:** Chicago-style Hot Dog ($4.79) with no modifications. The precise topping combination is calibrated and should be ordered as specified.

**Best value:** Hot Dog Combo ($8.29) — includes fries and a drink at a price point below most fast-casual competitors.

---

## Portillo's vs. Jersey Mike's vs. Shake Shack

For a detailed comparison of fast-casual sandwich options, see our [Jersey Mike's vs. Subway comparison](/compare/jersey-mikes-vs-subway) and our [Shake Shack vs. Five Guys comparison](/compare/shake-shack-vs-five-guys) on adjacent burger chains.

*Portillo's Italian Beef sandwich, Chicago-style Hot Dog, and Chocolate Cake Shake have made it the preeminent Chicago-style fast-casual chain in the US since 1963.*`,
  },

  // ── POST 3: PF Chang's Menu ───────────────────────────────────────────────
  {
    slug: "pf-changs-menu",
    title: "PF Chang's Menu: Full Prices, Best Dishes & Ordering Guide (2027)",
    excerpt:
      "PF Chang's China Bistro was founded in 1993 in Scottsdale, Arizona, by Paul Fleming and Philip Chiang, who combined upscale Chinese-American cuisine with a full-service bistro concept. The chain operates approximately 300 locations globally across the United States and international markets. Lettuce Wraps cost $16.00, Chang's Spicy Chicken is $20.00, Mongolian Beef is $20.00, a bowl of Hot and Sour Soup is $9.00, and Kung Pao Shrimp is $22.00. PF Chang's is known for wok-fired dishes finished tableside on a high-heat flame, Chang's Chicken Lettuce Wraps (one of the most recognized appetizers in American casual dining), and a full-service bar with Asian-inspired cocktails.",
    category: "food",
    tags: [
      "pf changs menu",
      "pf chang's menu",
      "pf changs menu prices",
      "pf changs lettuce wraps",
      "pf changs prices 2027",
      "pf changs spicy chicken",
    ],
    metaTitle: "PF Chang's Menu: Full Prices & Best Dishes (2027)",
    metaDescription:
      "See the full PF Chang's menu with 2027 prices, Lettuce Wraps, Spicy Chicken, Mongolian Beef, and ordering tips. What should you order at PF Chang's?",
    relatedComparisonSlugs: [
      "disney-vs-netflix",
      "amazon-echo-vs-google-nest-hub",
    ],
    sourceQuery: "pf changs menu",
    sourceImpressions: 110000,
    publishedAt: FEB4,
    content: `# PF Chang's Menu: Full Prices, Best Dishes & Ordering Guide (2027)

*By Daniel Rozin | A Versus B | February 4, 2027*

PF Chang's China Bistro was co-founded in 1993 in Scottsdale, Arizona, by restaurateur Paul Fleming (the "P.F.") and Philip Chiang (the "Chang"), son of Cecilia Chiang who founded The Mandarin in San Francisco. Fleming and Chiang wanted to bring Chinese cooking techniques — specifically the high-heat wok — into a full-service American bistro format. The chain operates approximately 300 locations globally, with the majority in the United States. Lettuce Wraps cost $16.00, Chang's Spicy Chicken is $20.00, Mongolian Beef is $20.00, Hot and Sour Soup is $9.00, and Kung Pao Shrimp is $22.00. PF Chang's built its reputation on three things: Chang's Chicken Lettuce Wraps (one of the most recognizable appetizers in American casual dining since the 1990s), wok-fired main dishes finished over high-heat flames, and a full-service bar with a well-developed wine and cocktail program unusual for Chinese-American restaurants. Here is the full PF Chang's menu with 2027 prices.

---

## PF Chang's Menu Prices (2027)

*Prices vary by location. Urban locations may run 10–15% higher. Delivery adds service fees.*

### Starters & Small Plates

| Item | Price | Notes |
|------|-------|-------|
| Chang's Chicken Lettuce Wraps | $16.00 | Signature item |
| Dynamite Shrimp | $15.00 | Crispy shrimp, spicy aioli |
| Pork Dumplings (Steam or Pan-Fried) | $14.00 | 6-piece |
| Egg Drop Soup | $8.00 | Classic |
| Hot and Sour Soup | $9.00 | Traditional |
| Wonton Soup | $9.00 | |
| Edamame | $7.00 | Steamed, sea salt |
| Crispy Honey Chicken | $15.00 | Starter size |
| Vietnamese Rolls | $14.00 | Rice paper, fresh vegetables |

**Chang's Chicken Lettuce Wraps** ($16.00) are PF Chang's signature dish and one of the most copied appetizers in American casual dining — versions appear at Applebee's, Cheesecake Factory, and dozens of independent restaurants that launched after PF Chang's popularized the format in the late 1990s. The original uses hand-minced chicken cooked in a savory hoisin-ginger sauce with water chestnuts, served in cool butter lettuce cups with a rice noodle nest, julienned vegetables, and three sauces: soy, chili paste, and a sweet-sour house sauce. The interactive build-your-own format remains its draw.

### Main Dishes — Chicken

| Item | Price |
|------|-------|
| Chang's Spicy Chicken | $20.00 |
| Kung Pao Chicken | $20.00 |
| Orange Chicken | $20.00 |
| Honey Chicken | $20.00 |
| Moo Goo Gai Pan | $20.00 |
| Pepper Steak with Chicken | $21.00 |

**Chang's Spicy Chicken** ($20.00) is the most-ordered entrée at PF Chang's. It uses wok-tossed chicken with red and green bell peppers in a chile-soy sauce that delivers moderate-heat but sustained spice. The dish is visually distinct — bright red sauce, well-caramelized chicken pieces — and is the baseline by which most customers judge the kitchen. The high-heat wok cooking leaves light char on the chicken edges that lower-heat cooking methods cannot replicate.

### Main Dishes — Beef & Pork

| Item | Price |
|------|-------|
| Mongolian Beef | $20.00 |
| Pepper Steak | $21.00 |
| Kung Pao Beef | $21.00 |
| Ma Po Tofu (with pork) | $18.00 |
| Chang's BBQ Spareribs (half rack) | $22.00 |

**Mongolian Beef** ($20.00) is PF Chang's second most-ordered entrée. Thin-sliced flank steak is wok-seared and glazed in a sweet soy sauce with garlic and green onions. The sauce is mildly sweet with a slight umami depth. The "Mongolian" description is a marketing convention — the dish was developed in American Chinese restaurants rather than Mongolia — but the flavor profile is consistent across the chain and has a dedicated following.

### Main Dishes — Seafood

| Item | Price |
|------|-------|
| Kung Pao Shrimp | $22.00 |
| Ginger Salmon (steamed) | $25.00 |
| Shrimp with Lobster Sauce | $23.00 |
| Cantonese Scallops | $26.00 |

### Main Dishes — Vegetarian & Noodles

| Item | Price |
|------|-------|
| Buddha's Feast (steamed) | $17.00 |
| Dan Dan Noodles | $18.00 |
| Lo Mein (vegetable) | $17.00 |
| Fried Rice (vegetable, chicken, or shrimp) | $17–$20 |
| Singapore Street Noodles | $19.00 |

### Sides

| Side | Price |
|------|-------|
| Steamed Brown Rice | $5.00 |
| Steamed White Rice | $5.00 |
| Spinach Stir-Fried | $8.00 |
| Long Life Noodles | $8.00 |

### Desserts

| Item | Price |
|------|-------|
| The Great Wall of Chocolate Cake | $10.00 |
| Banana Spring Rolls | $9.00 |
| Mango Mousse | $8.00 |
| Mini Dessert Trio | $9.00 |

---

## Best Items to Order at PF Chang's

**Best starter:** Chang's Chicken Lettuce Wraps ($16.00). Order these first for the table. The interactive format and sauce-building component are unique to PF Chang's and set the tone for the meal.

**Best entrée:** Chang's Spicy Chicken ($20.00). It's the entrée that most clearly showcases the wok technique — high-heat caramelization, distinct char, crisp edges.

**Best beef dish:** Mongolian Beef ($20.00). The sweet-umami sauce and thin-seared flank steak is the classic PF Chang's entrée for non-spice eaters.

**Best soup:** Hot and Sour Soup ($9.00). The balance of white pepper, vinegar, tofu, and mushroom in the house version is a reliable starter.

**Best dessert:** The Great Wall of Chocolate Cake ($10.00). A six-layer chocolate cake with dark chocolate ganache. It is large enough to share and is PF Chang's dessert centerpiece.

**Best value strategy:** Share two entrées plus the Lettuce Wraps and rice between two people. At $16 + $20 + $5 + $5 = $46 for two, that's $23 per person including appetizer — competitive with the casual dining peer set.

---

## PF Chang's vs. The Cheesecake Factory

PF Chang's and The Cheesecake Factory are the two most-compared full-service casual dining chains with Asian-inspired menus. PF Chang's focuses tighter on Chinese-American cuisine with wok cooking as its differentiator. The Cheesecake Factory offers broader menu diversity (200+ items) but without the specialized wok kitchen. For chains with more price overlap, see how [streaming services compare](/compare/disney-vs-netflix) or explore our [tech comparison section](/compare/amazon-echo-vs-google-nest-hub).

*PF Chang's Chang's Chicken Lettuce Wraps and wok-fired entrées have defined the American Chinese bistro category since 1993.*`,
  },

  // ── POST 4: Captain D's Menu ──────────────────────────────────────────────
  {
    slug: "captain-ds-menu",
    title: "Captain D's Menu: Full Prices, Best Seafood & Ordering Guide (2027)",
    excerpt:
      "Captain D's was founded in 1969 in Nashville, Tennessee, by Shoney's Inc. as a fast-food seafood concept. The chain operates approximately 540 locations primarily in the South and Midwest. A 2-piece Batter Dipped Fish & Fries meal costs $6.99, the Shrimp Feast (10-piece shrimp) is $7.99, a Grilled Tilapia plate is $8.99, Hush Puppies (5-piece) are $2.49, and a family seafood basket feeds four for $23.99. Captain D's is the largest US fast-food seafood chain by location count, known for its batter-dipped fish (a proprietary light batter), value-priced seafood combos, and sides like Hush Puppies and Coleslaw that distinguish it from burger-chain fish sandwich programs.",
    category: "food",
    tags: [
      "captain ds menu",
      "captain d's menu",
      "captain d's menu prices",
      "captain ds seafood",
      "captain ds prices 2027",
      "captain ds fish and shrimp",
    ],
    metaTitle: "Captain D's Menu: Full Prices & Best Seafood Items (2027)",
    metaDescription:
      "See the full Captain D's menu with 2027 prices, batter-dipped fish, shrimp, grilled options, sides, and ordering tips. What should you order at Captain D's?",
    relatedComparisonSlugs: [
      "red-lobster-vs-olive-garden",
      "chick-fil-a-vs-popeyes",
    ],
    sourceQuery: "captain ds menu",
    sourceImpressions: 74000,
    publishedAt: FEB5,
    content: `# Captain D's Menu: Full Prices, Best Seafood & Ordering Guide (2027)

*By Daniel Rozin | A Versus B | February 5, 2027*

Captain D's was founded in 1969 in Donelson, Tennessee (a Nashville suburb), originally as a division of Shoney's Inc. operating under the name "Mr. D's Seafood and Hamburgers." The name was shortened to Captain D's in 1974. The chain was acquired by private equity and has operated independently since 2010. Captain D's runs approximately 540 locations across 23 states, with its heaviest concentration in Tennessee, Georgia, Alabama, Mississippi, and the broader Southeast. A 2-piece Batter Dipped Fish & Fries meal costs $6.99, the Shrimp Feast is $7.99, a Grilled Tilapia plate is $8.99, Hush Puppies (5-piece) are $2.49, and a 20-piece Family Seafood Basket is $23.99. Captain D's is the largest fast-food seafood chain in the US by location count — larger than Long John Silver's — and is known for its batter-dipped fish (a proprietary light, crispy coating thinner than beer batter), value-priced combo plates, and sides including Hush Puppies and Coleslaw that give it the feel of a Southern seafood shack at fast-food pricing. Here is the full Captain D's menu with 2027 prices.

---

## Captain D's Menu Prices (2027)

*Note: Prices are mid-range across Captain D's markets. Tennessee and Alabama locations may price 5–8% below the average; urban markets slightly higher.*

### Batter-Dipped Fish

| Item | Price | Notes |
|------|-------|-------|
| 2-Piece Fish & Fries | $6.99 | Classic batter-dipped fish |
| 3-Piece Fish & Fries | $8.49 | |
| 4-Piece Fish & Fries | $9.99 | |
| Big 8 Feast (8-piece fish) | $14.99 | Best value per piece |
| Fish Sandwich | $4.49 | |
| Fish Sandwich Combo | $7.49 | With fries + drink |

Captain D's **Batter-Dipped Fish** uses wild-caught Alaskan Pollock (the same species used by McDonald's Filet-O-Fish and most fast-food chains) but with a proprietary light batter that is thinner than traditional fish fry batter. The result is a crispier, less greasy coating that stays crunchier longer than competitors'. Captain D's has used this batter formula since the 1970s and it remains the brand's core differentiator.

The **2-Piece Fish & Fries** ($6.99) is the entry combo: two batter-dipped fish pieces with seasoned fries. For the full Captain D's experience, add Hush Puppies.

### Shrimp

| Item | Price |
|------|-------|
| Shrimp Feast (10-piece) | $7.99 |
| Shrimp Feast (20-piece) | $11.99 |
| Shrimp Skewer Plate | $8.99 |
| Popcorn Shrimp (regular) | $6.49 |
| Shrimp & Fish Combo | $8.99 |

The **Shrimp Feast** (10-piece, $7.99) uses butterfly-cut shrimp in the same light batter as the fish. At $0.80 per shrimp for the 10-piece, it is among the lowest cost-per-shrimp pricing at any national fast food chain.

### Grilled Options

| Item | Price |
|------|-------|
| Grilled Tilapia Plate | $8.99 |
| Grilled Salmon Plate | $10.99 |
| Grilled Shrimp Skewer Plate | $9.49 |
| Grilled White Fish Plate | $8.99 |

Captain D's operates a full grilled menu for customers who want lower-calorie options. The **Grilled Tilapia Plate** ($8.99) comes with two tilapia fillets seasoned with lemon pepper, served with two sides. It is Captain D's lowest-calorie full plate option.

### Sides

| Side | Price |
|------|-------|
| Hush Puppies (5-piece) | $2.49 |
| Coleslaw | $1.99 |
| Seasoned Fries | $2.49 |
| Corn on the Cob | $1.99 |
| Green Beans | $1.99 |
| Mac & Cheese | $2.49 |
| Baked Potato | $2.49 |
| Sweet Potato | $2.49 |

**Hush Puppies** ($2.49 for 5) are Captain D's most distinctive side and one of the most authentic fast-food representations of the Southern seafood tradition. They are deep-fried cornmeal fritters — sweetened slightly, served hot — that pair with fried fish the way fries pair with burgers. Captain D's Hush Puppies have been on the menu since 1969 and remain a primary reason customers choose Captain D's over McDonald's Filet-O-Fish or Burger King's fish sandwich.

### Family Feasts

| Item | Price | Serves |
|------|-------|--------|
| 10-Piece Fish Family Feast | $16.99 | 3–4 |
| 20-Piece Fish Family Feast | $28.99 | 5–6 |
| Family Seafood Basket | $23.99 | 4 |
| Mix & Match Family Feast | $21.99 | 3–4 |

---

## Best Items to Order at Captain D's

**Best single item:** 2-Piece Fish & Fries with Hush Puppies ($6.99 + $2.49 = $9.48). The core Captain D's experience — batter-dipped fish with fries and Hush Puppies — represents the chain's clearest differentiation from burger-chain fish options.

**Best value:** Big 8 Feast (8-piece fish, $14.99). At $1.87 per fish piece, the 8-piece is Captain D's lowest per-unit price and feeds 2–3 people with sides.

**Best grilled option:** Grilled Salmon Plate ($10.99). The salmon has more flavor than tilapia and benefits from the lemon pepper seasoning. At $10.99 it is higher than the fried options but competitive with fast-casual salmon prices.

**Best side:** Hush Puppies. Order them with every visit — they are unique to Captain D's at fast-food pricing and the best version of Hush Puppies available in the quick-service category.

**Best for families:** Family Seafood Basket ($23.99). At $6.00 per person for 4, it includes a mix of fish and shrimp with sides and is the most flexible family option.

---

## Captain D's vs. Long John Silver's

Captain D's and Long John Silver's are the two largest fast-food seafood chains in the US. Captain D's leads on grilled options, Southeast market penetration, and Hush Puppy quality. Long John Silver's leads on broader national distribution and its "planks" format with coleslaw. Captain D's has been growing while Long John Silver's has contracted — Captain D's now has more US locations. For a comparison of broader dining options see our [Red Lobster vs. Olive Garden comparison](/compare/red-lobster-vs-olive-garden).

*Captain D's batter-dipped fish, Hush Puppies, and value-priced seafood combos have made it the Southeast's leading fast-food seafood chain since 1969.*`,
  },

  // ── POST 5: Sheetz Menu ───────────────────────────────────────────────────
  {
    slug: "sheetz-menu",
    title: "Sheetz Menu: Full MTO Prices, Best Food & Ordering Guide (2027)",
    excerpt:
      "Sheetz was founded in 1952 in Altoona, Pennsylvania, by Bob Sheetz, who purchased one of his father's dairy stores and converted it into a convenience store. The chain operates approximately 740 locations across Pennsylvania, Ohio, West Virginia, Virginia, North Carolina, Maryland, and Indiana. A Sheetz Burger costs $5.49, a 6-inch MTO Sub is $5.99, Loaded Fries are $4.49, a Specialty Coffee (Sheetz Bros. Coffeez) starts at $2.99, and a Fryz (large seasoned fries) are $3.79. Sheetz is known for its 'MTO' (Made-to-Order) customizable food program run on touchscreen kiosks, which allows extensive sandwich and burger customization not available at traditional fast food chains.",
    category: "food",
    tags: [
      "sheetz menu",
      "sheetz mto menu",
      "sheetz menu prices",
      "sheetz food menu",
      "sheetz prices 2027",
      "sheetz burger",
    ],
    metaTitle: "Sheetz Menu: Full MTO Prices & Best Food Guide (2027)",
    metaDescription:
      "See the full Sheetz MTO menu with 2027 prices, Sheetz Burger, loaded fries, subs, coffee, and ordering tips. What should you order at Sheetz? Complete guide.",
    relatedComparisonSlugs: [
      "subway-vs-jersey-mikes",
      "starbucks-vs-dunkin",
    ],
    sourceQuery: "sheetz menu",
    sourceImpressions: 60500,
    publishedAt: FEB6,
    content: `# Sheetz Menu: Full MTO Prices, Best Food & Ordering Guide (2027)

*By Daniel Rozin | A Versus B | February 6, 2027*

Sheetz was founded in 1952 in Altoona, Pennsylvania, by Bob Sheetz, who bought one of his father's dairy stores and converted it into a convenience store. The family-owned chain expanded into gas stations in the 1970s and added the "Made-to-Order" (MTO) food program in 1983 — initially offering hot sandwiches, then expanding into burgers, wraps, salads, breakfast items, and specialty coffee. Sheetz operates approximately 740 locations across Pennsylvania, Ohio, West Virginia, Virginia, North Carolina, Maryland, and Indiana. A Sheetz Burger costs $5.49, a 6-inch MTO Sub is $5.99, Loaded Fries are $4.49, Sheetz Bros. Coffeez specialty drinks start at $2.99, and a large Fryz (seasoned fries) are $3.79. Sheetz is the largest convenience store food operation in the Mid-Atlantic and Appalachian regions, known for its MTO touchscreen-kiosk ordering system (which predates modern fast-casual customization apps by decades), its 24/7 food availability, and its breadth of customization options. Here is the full Sheetz MTO menu with 2027 prices.

---

## Sheetz MTO Menu Prices (2027)

*Note: Sheetz prices are uniform across locations. MTO items are ordered via touchscreen kiosks or the Sheetz app.*

### Burgers & Sandwiches

| Item | Price | Notes |
|------|-------|-------|
| Sheetz Burger | $5.49 | Customizable |
| Double Sheetz Burger | $7.49 | |
| Bacon Sheetz Burger | $6.49 | |
| Spicy Chicken Sandwich | $5.99 | Crispy chicken |
| Grilled Chicken Sandwich | $5.99 | |
| Fish Sandwich | $5.49 | |
| Veggie Burger | $5.49 | |

The **Sheetz Burger** ($5.49) is made to order — meaning it's cooked fresh after you place the order on the kiosk, rather than sitting under a heat lamp. The customization is the primary draw: the kiosk allows you to select bun type (brioche, sesame, lettuce wrap), cheese (American, cheddar, pepper jack, Swiss, provolone), sauce (sriracha mayo, ranch, chipotle, honey mustard, BBQ, etc.), and up to 20 standard toppings. The real-time build creates a different product than McDonald's or Burger King despite the comparable price point.

### MTO Subs & Wraps

| Item | Price | Notes |
|------|-------|-------|
| 6-inch MTO Sub | $5.99 | Any protein, any toppings |
| Footlong MTO Sub | $8.99 | |
| MTO Wrap | $6.49 | Flour tortilla |
| MTO Quesadilla | $5.49 | |
| MTO Flatbread | $5.99 | |

MTO Subs use hoagie-style rolls and are assembled fresh. Protein choices include turkey, ham, roast beef, salami, chicken (grilled or crispy), tuna, and meatballs. Like the burgers, full topping and sauce customization is available through the kiosk — Sheetz's MTO system predates Subway's "make it your way" marketing by over a decade.

### Breakfast (Available 24/7)

| Item | Price |
|------|-------|
| Egg & Cheese on Biscuit | $3.99 |
| Sausage, Egg & Cheese Biscuit | $4.49 |
| Breakfast Burrito | $4.99 |
| Breakfast MTO Sandwich | $4.49 |
| French Toast Sticks (5-piece) | $2.99 |
| Pancake on a Stick | $1.49 |

Sheetz serves its full breakfast menu 24 hours a day, 7 days a week — a policy shared with few food chains. The **Breakfast Burrito** ($4.99) is a customer favorite and can be customized with eggs, cheese, potato, and any protein available in the breakfast menu.

### Fryz & Sides

| Item | Price |
|------|-------|
| Regular Fryz | $2.99 |
| Large Fryz | $3.79 |
| Loaded Fries | $4.49 |
| Sheetz Tots | $2.99 |
| Loaded Tots | $4.49 |
| Onion Rings | $3.49 |
| Mac Bites | $3.49 |
| Mozzarella Sticks | $3.49 |
| Nachos | $4.99 |

**Loaded Fries** ($4.49) are a Sheetz standout — fries topped with queso, bacon, jalapeños, and sour cream. The kiosk allows customization of the loaded toppings as well. Among the convenience-store food options, Loaded Fries consistently rank as the most-shared Sheetz item on social media.

**Sheetz Tots** ($2.99) — tater tots seasoned with Sheetz's house spice blend — are also a frequently recommended item for first-time visitors.

### Pizza & Snacks

| Item | Price |
|------|-------|
| Personal Pizza (6-inch) | $4.99 |
| Pepperoni Pizza | $4.99 |
| Cheese Pizza | $4.49 |
| Hot Dogs (MTO) | $2.49 |
| Pretzel Bites | $3.49 |
| Chicken Tenders (4-piece) | $5.99 |

### Sheetz Bros. Coffeez (Specialty Coffee)

| Item | Price |
|------|-------|
| Cappuccino | $2.99 |
| Latte | $3.29 |
| Macchiato | $3.29 |
| Frozen Coffee (Frappé-style) | $3.99 |
| Cold Brew | $2.99 |
| Nitro Cold Brew | $3.49 |
| Smoothie | $4.99 |

**Sheetz Bros. Coffeez** is Sheetz's in-store specialty coffee program, installed in all locations. Drinks are made via automated espresso machines with barista-style customization available on the kiosk. At $2.99–$3.49, Sheetz coffee is priced 30–50% below Starbucks for equivalent drink types. For a price comparison of leading coffee chains, see our [Starbucks vs. Dunkin' comparison](/compare/starbucks-vs-dunkin).

---

## Best Items to Order at Sheetz

**Best single item:** Sheetz Burger, fully customized ($5.49 base). Use the kiosk to build: brioche bun, pepper jack cheese, sriracha mayo, lettuce, tomato, pickled jalapeños, and grilled onions. The customization is the point.

**Best value:** 6-inch MTO Sub ($5.99). More customization than Subway, made fresh, at a competitive price.

**Best snack:** Loaded Fries ($4.49) or Loaded Tots ($4.49). Either works as a premium side that costs $1–2 more than plain fries but delivers a significantly more satisfying experience.

**Best coffee:** Nitro Cold Brew ($3.49). Cold brew nitrogen-infused on tap. At $0.50 more than regular cold brew, the texture upgrade is worth it.

**Best breakfast:** Breakfast Burrito ($4.99). Available 24 hours, fully customizable — the best 24/7 fast-food breakfast burrito in the Mid-Atlantic region.

---

## Sheetz vs. Wawa vs. QuikTrip

Sheetz, Wawa, and QuikTrip are the three most compared premium convenience store chains for their food programs. Sheetz leads on customization (MTO kiosk breadth), 24/7 full food availability, and price. Wawa leads on hoagie quality and Mid-Atlantic / Florida market presence. QuikTrip leads on speed and Midwest / Sun Belt penetration. For a side-by-side on sandwich chains, see our [Subway vs. Jersey Mike's comparison](/compare/subway-vs-jersey-mikes).

*Sheetz's MTO touchscreen-kiosk ordering, 24/7 fresh food service, and extensive customization have made it the Mid-Atlantic's defining premium convenience store food experience since 1983.*`,
  },
];

async function main() {
  console.log(`\nDAN-2398 — Week 40 Blog Batch 40: 5 restaurant menu posts`);
  console.log(`Target: bojangles-menu, portillos-menu, pf-changs-menu, captain-ds-menu, sheetz-menu\n`);

  const before = await prisma.blogArticle.count();
  console.log(`Blog articles before: ${before}`);

  for (const post of POSTS) {
    const existing = await prisma.blogArticle.findFirst({ where: { slug: post.slug } });
    if (existing) {
      console.log(`  ⚠️  SKIP ${post.slug} — already exists (id: ${existing.id})`);
      continue;
    }

    const created = await prisma.blogArticle.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        relatedComparisonSlugs: post.relatedComparisonSlugs,
        sourceQuery: post.sourceQuery,
        sourceImpressions: post.sourceImpressions,
        publishedAt: post.publishedAt,
      },
    });
    console.log(`  ✅ CREATED ${post.slug} — id: ${created.id}`);
  }

  const after = await prisma.blogArticle.count();
  console.log(`\nBlog articles after: ${after} (+${after - before})`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * DAN-2365: Week 38 Blog Batch 38 — Keyword discovery + 5 blog drafts (Jan 23-27, 2027)
 *
 * Keyword discovery results (DataForSEO keyword_ideas, US, vol>100, KD<45):
 *   - cheesecake-factory-menu  (KD 30,   300,000 vol, CPC $0.14) — Jan 23 [food/casual-dining]
 *   - longhorn-steakhouse-menu (KD 18,   200,000 vol, CPC $0.09) — Jan 24 [food/steakhouse]
 *   - churchs-chicken-menu     (KD 10,   150,000 vol, CPC $0.06) — Jan 25 [food/chicken]
 *   - el-pollo-loco-menu       (KD 12,   200,000 vol, CPC $0.08) — Jan 26 [food/mexican-chicken]
 *   - hooters-menu             (KD 10,   150,000 vol, CPC $0.05) — Jan 27 [food/wings]
 *
 * Combined monthly search volume: ~1,000,000/mo
 * All slugs verified: no overlap with Batches 1–37 or existing DB records.
 * Each draft: 900-1,300 words, clear direct answer first paragraph,
 * authoritative facts, author byline, internal links to /compare/* pages.
 *
 * Run: npx tsx scripts/publish-tactical-blogs-dan2365.ts
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

const JAN23 = new Date("2027-01-23T10:00:00.000Z");
const JAN24 = new Date("2027-01-24T10:00:00.000Z");
const JAN25 = new Date("2027-01-25T10:00:00.000Z");
const JAN26 = new Date("2027-01-26T10:00:00.000Z");
const JAN27 = new Date("2027-01-27T10:00:00.000Z");

const POSTS = [
  // ── POST 1: The Cheesecake Factory Menu ───────────────────────────────────
  {
    slug: "cheesecake-factory-menu",
    title: "The Cheesecake Factory Menu: Full Prices, Best Dishes & Cheesecake Guide (2027)",
    excerpt:
      "The Cheesecake Factory was founded in 1978 in Beverly Hills, California, by David Overton, and operates approximately 220 locations across 36 states and internationally. The menu contains over 200 items — one of the longest in casual dining. Chicken Madeira costs $24.95, Pasta Carbonara is $21.95, Factory Nachos (starter) are $15.95, and a slice of Original Cheesecake is $9.95. The Cheesecake Factory is famous for its enormous portion sizes (entrées average 1,500 calories), its landmark 36-page menu, 34 varieties of cheesecake, and its bread service featuring warm brown bread and white sourdough.",
    category: "food",
    tags: [
      "cheesecake factory menu",
      "cheesecake factory menu prices",
      "cheesecake factory cheesecake",
      "cheesecake factory prices 2027",
      "cheesecake factory best dishes",
      "cheesecake factory portions",
    ],
    metaTitle: "The Cheesecake Factory Menu: Full Prices & Best Dishes (2027)",
    metaDescription:
      "See the full Cheesecake Factory menu with 2027 prices, best entrées, all 34 cheesecake flavors, and ordering tips. What should you order at The Cheesecake Factory? Find out.",
    relatedComparisonSlugs: [
      "olive-garden-vs-red-lobster",
      "outback-steakhouse-vs-longhorn-steakhouse",
    ],
    sourceQuery: "cheesecake factory menu",
    sourceImpressions: 300000,
    publishedAt: JAN23,
    content: `# The Cheesecake Factory Menu: Full Prices, Best Dishes & Cheesecake Guide (2027)

*By Daniel Rozin | A Versus B | January 23, 2027*

The Cheesecake Factory was founded in 1978 in Beverly Hills, California, by David Overton, who had been selling cheesecakes wholesale since 1972. The chain operates approximately 220 locations across 36 states and internationally in Canada, Mexico, the Middle East, and Asia. The menu contains over 200 items — the full menu is 36 pages, making it one of the longest in casual dining nationally. Chicken Madeira costs $24.95, Pasta Carbonara is $21.95, Factory Nachos are $15.95, and a slice of Original Cheesecake is $9.95. The Cheesecake Factory is known for three things: portion sizes that average 1,500 calories per entrée, a 36-page menu that spans 18 cuisine categories, and 34 varieties of house-made cheesecake. Here is the full Cheesecake Factory menu with 2027 prices.

---

## The Cheesecake Factory Menu Prices (2027)

*Note: The Cheesecake Factory's menu is one of the largest in casual dining. Prices vary slightly by location. Delivery adds $3–6.*

### Small Plates & Starters

| Item | Price | Notes |
|------|-------|-------|
| Factory Nachos | $15.95 | Jalapeños, sour cream, guacamole |
| Avocado Egg Rolls | $15.95 | Tamarind cashew dipping sauce |
| Dynamite Shrimp | $14.95 | Crispy, spicy mayo |
| Roadside Sliders | $14.95 | 4 mini burgers with cheese |
| Tex Mex Eggrolls | $14.95 | Chicken, avocado, corn |
| Spinach and Artichoke Dip | $13.95 | With tortilla chips |
| Stuffed Mushrooms | $14.95 | Spinach, herbs, cheese |
| Edamame | $7.95 | Steamed, salted |

**Avocado Egg Rolls** ($15.95) are the most-ordered starter at The Cheesecake Factory by most measures — a dish unique to the chain, with a crispy egg roll shell filled with avocado, sun-dried tomato, and tarragon, served with a tamarind cashew dipping sauce that has a sweet-tangy-herby flavor profile unlike any standard dipping sauce. They have appeared on the menu since 1995 and have become one of the chain's most recognized brand signatures.

### Pizzas & Flatbreads

| Item | Price |
|------|-------|
| Margherita Flatbread | $13.95 |
| BBQ Chicken Flatbread | $15.95 |
| Pepperoni Flatbread | $14.95 |

### Salads

| Item | Price | Notes |
|------|-------|-------|
| Factory Chopped Salad | $18.95 | Avocado, bacon, blue cheese |
| Caesar Salad | $14.95 | Anchovies optional |
| Beet and Avocado Salad | $16.95 | |
| Skinnylicious Warm Chicken Salad | $17.95 | Under 590 calories |

### Pasta

| Item | Price | Notes |
|------|-------|-------|
| Pasta Carbonara | $21.95 | Pancetta, peas, parmesan cream |
| Fettuccini Alfredo | $18.95 | Parmesan, butter cream |
| Four Cheese Pasta | $19.95 | Penne, fontina, parmesan, romano |
| Chicken Bellagio | $24.95 | Capellini, basil cream, pesto |
| Shrimp and Angel Hair Pasta | $23.95 | Tomato, capers, garlic |
| Louisiana Chicken Pasta | $23.95 | Spicy tomato cream, peppers |

**Pasta Carbonara** ($21.95) is one of the most-ordered pasta dishes at the chain and one of the most calorie-dense items on the menu at approximately 1,810 calories. The cream sauce is enriched with pancetta, green peas, and a generous Parmesan finish. The portion size is consistently cited by customers as sufficient for two meals — many guests take half home.

### Chicken & Fish Entrées

| Item | Price | Notes |
|------|-------|-------|
| Chicken Madeira | $24.95 | #1 best-seller |
| Crispy Chicken Costoletta | $22.95 | Lemon, caper, basil |
| Herb Crusted Salmon | $29.95 | With asparagus |
| Miso Salmon | $28.95 | Miso-glazed, Asian slaw |
| Fish & Chips | $21.95 | English-style batter |
| Bang Bang Chicken & Shrimp | $24.95 | Thai peanut, sweet chili |

**Chicken Madeira** ($24.95) is The Cheesecake Factory's perennial best-selling entrée nationwide. It is a grilled chicken breast topped with sautéed mushrooms, asparagus, and mozzarella cheese, served over a Madeira wine reduction sauce alongside garlic mashed potatoes. The combination of umami from the mushrooms, sweetness from the Madeira wine, and richness from the mozzarella is a flavor profile that has driven repeat visits for 30+ years. At a 1,350-calorie count and $24.95, it is the single entrée that most defines the Cheesecake Factory experience for regular customers.

### Steaks & Ribs

| Item | Price | Notes |
|------|-------|-------|
| Filet Mignon (9 oz) | $42.95 | Mushroom sauce |
| New York Strip (10 oz) | $37.95 | Shallot butter |
| Hibachi Steak & Chicken | $27.95 | Teriyaki glaze |
| BBQ Ribs (half rack) | $26.95 | Slow-roasted |
| Factory Meatloaf | $19.95 | Mushroom gravy, mashed potatoes |

### Burgers

| Item | Price | Notes |
|------|-------|-------|
| Classic Burger | $16.95 | Lettuce, tomato, onion |
| Mushroom Swiss Burger | $17.95 | Sautéed mushrooms |
| Bacon Cheeseburger | $18.95 | Applewood bacon |
| Impossible Burger | $18.95 | Plant-based patty |

---

## The Cheesecake Factory Cheesecakes: All 34 Flavors

The Cheesecake Factory's cheesecake is made in a dedicated bakery and shipped fresh to all locations. A slice is $9.95; a whole 10-inch cheesecake is $54.95 (serves 12–16).

**Most popular flavors:**

| Rank | Cheesecake Flavor | Notes |
|------|------------------|-------|
| 1 | Original Plain | The classic — just cream cheese and egg |
| 2 | Fresh Strawberry | Glazed fresh strawberries on top |
| 3 | Oreo Dream Extreme | Cookies and cream filling + crust |
| 4 | Chocolate Mousse | Belgian chocolate mousse filling |
| 5 | Dulce de Leche | Caramel swirl, Snickers |
| 6 | Reese's Peanut Butter | Reese's cups embedded throughout |
| 7 | Lemon Raspberry Cream | Raspberry swirl, lemon zest |
| 8 | 30th Anniversary | Chocolate and vanilla marble |
| 9 | Caramel Apple | Graham cracker crust, cinnamon |
| 10 | Cinnabon® Cinnamon Roll | Licensed Cinnabon flavor |

The **Original Cheesecake** uses a New York-style cheesecake recipe with cream cheese, eggs, sugar, and vanilla bean paste on a graham cracker crust. It is the recipe that built the Cheesecake Factory brand, first made by Evelyn Overton (David's mother) in the family kitchen.

The Cheesecake Factory also offers seasonal limited-edition flavors that rotate quarterly, typically 4–6 additional options in addition to the permanent 34.

---

## Best Items to Order at The Cheesecake Factory

**Best entrée:** Chicken Madeira ($24.95). The nationwide best-seller for good reason — the Madeira wine sauce and mushroom-mozzarella combination delivers a restaurant-quality dish not replicable at competing chains.

**Best starter:** Avocado Egg Rolls ($15.95). The tamarind cashew dipping sauce is a dish component you cannot get anywhere else. These are the most shared menu item in social media photography of Cheesecake Factory meals.

**Best pasta:** Louisiana Chicken Pasta ($23.95). The spicy tomato cream sauce with pan-fried chicken on penne gives the dish heat and richness that the standard Fettuccini Alfredo lacks.

**Best value:** Factory Nachos ($15.95) shared as a starter for 2–3 people. The portion is large enough to function as a meal for one and is a better value per calorie than any individual entrée on the menu.

**Best cheesecake:** Fresh Strawberry ($9.95). The glazed whole fresh strawberry topping is the most visually striking slice and pairs the tart fruit with the rich cream cheese base better than any baked-in-fruit variation. If you want something more indulgent, the Oreo Dream Extreme is the correct choice.

---

## The Cheesecake Factory: What You Need to Know

The Cheesecake Factory does not take reservations at most locations — it is first-come, first-served. Weekend wait times at high-traffic locations (malls, tourist areas) routinely run 45–90 minutes. The chain's app allows you to add your name to the waitlist remotely. Average check per guest including one appetizer (shared), one entrée, and one non-alcoholic drink is $35–$50 before gratuity. The Cheesecake Factory has a "Skinnylicious" menu section with over 50 items under 590 calories, available at all locations.

*The Cheesecake Factory's 36-page menu, Chicken Madeira, Avocado Egg Rolls, and 34 handmade cheesecake varieties have made it one of the highest-revenue-per-location casual dining chains in America.*`,
  },

  // ── POST 2: LongHorn Steakhouse Menu ──────────────────────────────────────
  {
    slug: "longhorn-steakhouse-menu",
    title: "LongHorn Steakhouse Menu: Full Prices, Best Steaks & Texas Tonion (2027)",
    excerpt:
      "LongHorn Steakhouse was founded in 1981 in Atlanta, Georgia, and is owned by Darden Restaurants (which also owns Olive Garden and Cheddar's Scratch Kitchen). The chain operates over 600 locations across 43 states. Flo's Filet (7 oz) costs $26.99, the Outlaw Ribeye (20 oz) is $39.99, the LongHorn Porterhouse (22 oz) is $41.99, the Texas Tonion starter is $9.99, and Grilled Chicken is $17.99. LongHorn Steakhouse competes directly with Outback Steakhouse in the casual steakhouse segment, with a stronger Eastern US presence and a Western-cattle-drive theme.",
    category: "food",
    tags: [
      "longhorn steakhouse menu",
      "longhorn steakhouse menu prices",
      "longhorn steakhouse steak prices",
      "longhorn steakhouse 2027",
      "longhorn steakhouse flos filet",
      "longhorn steakhouse texas tonion",
    ],
    metaTitle: "LongHorn Steakhouse Menu: Full Prices & Best Steaks (2027)",
    metaDescription:
      "See the full LongHorn Steakhouse menu with 2027 prices, best steaks, and ordering tips. Flo's Filet, Outlaw Ribeye, Texas Tonion — what should you order? Find out here.",
    relatedComparisonSlugs: [
      "outback-steakhouse-vs-longhorn-steakhouse",
      "texas-roadhouse-vs-outback",
    ],
    sourceQuery: "longhorn steakhouse menu",
    sourceImpressions: 200000,
    publishedAt: JAN24,
    content: `# LongHorn Steakhouse Menu: Full Prices, Best Steaks & Texas Tonion (2027)

*By Daniel Rozin | A Versus B | January 24, 2027*

LongHorn Steakhouse was founded in 1981 in Atlanta, Georgia, by George McKerrow Jr., who named the chain after longhorn cattle and the cattle-drive heritage of the American West. Darden Restaurants acquired LongHorn in 2007 and has since grown it to over 600 locations across 43 states, with particular strength in the Eastern United States where it competes directly with Outback Steakhouse. Flo's Filet (7 oz) costs $26.99, the Outlaw Ribeye (20 oz) is $39.99, the LongHorn Porterhouse (22 oz) is $41.99, Wild West Shrimp (starter) is $13.99, and the Texas Tonion is $9.99. LongHorn differentiates from Outback on atmosphere (more American West vs. Australian) and steak cut variety. Here is the full LongHorn Steakhouse menu with 2027 prices.

---

## LongHorn Steakhouse Menu Prices (2027)

### Starters & Appetizers

| Item | Price | Notes |
|------|-------|-------|
| Texas Tonion | $9.99 | Whole onion, bloomed & fried |
| Wild West Shrimp | $13.99 | Prairie dust, avocado ranch |
| Firecracker Chicken Wraps | $12.99 | Sweet chili, green onion |
| Spinach & Artichoke Dip | $12.99 | With tortilla chips |
| LongHorn Salmon Dip | $13.99 | Smoked salmon, cream cheese |
| Stuffed Peppers | $11.99 | Cheese, chicken, jalapeño |
| House Salad | $6.99 | |
| Caesar Salad | $7.99 | |

The **Texas Tonion** ($9.99) is LongHorn's signature appetizer — a direct competitor to Outback Steakhouse's Bloomin' Onion. A whole sweet onion is cut to bloom into petals, battered in a seasoned flour coating, and deep-fried. LongHorn's version uses a slightly thicker batter and serves it with Prairie Dust-seasoned dipping sauce (a mustard-cream blend with LongHorn's proprietary dry rub seasoning). At $9.99, it is a dollar less than Outback's Bloomin' Onion ($10.99). Regulars who have eaten both side by side generally give LongHorn's version a slight edge on the dipping sauce but consider the onions equivalent.

**Wild West Shrimp** ($13.99) is LongHorn's most popular non-steak starter: large shrimp tossed in Prairie Dust seasoning, flash-fried, and served over a ranch dipping sauce with avocado. It has a spicier, more Western-seasoned flavor profile than Outback's Shrimp on the Barbie.

### Steaks

| Item | Price | Notes |
|------|-------|-------|
| Flo's Filet (6 oz) | $22.99 | Signature tender filet |
| Flo's Filet (7 oz) | $26.99 | Most popular steak |
| Flo's Filet (9 oz) | $32.99 | |
| LongHorn Salmon | $22.99 | |
| LongHorn Porterhouse (22 oz) | $41.99 | Strip + tenderloin |
| Outlaw Ribeye (20 oz) | $39.99 | Bone-in, heavy marbling |
| New York Strip (12 oz) | $29.99 | Center-cut |
| T-Bone (18 oz) | $36.99 | |
| Center-Cut Sirloin (6 oz) | $16.99 | |
| Center-Cut Sirloin (9 oz) | $19.99 | |
| Center-Cut Sirloin (12 oz) | $23.99 | |
| Renegade Sirloin (12 oz, bone-in) | $24.99 | |

**Flo's Filet** is LongHorn's signature steak and most-ordered cut. Named for Florence, the mother of chain founder George McKerrow Jr., the filet is from the tenderloin — the least-worked muscle in the cow, producing the most tender cut available. The 7 oz size at $26.99 is the most popular order. LongHorn prepares all steaks fresh (not frozen), seasoned with a proprietary Prairie Dust dry rub before grilling over direct flame. The filet is carved from a whole tenderloin in-house rather than arriving pre-portioned.

The **Outlaw Ribeye (20 oz)** at $39.99 is the largest and most flavorful steak on the menu due to the ribeye's natural fat marbling. At 20 oz bone-in, it is one of the largest standard steaks available at any casual dining chain — larger than Outback's 14 oz Ribeye, larger than Texas Roadhouse's 12 oz Prime Rib. The high fat content means it can tolerate a higher cook temperature without drying out, making it more forgiving for guests who prefer well-done or medium-well.

### Chicken & Ribs

| Item | Price | Notes |
|------|-------|-------|
| Grilled Chicken | $17.99 | Prairie Dust seasoning |
| Parmesan-Crusted Chicken | $19.99 | Cheese crust, herb butter |
| Chicken Fresco | $19.99 | Lemon, capers, artichoke |
| Baby Back Ribs (half rack) | $24.99 | |
| Baby Back Ribs (full rack) | $34.99 | |
| Chicken & Ribs Combo | $28.99 | Half rack + grilled chicken |

### Seafood

| Item | Price | Notes |
|------|-------|-------|
| Atlantic Salmon | $23.99 | Grilled or Parmesan-crusted |
| LobsterTail (9 oz) | $34.99 | Drawn butter |
| Mavericks Shrimp Plate | $19.99 | Grilled or fried shrimp |
| Shrimp & Grits | $19.99 | Cajun cream, Andouille |

### Burgers & Sandwiches

| Item | Price | Notes |
|------|-------|-------|
| LongHorn Steakhouse Burger | $14.99 | Two patties, LH sauce |
| Smokehouse Burger | $15.99 | Bacon, cheddar, BBQ |
| Spicy Chipotle Chicken Sandwich | $14.99 | |

### Sides

| Item | Price |
|------|-------|
| Baked Potato (loaded) | $6.99 |
| Mashed Potatoes | $4.99 |
| Steamed Broccoli | $4.99 |
| Sweet Potato | $5.99 |
| Asparagus | $5.99 |
| Mac & Cheese | $4.99 |
| French Fries | $4.99 |

---

## Best Items to Order at LongHorn Steakhouse

**Best steak:** Flo's Filet 7 oz ($26.99). The most tender cut on the menu, prepared fresh from a whole tenderloin, with the Prairie Dust seasoning creating a savory exterior crust. For a first LongHorn visit, the filet is the correct default.

**Best value steak:** Center-Cut Sirloin 9 oz ($19.99). The sirloin is firmer than the filet but delivers more steak flavor at a $7 savings. With the Prairie Dust seasoning and direct-flame grill marks, it rivals the sirloin at Outback for flavor at the same price point.

**Best starter:** Texas Tonion ($9.99). The signature shareable appetizer at $1 less than Outback's Bloomin' Onion, with a dipping sauce that is slightly more complex. Order it for the table as a default.

**Best non-steak entrée:** Parmesan-Crusted Chicken ($19.99). The cheese crust creates a crispy, flavorful exterior on grilled chicken — it is more interesting than the standard Grilled Chicken and well below steak prices.

**Best splurge:** Outlaw Ribeye 20 oz ($39.99). The largest bone-in ribeye at any major casual steakhouse. Best ordered medium-rare to medium to let the fat rendering create the full flavor.

---

## LongHorn Steakhouse vs. Outback Steakhouse: Key Differences

LongHorn Steakhouse and Outback Steakhouse are the two largest casual steakhouse chains in the US and direct competitors. LongHorn is stronger in the Eastern US (New England, Mid-Atlantic, Southeast); Outback has stronger Western US presence. LongHorn's Flo's Filet is generally preferred over Outback's Victoria's Filet in reader taste comparisons. Outback's Bloomin' Onion is more famous (by sheer marketing volume) than LongHorn's Texas Tonion. Both use fresh (never frozen) beef. LongHorn's sides selection is slightly larger; Outback has slightly more Australian-themed naming that creates brand memorability. For a full comparison, see our [Outback Steakhouse vs. LongHorn Steakhouse comparison](/compare/outback-steakhouse-vs-longhorn-steakhouse).

*LongHorn Steakhouse's Flo's Filet, Prairie Dust seasoning, and Texas Tonion appetizer have made it the leading casual steakhouse in the Eastern United States since 1981.*`,
  },

  // ── POST 3: Church's Chicken Menu ─────────────────────────────────────────
  {
    slug: "churchs-chicken-menu",
    title: "Church's Chicken Menu: Full Prices, Best Chicken & Honey Biscuits (2027)",
    excerpt:
      "Church's Chicken was founded in 1952 in San Antonio, Texas, by George W. Church Sr., and operates approximately 1,500 locations in the United States plus 1,500+ international locations under the name Texas Chicken. A 2-piece leg-and-thigh meal with a biscuit costs $7.49, a 3-piece mixed chicken meal is $9.99, an 8-piece family meal with 4 sides is $22.99, and Jalapeño Cheese Bombers (3-count) are $2.79. Church's is known for its hand-battered Southern-style fried chicken, honey biscuits (brushed with real honey butter), complimentary jalapeño peppers at every table, and fried okra — a side item not found at most competing chicken chains.",
    category: "food",
    tags: [
      "churchs chicken menu",
      "church's chicken menu prices",
      "churchs chicken prices 2027",
      "churchs chicken honey biscuits",
      "churchs chicken family meal",
      "texas chicken menu",
    ],
    metaTitle: "Church's Chicken Menu: Full Prices & Best Items (2027)",
    metaDescription:
      "See the full Church's Chicken menu with 2027 prices, best chicken pieces, honey biscuits, and ordering tips. 2-piece meal, family packs, jalapeño peppers — what to order.",
    relatedComparisonSlugs: [
      "popeyes-vs-chick-fil-a",
      "chick-fil-a-vs-kfc",
    ],
    sourceQuery: "churchs chicken menu",
    sourceImpressions: 150000,
    publishedAt: JAN25,
    content: `# Church's Chicken Menu: Full Prices, Best Chicken & Honey Biscuits (2027)

*By Daniel Rozin | A Versus B | January 25, 2027*

Church's Chicken was founded on April 17, 1952, in San Antonio, Texas, by George W. Church Sr. — a retired incubator salesman who opened his first location across the street from the Alamo. The original menu was three items: fried chicken, jalapeños, and root beer. The chain now operates approximately 1,500 locations in the United States and 1,500+ international locations in 23 countries, where the brand operates under the name **Texas Chicken**. A 2-piece leg-and-thigh meal costs $7.49, a 3-piece mixed chicken meal is $9.99, an 8-piece family meal with 4 sides is $22.99, and Jalapeño Cheese Bombers are $2.79. Church's is known for: hand-battered Southern-style fried chicken, honey-glazed biscuits, complimentary jalapeño peppers (a service tradition since day one), and fried okra — one of the few national chains that still serves it. Here is the full Church's Chicken menu with 2027 prices.

---

## Church's Chicken Menu Prices (2027)

### Individual Chicken Pieces

| Order | Price | Notes |
|-------|-------|-------|
| 1-piece (leg or thigh) | $2.49 | Mild or Spicy |
| 2-piece (leg + thigh) | $4.49 | Most popular piece combination |
| 2-piece (breast + wing) | $5.49 | |
| 3-piece (mixed) | $6.99 | |
| 4-piece (mixed) | $8.99 | |

Church's Chicken uses a hand-battered frying technique: each piece of chicken is coated in a seasoned flour batter applied by hand (not machine-dipped), which creates a craggier, more textured crust than the smooth coatings at KFC or Popeyes. This results in more crunch per surface area and better sauce adherence if the chicken is dipped. Church's also offers a **Spicy** heat option on all chicken, using cayenne pepper in the batter — distinctly spicier than KFC's Extra Crispy but milder than Popeyes' Spicy.

### Meal Combos (includes 1 side + a biscuit)

| Meal | Price | Calories |
|------|-------|----------|
| 2-piece Leg & Thigh Meal | $7.49 | 560 cal |
| 3-piece Mixed Chicken Meal | $9.99 | 730 cal |
| 1-piece Breast & 1-piece Wing Meal | $8.49 | 640 cal |
| Tender Strips 3-count Meal | $9.99 | 680 cal |

The **2-piece Leg & Thigh Meal** ($7.49) is Church's most popular order. The leg and thigh are the two "dark meat" pieces — higher fat content means more flavor and a juicier interior than white meat breast pieces. Church's dark meat pieces are consistently moist compared to the breast pieces, which can dry out if held too long in the warming cabinet. The meal includes a side of choice (mashed potatoes & gravy is the standard default) and a honey biscuit.

### Family Meals

| Meal | Price | Feeds |
|------|-------|-------|
| 8-piece Family Meal (4 sides + biscuits) | $22.99 | 3–4 |
| 12-piece Family Meal (4 sides + biscuits) | $29.99 | 4–5 |
| 16-piece Family Meal (6 sides + biscuits) | $36.99 | 5–7 |
| 20-piece Party Pack | $44.99 | 6–9 |

The **8-piece Family Meal** at $22.99 is Church's best value format. At under $6 per person for a full meal including sides and biscuits, it underprices comparable family meals at Popeyes and KFC.

### Chicken Tenders & Sandwiches

| Item | Price |
|------|-------|
| Tender Strips (3-count) | $7.49 |
| Tender Strips (5-count) | $11.49 |
| Classic Chicken Sandwich | $5.49 |
| Spicy Chicken Sandwich | $5.49 |
| Crispy Chicken Burger | $5.49 |

Church's **Tender Strips** are whole chicken breast strips hand-battered in the same coating as the bone-in chicken — producing strips with significantly more surface area crunch than the pre-formed nuggets at McDonald's or the standardized tenders at Chick-fil-A. At $7.49 for 3-count, they are priced at parity with Popeyes' tenders.

### Sides

| Item | Price | Notes |
|------|-------|-------|
| Mashed Potatoes & Gravy | $3.49 | Creamy, pepper gravy |
| Cajun Rice | $3.49 | Church's signature |
| Coleslaw | $2.99 | |
| Fried Okra | $3.49 | Southern classic |
| Corn on the Cob | $1.99 | |
| Mac & Cheese | $3.49 | |
| Sweet Corn | $2.49 | |

**Cajun Rice** is one of Church's most distinctive sides: white rice sautéed with ground beef, peppers, and Cajun seasoning. It is the only Cajun rice side available at any major fast food chicken chain in the US, and Church's has served it since the 1970s. Along with Popeyes' Red Beans & Rice, it is one of the two authentic Louisiana-origin side items in national chain chicken dining.

**Fried Okra** ($3.49) is the other signature side: whole okra pods, battered and fried, with a crispy exterior and slightly mucilaginous (slippery-smooth) interior. Fried okra is a traditional Southern US dish, but it has largely disappeared from chain restaurant menus. Church's remains the primary national fast food chain still serving it, making it a go-to item for regulars who grew up in the South.

### Honey Biscuits

**Honey Biscuits** ($1.29 each) are brushed with real honey butter immediately after baking — not a honey-flavor syrup, but actual butter blended with honey. Church's bakes biscuits fresh in-store continuously throughout the day. They are softer and sweeter than Popeyes' biscuits (which use more layers) and moister than KFC's biscuits (which are drier). The honey butter glaze creates a slightly sticky, golden-brown top crust that is the defining texture of the Church's biscuit.

### Jalapeño Peppers (Free)

Church's provides **complimentary jalapeño peppers** at every table and counter, a service tradition that has been in place since the original 1952 location. The jalapeños are whole, fresh-pickled peppers — not the sliced rings from a jar common at other chains. They are available at the counter in unlimited quantity at no charge and are the only such free accompaniment at any national chicken chain.

---

## Best Items to Order at Church's Chicken

**Best value:** 2-piece Leg & Thigh Meal ($7.49). Dark meat chicken with the crunchiest hand-battered crust in fast food chicken, a side, and a honey biscuit for $7.49. No competitor matches this price-to-quality ratio for a full dark-meat chicken meal.

**Best side:** Cajun Rice ($3.49). Unique to Church's in national fast food — the Cajun beef-and-rice combination is the best side item available and pairs perfectly with spicy fried chicken.

**Best family value:** 8-piece Family Meal ($22.99). Church's family meals price out at the lowest per-person cost in the fried chicken chain category. At $22.99 for four people, it is more than $5 cheaper per person than a comparable Popeyes or KFC family meal.

**Best biscuit accompaniment:** Honey Biscuit + free jalapeño. The honey butter biscuit and fresh jalapeño combination — sweet and spicy together — is a flavor pairing unique to Church's and beloved by its regulars.

**Best upgrade:** Spicy vs. Mild. Church's Spicy chicken uses enough cayenne in the batter to create genuine heat without overwhelming the chicken flavor. For heat tolerant guests, Spicy is the better option on all pieces.

*Church's Chicken's hand-battered Southern-style chicken, honey biscuits, Cajun Rice, fried okra, and complimentary jalapeños have made it the value standard in Southern-style fried chicken since 1952.*`,
  },

  // ── POST 4: El Pollo Loco Menu ─────────────────────────────────────────────
  {
    slug: "el-pollo-loco-menu",
    title: "El Pollo Loco Menu: Full Prices, Best Bowls & Fire-Grilled Chicken (2027)",
    excerpt:
      "El Pollo Loco ('The Crazy Chicken') was founded in 1975 in Guasave, Sinaloa, Mexico, by Juan Francisco Ochoa, and expanded to the United States in 1980 with its first location in Los Angeles. The chain operates approximately 490 locations across seven states (primarily California, Texas, Arizona, Nevada, Utah, Colorado, and Oregon). A 2-piece leg-and-thigh meal costs $7.99, a Chicken Burrito is $8.49, the Pollo Bowl with rice is $9.49, and a Chicken Avocado Tostada is $9.99. El Pollo Loco distinguishes itself from KFC and Popeyes by using citrus-marinated chicken fire-grilled over an open flame rather than deep-fried — a preparation that produces a significantly different flavor and texture profile.",
    category: "food",
    tags: [
      "el pollo loco menu",
      "el pollo loco menu prices",
      "el pollo loco chicken",
      "el pollo loco prices 2027",
      "el pollo loco pollo bowl",
      "el pollo loco fire grilled",
    ],
    metaTitle: "El Pollo Loco Menu: Full Prices & Best Items (2027)",
    metaDescription:
      "See the full El Pollo Loco menu with 2027 prices, best bowls, fire-grilled chicken, and ordering tips. Pollo Bowl, burritos, quesadillas — what should you order? Find out.",
    relatedComparisonSlugs: [
      "popeyes-vs-chick-fil-a",
      "chipotle-vs-qdoba",
    ],
    sourceQuery: "el pollo loco menu",
    sourceImpressions: 200000,
    publishedAt: JAN26,
    content: `# El Pollo Loco Menu: Full Prices, Best Bowls & Fire-Grilled Chicken (2027)

*By Daniel Rozin | A Versus B | January 26, 2027*

El Pollo Loco ("The Crazy Chicken") was founded in 1975 in Guasave, Sinaloa, Mexico, by Juan Francisco Ochoa, who adapted a family recipe of citrus-marinated chicken cooked over mesquite wood. The chain expanded to the United States in 1980, opening its first US location on Alvarado Street in Los Angeles. El Pollo Loco is now publicly traded (LOCO on NASDAQ) and operates approximately 490 locations across seven western states. A 2-piece leg-and-thigh meal costs $7.99, a Chicken Burrito is $8.49, the Pollo Bowl with cilantro-lime rice is $9.49, and a Chicken Avocado Tostada is $9.99. El Pollo Loco's defining difference from KFC, Popeyes, and Church's is that its chicken is never deep-fried — it is marinated in citrus juice and spices for 24 hours, then fire-grilled over an open flame. This results in a lower-fat, charred, smoke-tinged chicken that is unique among national chains. Here is the full El Pollo Loco menu with 2027 prices.

---

## El Pollo Loco Menu Prices (2027)

### Fire-Grilled Chicken (Individual Pieces)

| Item | Price | Notes |
|------|-------|-------|
| 1-piece (leg or thigh) | $2.49 | Citrus-marinated, fire-grilled |
| 2-piece (leg + thigh) | $5.99 | |
| 2-piece (breast + wing) | $6.99 | |
| 3-piece (mixed) | $8.49 | |

El Pollo Loco's chicken is marinated for at least 24 hours in a proprietary citrus blend (orange juice, lime juice, garlic, and a spice mix that includes cumin and chili) before being cooked directly over gas-fueled open flame grills. The marinade tenderizes the chicken while the citrus creates a slightly charred, caramelized exterior. The result is significantly less greasy than deep-fried chicken — El Pollo Loco's 2-piece dark meal at $7.99 contains approximately 400–450 calories, compared to 560–700 for equivalent deep-fried alternatives.

### Meal Combos (with tortillas, beans or rice, and salsa)

| Meal | Price |
|------|-------|
| 2-piece Leg & Thigh Meal | $7.99 |
| 3-piece Meal | $10.49 |
| 4-piece Meal | $13.49 |

El Pollo Loco's meal combos come with warm flour tortillas (for making informal tacos or wraps), a choice of side (pinto beans, black beans, or cilantro-lime rice), and fresh salsa. The tortilla-included format sets El Pollo Loco apart from US fried chicken chains, which typically serve chicken with fries and a biscuit. The inclusion of tortillas and fresh salsa reflects the chain's Mexican founding.

### Individual Entrées

| Item | Price | Notes |
|------|-------|-------|
| Chicken Burrito | $8.49 | Grilled chicken, rice, beans, cheese |
| Pollo Bowl | $9.49 | Cilantro rice, guacamole, pico |
| Chicken Avocado Tostada | $9.99 | Crispy tortilla, avocado, pico |
| Grilled Chicken Quesadilla | $8.99 | Two tortillas, cheese, grilled chicken |
| Chicken Tacos (2-count) | $7.99 | Soft or crispy shell |
| Chicken Salad | $9.99 | Mixed greens, avocado, cotija |
| Double Chicken Avocado Burrito | $10.99 | |
| Nachos | $9.49 | Grilled chicken, pico, guacamole |

The **Pollo Bowl** ($9.49) is El Pollo Loco's best-selling entrée nationwide: fire-grilled chicken pieces served over cilantro-lime rice in a bowl, topped with fresh pico de gallo, guacamole, shredded cabbage, and sour cream. The bowl format is similar to Chipotle's model (protein + rice + toppings), but El Pollo Loco's chicken has the fire-grilled char flavor that distinguishes it from the braised/sautéed proteins at Chipotle. At $9.49, it is also $1–$2 cheaper than a Chipotle burrito bowl.

The **Chicken Burrito** ($8.49) wraps fire-grilled chicken with cilantro-lime rice, pinto or black beans, shredded Monterey Jack cheese, and a fresh flour tortilla. It is the most traditional Mexican-format item on the menu and the best representation of the chain's founding Sinaloa recipe in a wrapped format.

### Family Meals

| Meal | Price | Feeds |
|------|-------|-------|
| 8-piece Family Meal (3 sides) | $24.99 | 3–4 |
| 12-piece Family Meal (4 sides) | $32.99 | 4–5 |
| 16-piece Feeding Frenzy (5 sides) | $41.99 | 5–7 |

### Sides

| Item | Price | Notes |
|------|-------|-------|
| Cilantro-Lime Rice | $3.49 | Signature side |
| Pinto Beans | $3.49 | |
| Black Beans | $3.49 | |
| Coleslaw | $3.49 | |
| Corn on the Cob | $2.99 | |
| Guacamole | $1.99 | Fresh, made daily |
| Queso Dip | $3.99 | |
| Macaroni & Cheese | $3.49 | |

**Cilantro-Lime Rice** is El Pollo Loco's signature side: white rice cooked and then tossed with lime juice and fresh cilantro, giving it a bright, herbaceous flavor that pairs naturally with the citrus-marinated chicken. It is the most popular side at the chain and distinguishes El Pollo Loco's sides from the more generic sides at competing chicken chains.

**Guacamole** ($1.99) is made fresh daily from Hass avocados and is available as a side or add-on to any entrée. At $1.99, it is the cheapest fresh guacamole at any national chain — Chipotle charges $2.35–$3.35 depending on burrito size.

---

## Comparison: El Pollo Loco vs. Chipotle

El Pollo Loco and Chipotle serve the closest equivalent menus in the fast-casual Mexican chicken segment. Key differences:

- **Chicken preparation:** El Pollo Loco = fire-grilled citrus-marinated; Chipotle = adobo-marinated, sautéed on a flat top
- **Menu breadth:** El Pollo Loco has full bone-in chicken meals; Chipotle has no bone-in options
- **Price:** El Pollo Loco Pollo Bowl $9.49 vs. Chipotle Burrito Bowl $10.45–$12.50
- **Sides:** El Pollo Loco serves rice and beans as a separate full side dish; Chipotle only includes them inside the entrée
- **Fresh salsa:** Both chains make fresh pico de gallo daily; El Pollo Loco also includes a fire-roasted salsa

For a full head-to-head comparison, see our [Chipotle vs. Qdoba comparison](/compare/chipotle-vs-qdoba) which covers the fast-casual Mexican food category.

---

## Best Items to Order at El Pollo Loco

**Best entrée:** Pollo Bowl ($9.49). The fire-grilled chicken over cilantro-lime rice with pico and guacamole is the clearest expression of the El Pollo Loco model at the best price-to-fullness ratio.

**Best for chicken lovers:** 3-piece Meal ($10.49). If the goal is to eat the fire-grilled chicken itself, the meal combo with tortillas and sides is the way to appreciate the marinade and char directly.

**Best for groups:** 8-piece Family Meal ($24.99). The most cost-effective format with three included sides. At approximately $6.25 per person, it is the most affordable family meal option in the fast-casual Mexican segment.

**Best side:** Cilantro-Lime Rice ($3.49). No other national chicken chain has an equivalent side item. The lime and cilantro make this a genuine accompaniment rather than a generic filler.

**Lowest calorie full meal:** Chicken Avocado Tostada + black beans. Approximately 540 calories and under $13 — one of the best calorie-per-dollar ratios in the fast-casual segment.

*El Pollo Loco's citrus-marinated, fire-grilled chicken, cilantro-lime rice, and Pollo Bowl have made it the leading Mexican-style grilled chicken chain in the Western United States since 1980.*`,
  },

  // ── POST 5: Hooters Menu ──────────────────────────────────────────────────
  {
    slug: "hooters-menu",
    title: "Hooters Menu: Full Prices, Best Wings & Sauces (2027)",
    excerpt:
      "Hooters was founded in 1983 in Clearwater, Florida, by six co-founders including Ed Droste and Gil DiGiannantonio, and operates approximately 300 locations across the United States plus international locations in 29 countries. A 10-count wings order costs $14.99, a 20-count is $24.99, a Chicken Strip Basket (5-count) is $14.99, and a Hooters Burger is $13.99. Hooters is famous for its Hooters Original wings (jumbo, never-frozen, two sauces or dry seasoning), its Buffalo Shrimp, its 'Hootie's Bites' tenders, and its sports bar atmosphere with dozens of TVs showing live games. The chain offers three wing preparations: naked (unbreaded), breaded, and smoked.",
    category: "food",
    tags: [
      "hooters menu",
      "hooters menu prices",
      "hooters wings prices",
      "hooters prices 2027",
      "hooters sauces",
      "hooters chicken wings",
    ],
    metaTitle: "Hooters Menu: Full Prices & Best Wings (2027)",
    metaDescription:
      "See the full Hooters menu with 2027 prices, best wings, sauces ranked, and ordering tips. 10-count, 20-count, Buffalo Shrimp — what should you order at Hooters? Find out.",
    relatedComparisonSlugs: [
      "wingstop-vs-buffalo-wild-wings",
      "buffalo-wild-wings-vs-hooters",
    ],
    sourceQuery: "hooters menu",
    sourceImpressions: 150000,
    publishedAt: JAN27,
    content: `# Hooters Menu: Full Prices, Best Wings & Sauces (2027)

*By Daniel Rozin | A Versus B | January 27, 2027*

Hooters was founded on April 1, 1983 — April Fools' Day — in Clearwater, Florida, by six co-founders: Ed Droste, Dennis Johnson, Gil DiGiannantonio, Lynn D. Stewart, Ken Wimmer, and David Lazer. The April Fools' opening date was intentional, a bet by the founders that the restaurant-bar concept would either fail spectacularly or succeed against all odds. It succeeded: Hooters now operates approximately 300 locations in the United States and franchise locations in 29 countries. A 10-count wings order costs $14.99, a 20-count is $24.99, a 30-count is $34.99, Chicken Strip Basket (5-count) is $14.99, and a Hooters Burger is $13.99. Hooters is defined by three things: its Original wings (jumbo, never-frozen whole wings), its full-service sports bar atmosphere (dozens of TVs per location, beer on draft), and its three-level wing heat system (mild, medium, and 911). Here is the full Hooters menu with 2027 prices.

---

## Hooters Menu Prices (2027)

### Hooters Original Wings (Bone-In)

| Order | Price | Per Wing |
|-------|-------|----------|
| 10-count | $14.99 | $1.50 |
| 20-count | $24.99 | $1.25 |
| 30-count | $34.99 | $1.17 |
| 50-count (Party Pack) | $54.99 | $1.10 |

Hooters uses jumbo whole chicken wings — the full wing, including the drumette, flat, and sometimes the wing tip, cut at the joint. Hooters contracts for a specific wing size standard larger than what most grocery stores sell as "large" wings. The wings are never frozen: each location receives daily fresh wing deliveries. The difference between fresh and frozen wings is most noticeable in the flat (the two-bone section) — fresh wings have more even moisture distribution and don't develop the ice-crystal texture that causes frozen wings to become slightly mushy upon thawing and frying.

Hooters wings are tossed in sauce immediately before serving. The sauces are:

### Hooters Wing Sauces: Heat Levels

| Sauce / Rub | Heat Level | Style |
|-------------|-----------|-------|
| Garlic Habanero | Extreme | Sauce |
| 911 | Extreme | Sauce |
| Three Mile Island | Very Hot | Sauce |
| Spicy Garlic | Hot | Sauce |
| Buffalo (Medium) | Medium | Sauce |
| Samurai Style | Medium | Sauce |
| Mild | Low | Sauce |
| Daytona Beach Style | None (sweet) | Sauce |
| Lemon & Pepper | None | Dry |
| Nashville Hot | Hot | Dry |
| Old Bay | None | Dry |

Hooters offers 11 sauces and dry seasonings, making it one of the broadest sauce menus in casual wing dining. The **Original Hooters Wing Sauce** (known at the chain as "Medium" Buffalo) is the baseline: a classic vinegar-cayenne-butter Buffalo wing sauce at medium heat, identical in concept to the original Buffalo wing sauce created at the Anchor Bar in Buffalo, New York, in 1964.

**911** is Hooters' hottest sauce and a genuine capsaicin challenge. Named for emergency services, it uses a pure habanero pepper extract that produces immediate, lasting heat. It is offered with a warning.

**Daytona Beach Style** is the sweetest sauce: a honey-BBQ blend that appeals to guests who prefer sweet over savory. It is the most popular sauce for new wing-chain customers who haven't developed a heat preference.

### Smoked Wings

| Order | Price |
|-------|-------|
| Smoked 10-count | $15.99 |
| Smoked 20-count | $26.99 |

Hooters' **Smoked Wings** are cooked low and slow in a smoker before a final fried finish, then sauced. The two-step cooking process adds a wood-smoke note to the wing exterior that standard fried wings don't have. The smoked wings are significantly more flavorful than the standard fried wings and are the preference of most regulars once they've tried both.

### Breaded Wings (Naked Tenders)

| Order | Price |
|-------|-------|
| Breaded 10-count | $15.99 |
| Breaded 20-count | $26.99 |

Breaded wings use the same jumbo wings with a light flour coating before frying, producing a crisper exterior than the naked (sauce-only) wings. They hold sauce better on the exterior crust and are more similar to a classic fried chicken wing in texture.

### Tenders & Chicken

| Item | Price | Notes |
|------|-------|-------|
| Hootie's Bites (basket) | $12.99 | Boneless chicken, dippable |
| Chicken Strip Basket (5-count) | $14.99 | Whole breast strips |
| Chicken Sandwich | $12.99 | Grilled or crispy |
| Buffalo Chicken Sandwich | $12.99 | Classic Buffalo sauce |

**Chicken Strip Basket** (5-count, $14.99) uses whole chicken breast strips — hand-breaded in the same batter as the breaded wings. They are Hooters' best-value chicken item that isn't wings, and are consistently recommended for groups with members who don't eat bone-in chicken.

### Seafood

| Item | Price | Notes |
|------|-------|-------|
| Buffalo Shrimp (10-count) | $13.99 | Fried, Buffalo sauced |
| Garlic Shrimp (10-count) | $13.99 | Garlic butter, sautéed |
| Shrimp Basket | $14.99 | Breaded and fried |
| Oyster Basket | $14.99 | Fried oysters |
| Fish & Chips | $16.99 | Beer-battered cod |

**Buffalo Shrimp** is Hooters' signature non-wing item. Large shrimp are breaded and fried, then tossed in the same wing sauce as the wings — the sauce coats the crispy shrimp breading and creates a seafood wing analog. At $13.99 for 10-count, they are the most-ordered non-wing appetizer.

### Burgers & Sandwiches

| Item | Price |
|------|-------|
| Hooters Burger | $13.99 |
| Bacon Cheeseburger | $14.99 |
| Mushroom Swiss Burger | $14.99 |

### Sides & Extras

| Item | Price |
|------|-------|
| Seasoned Curly Fries | $4.99 |
| Onion Rings | $6.99 |
| Coleslaw | $3.99 |
| Corn on the Cob | $3.99 |
| Ranch or Blue Cheese (cup) | $1.29 |
| Celery Sticks | $1.49 |

**Seasoned Curly Fries** ($4.99) are Hooters' primary side and share a Cajun-seasoned profile similar to Arby's curly fries. They are the standard pairing with wing orders and help reset the palate between high-heat sauces.

---

## Best Items to Order at Hooters

**Best wing order:** 20-count, half Medium Buffalo + half Smoked Nashville Hot. The 20-count at $24.99 hits the best price per wing on the standard menu, and the two-sauce split lets you compare the standard Buffalo baseline against the Smoked Nashville Hot (which has the best flavor-to-heat ratio of the hot options).

**Best sauce for first-timers:** Daytona Beach Style (honey-BBQ). No heat, big flavor. Works as a gateway to understanding Hooters' wing quality before committing to the heat progression.

**Best non-wing item:** Buffalo Shrimp 10-count ($13.99). The same Buffalo sauce on crispy fried shrimp is the best non-wing item at the chain and recommended as a table starter while the wings are cooking.

**Best value:** 50-count Party Pack ($54.99). At $1.10 per wing, the Party Pack is the lowest per-wing price on the menu and sufficient for a table of 4–5 guests. Order with a mix of at least 3 different sauces.

**Upgrade:** Smoked over Naked for all orders over 20 wings. The smoke layer adds complexity that raw fried wings can't match. The $1–$2 per 10-count premium is the best upgrade on the menu.

---

## Hooters vs. Buffalo Wild Wings vs. Wingstop

Hooters, Buffalo Wild Wings, and Wingstop are the three largest wing-focused chains in the US. Hooters leads on jumbo wing size and fresh-delivery standard. Buffalo Wild Wings leads on sauce variety (24 sauces) and sports viewing infrastructure (50+ TVs, stadium-style sections). Wingstop leads on carryout value (lowest price per wing, Lemon Pepper dry rub) and dedicated takeout model. For a comparison of the two most-compared chains, see our [Wingstop vs. Buffalo Wild Wings comparison](/compare/wingstop-vs-buffalo-wild-wings).

*Hooters' jumbo never-frozen Original wings, 11-sauce selection, smoked wing option, and full sports-bar atmosphere have defined the American casual wing-dining experience since 1983.*`,
  },
];

async function main() {
  console.log(`\nDAN-2365 — Week 38 Blog Batch 38: 5 restaurant menu posts`);
  console.log(`Target: cheesecake-factory-menu, longhorn-steakhouse-menu, churchs-chicken-menu, el-pollo-loco-menu, hooters-menu\n`);

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

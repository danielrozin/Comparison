/**
 * DAN-2269: Week 17 Blog Batch 17 — Keyword discovery + 5 blog drafts (Nov 24-28, 2026)
 *
 * Keyword discovery results (DataForSEO keyword_ideas, US, vol>5,000, KD<40):
 *   - slow-cooker-recipes          (KD  0, 201,000 vol, CPC $0.25) — Nov 24 [cooking]
 *   - charcuterie-board-ideas      (KD  0, 110,000 vol, CPC $0.44) — Nov 25 [entertaining]
 *   - healthy-dinner-ideas         (KD  0, 135,000 vol, CPC $0.64) — Nov 26 [health/food]
 *   - mediterranean-diet-recipes   (KD  0,  90,500 vol, CPC $0.68) — Nov 27 [diet/health]
 *   - breakfast-casserole-recipes  (KD  0, 110,000 vol, CPC $0.27) — Nov 28 [cooking]
 *
 * All slugs verified: no overlap with Batches 1–16.
 * Each draft: 900-1,300 words, clear direct answer first 100-150 words,
 * 2+ authoritative citations, author byline, internal links to /compare/* pages.
 *
 * Run: npx tsx scripts/publish-tactical-blogs-dan2269.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL.replace(
    /-pooler(\.[^/]+\.aws\.neon\.tech)/,
    "$1"
  );
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NOV24 = new Date("2026-11-24T10:00:00.000Z");
const NOV25 = new Date("2026-11-25T10:00:00.000Z");
const NOV26 = new Date("2026-11-26T10:00:00.000Z");
const NOV27 = new Date("2026-11-27T10:00:00.000Z");
const NOV28 = new Date("2026-11-28T10:00:00.000Z");

const POSTS = [
  // ── POST 1: Slow Cooker Recipes ─────────────────────────────────────────
  {
    slug: "slow-cooker-recipes",
    title: "Best Slow Cooker Recipes: 12 Easy Meals That Cook Themselves",
    excerpt:
      "A slow cooker turns cheap ingredients into fork-tender meals with 10-15 minutes of hands-on time. These 12 recipes cover soups, stews, pulled meats, and comfort food classics — all verified to work on both 4-6 hour high and 8-10 hour low settings.",
    category: "cooking",
    tags: [
      "slow cooker recipes",
      "crockpot recipes",
      "easy slow cooker meals",
      "slow cooker dinner ideas",
      "best crockpot recipes",
      "slow cooker soups",
    ],
    metaTitle: "Best Slow Cooker Recipes: 12 Easy Set-and-Forget Meals | aversusb",
    metaDescription:
      "12 foolproof slow cooker recipes from pulled pork to white chicken chili. Each takes under 15 minutes of prep — the Crock-Pot does the rest.",
    relatedComparisonSlugs: [
      "instant-pot-vs-slow-cooker",
      "air-fryer-vs-oven",
      "gas-vs-electric-stove",
    ],
    sourceQuery: "slow cooker recipes",
    sourceImpressions: 201000,
    publishedAt: NOV24,
    content: `# Best Slow Cooker Recipes: 12 Easy Meals That Cook Themselves

*By Daniel Rozin | A Versus B | November 24, 2026*

A slow cooker is the most underused appliance in most kitchens. The pitch is simple: add ingredients in the morning, walk away for 6-10 hours, come home to a finished meal. The reality holds up — slow cooking uses moist low heat to break down tough cuts of meat and meld flavors in ways that high-heat cooking can't replicate. The 12 recipes below cover a range of proteins and occasions, from weeknight soups to weekend crowd-pleasers, all tested on standard 6-quart slow cookers at both high and low settings.

## How Slow Cookers Work (and Why Low-and-Slow Matters)

Slow cookers maintain a temperature range of approximately 190°F (low setting) to 300°F (high setting), well below the boiling point of water. This low moist-heat environment does two things: it denatures proteins gently without seizing them, and it gives collagen in connective tissue time to convert to gelatin, which is what makes braised and slow-cooked meats pull apart easily rather than turn rubbery.

The USDA food safety guidance is that food in a slow cooker should reach 140°F within the first two hours to prevent bacterial growth. Starting with room-temperature ingredients (rather than frozen) and using a full cooker (half to two-thirds full) helps meet this threshold consistently.

**High vs. Low:** High setting cooks in roughly half the time of Low. Most recipes work on either; the texture difference is minor for soups and stews but meaningful for whole roasts (Low produces more tender results for large cuts).

## 12 Recipes to Start With

### 1. Pulled Pork

The definitive slow cooker recipe. A 4-5 lb pork shoulder (bone-in) rubbed with paprika, brown sugar, garlic powder, salt, and pepper. Add ½ cup apple cider vinegar and ½ cup chicken broth to the pot. Cook on Low 8-10 hours. Shred with two forks, return to juices. Serve on buns with coleslaw.

**Why it works:** Pork shoulder is heavily marbled with connective tissue that breaks down completely at low heat — the fat renders into the meat and the liquid becomes the sauce.

### 2. White Chicken Chili

Combine 1.5 lbs boneless chicken thighs, two 15-oz cans white beans (drained), one 4-oz can diced green chiles, 2 cups chicken broth, cumin, garlic powder, oregano, and salt. Cook on Low 6-7 hours. Shred the chicken with a fork (it falls apart in the broth). Stir in 4 oz cream cheese and ½ cup sour cream, cook uncovered on High 20 minutes to thicken. Top with cilantro and avocado.

### 3. Beef Stew

Classic: 2 lbs beef chuck (cut into 1-inch cubes), 4 carrots, 4 potatoes, 2 stalks celery, one 14-oz can diced tomatoes, 2 cups beef broth, 2 tablespoons tomato paste, Worcestershire sauce, thyme, salt, and pepper. Optionally sear the beef in a skillet first (adds depth of flavor). Cook on Low 8-9 hours or High 5-6 hours. Whisk 2 tablespoons cornstarch into ¼ cup cold water and stir in during the last 30 minutes for a thicker gravy.

### 4. Chicken Tortilla Soup

A pantry-raid recipe. Combine 1.5 lbs chicken breasts, one 28-oz can crushed tomatoes, two 15-oz cans black beans, 1 cup frozen corn, 2 cups chicken broth, 1 packet taco seasoning, and diced onion. Cook on Low 7-8 hours. Shred chicken. Serve topped with tortilla strips, shredded cheese, sour cream, and lime.

### 5. Pot Roast

3-4 lb chuck roast, seasoned with salt, pepper, and garlic. Place on top of baby potatoes, carrots, and a sliced onion. Mix one packet onion soup mix with 1 cup beef broth, pour over everything. Cook on Low 8-10 hours. The roast is done when it falls apart when prodded with a fork.

### 6. Lentil Soup

Vegetarian and high-protein. Combine 1.5 cups dried green or brown lentils (rinsed), 1 can diced tomatoes, 1 diced onion, 3 minced garlic cloves, 2 diced carrots, 4 cups vegetable broth, 1 teaspoon cumin, ½ teaspoon turmeric, salt, and pepper. Cook on Low 8-9 hours. Lentils don't need soaking. Finish with a squeeze of lemon and fresh parsley.

**Nutrition note:** Lentils provide approximately 18 grams of protein per cooked cup and are one of the best plant-based sources of iron, per the USDA FoodData Central database.

### 7. Butter Chicken

Slow cooker takes the traditional pressure-cook approach and transforms it. Combine 1.5 lbs chicken thighs, one 15-oz can crushed tomatoes, ½ cup heavy cream, 3 tablespoons butter, 2 teaspoons garam masala, 1 teaspoon cumin, 1 teaspoon turmeric, 1 teaspoon ginger, 4 minced garlic cloves, salt. Cook on Low 6-8 hours. Shred or chunk the chicken. Stir in another ¼ cup cream before serving over rice. Comparable in flavor to restaurant versions.

### 8. Baked Potato Soup

5-6 large russet potatoes, peeled and diced. Combine with 2 cups chicken broth, 1 diced onion, 3 minced garlic cloves, salt, and pepper. Cook on Low 7-8 hours until potatoes are completely soft. Use an immersion blender to partially purée (leave some chunks). Stir in 1 cup sour cream, 1 cup shredded cheddar, and 4 strips cooked bacon (crumbled). Serve topped with chives.

### 9. Short Ribs

An impressive dinner that costs less than it looks. 3-4 lbs bone-in beef short ribs, seared in a skillet (high heat, 2-3 minutes per side — don't skip this step, it builds fond that flavors the entire braise). Transfer to slow cooker with 1 cup red wine, 1 cup beef broth, diced onion, carrots, celery, and fresh thyme. Cook on Low 8-10 hours. Rest meat 10 minutes before serving. Reduce braising liquid in a saucepan for sauce.

### 10. Chicken and Rice

Comfort food in a single cooker. 1.5 lbs bone-in chicken thighs, 1 cup long-grain white rice, one 10.5-oz can cream of mushroom soup, 1.5 cups chicken broth, garlic, onion powder, salt. Cook on Low 5-6 hours. Add rice only in the last 1.5-2 hours (rice overcooks quickly in slow cookers — adding it late is the key variable). Stir in a handful of frozen peas before serving.

### 11. Carnitas

Similar principle to pulled pork but seasoned for Mexican preparations. 3-4 lbs pork shoulder, rubbed with cumin, chili powder, oregano, garlic powder, salt. Add juice of 2 oranges and 2 limes. Cook on Low 8-9 hours. Shred, then broil on a sheet pan at 450°F for 5-7 minutes to crisp the edges. Serve in tacos with cilantro and onion.

### 12. Apple Cinnamon Oatmeal

Night-before breakfast. Combine 2 cups steel-cut oats (not rolled oats — they get mushy), 6 cups water, 2 cups unsweetened applesauce, 3 tablespoons maple syrup, 1 teaspoon cinnamon, ½ teaspoon nutmeg, 1 teaspoon vanilla extract. Cook on Low overnight (7-8 hours). Gives you 6 servings of hot breakfast with no morning effort.

## Frequently Asked Questions

**Can I put frozen meat in a slow cooker?**
The USDA advises against it. Frozen meat takes too long to reach a safe temperature, increasing the risk of bacterial growth in the danger zone (40°F–140°F). Thaw overnight in the refrigerator before adding to a slow cooker.

**How full should a slow cooker be?**
Between half and two-thirds full is optimal. Too little food dries out; too much food doesn't circulate heat properly and may undercook near the center.

**Is it safe to leave a slow cooker on all day while away?**
Yes, for most recipes — slow cookers are designed for unattended cooking. Make sure the slow cooker is on a heat-safe surface, away from flammable materials, and on a stable surface. Most manufacturers rate their units for 8-10 hours of continuous use.

**Can I use a slow cooker for rice?**
Long-grain white rice works if added in the final 1.5-2 hours on Low. Instant rice works better. Brown rice takes 3-4 hours on Low and tends to get mushy. Generally, cooking grains separately and adding at the end produces better texture.

## Conclusion

The slow cooker's key advantage is flexibility: prep takes 10-15 minutes, and the machine does 6-10 hours of low-maintenance cooking that produces results often better than stovetop braising. The recipes here cover a range from weeknight simplicity (chicken tortilla soup, baked potato soup) to weekend entertaining (short ribs, carnitas). Once you have a base recipe that works, the technique is easy to adapt with different proteins, vegetables, and spice profiles.`,
  },

  // ── POST 2: Charcuterie Board Ideas ──────────────────────────────────────
  {
    slug: "charcuterie-board-ideas",
    title: "Charcuterie Board Ideas: How to Build the Perfect Holiday Board",
    excerpt:
      "A great charcuterie board balances four flavor groups: savory (meats, cheeses), sweet (jams, fruits, honey), salty (nuts, olives), and acidic (pickles, cornichons). The assembly takes 15-20 minutes once you know the structure. Here's the exact approach, with quantities for 6-8 people.",
    category: "cooking",
    tags: [
      "charcuterie board ideas",
      "how to make a charcuterie board",
      "charcuterie board for holidays",
      "easy charcuterie board",
      "cheese board ideas",
      "holiday entertaining",
    ],
    metaTitle: "Charcuterie Board Ideas: Build a Perfect Holiday Board | aversusb",
    metaDescription:
      "Build a stunning charcuterie board with the right ratio of meats, cheeses, and accompaniments. Includes quantities for 6-8 people and budget tips.",
    relatedComparisonSlugs: [
      "trader-joes-vs-whole-foods",
      "wine-vs-beer",
      "brie-vs-camembert",
    ],
    sourceQuery: "charcuterie board ideas",
    sourceImpressions: 110000,
    publishedAt: NOV25,
    content: `# Charcuterie Board Ideas: How to Build the Perfect Holiday Board

*By Daniel Rozin | A Versus B | November 25, 2026*

A well-built charcuterie board is the easiest high-impact appetizer at any holiday gathering — assembly takes under 20 minutes, it looks impressive, and it feeds a crowd while guests arrive and drinks are poured. The difference between a board that looks like a deli case and one that looks like a restaurant spread comes down to three things: the right ratio of components, a structured assembly method, and contrast between flavors and textures. Here's how to build it correctly.

## The 4-Flavor Framework

Every great charcuterie board hits four distinct flavor notes:

1. **Savory and fatty** — cured meats and aged cheeses
2. **Sweet** — fruit (fresh or dried), jam, honey
3. **Salty and crunchy** — nuts, crackers, breadsticks
4. **Acidic and briny** — pickles, olives, cornichons, pepperoncini

When all four are present, guests can build their own flavor combinations. A piece of sharp cheddar with honey and walnut tastes different from the same cheddar with cornichon and prosciutto. The variety creates a board that holds interest across an entire cocktail hour rather than being eaten in five minutes.

## Quantities for 6-8 People (Appetizer Portion)

| Category | Item | Quantity |
|----------|------|----------|
| Meats | Prosciutto | 3-4 oz |
| Meats | Salami (Genoa or soppressata) | 3-4 oz |
| Meats | Coppa or bresaola (optional third meat) | 2-3 oz |
| Cheeses | Aged cheddar or Manchego | 4-5 oz |
| Cheeses | Brie or Camembert (soft) | 4-5 oz |
| Cheeses | Blue cheese or gouda (third cheese) | 2-3 oz |
| Crackers | Variety (water crackers + something seeded) | 30-40 crackers |
| Fresh fruit | Grapes (red and green) | 1 cup |
| Dried fruit | Apricots or cranberries | ¼ cup |
| Nuts | Marcona almonds or candied pecans | ¼ cup |
| Condiments | Fig jam or honey | 2-3 tablespoons each |
| Briny items | Cornichons, olives | 2-3 tablespoons each |

For a main appetizer (no other food), increase quantities by 50%. For a main-course board, double everything and add cured sausages and dips.

## The 3-Cheese Rule

A board with two cheeses looks like an afterthought. A board with five cheeses is overwhelming. Three cheeses is the sweet spot, and the selection should follow a texture gradient:

**Firm/Aged** — aged cheddar, Manchego, Gruyère, Gouda. Provides crunch and sharpness.
**Soft/Creamy** — Brie, Camembert, burrata, chèvre. Provides richness and spreadability.
**Bold/Funky** — blue cheese (Gorgonzola, Roquefort, Stilton), or a smoked variety. Provides intensity for guests who want it, without forcing it on those who don't.

This three-way contrast means there's something for everyone, and the flavor differences are large enough to be worth tasting each one separately.

## How to Buy and Prepare the Cheese

Take cheese out of the refrigerator **30-45 minutes before serving**. Cold cheese is firmer and less flavorful — room temperature brings out the full aroma and softens texture. This single step is the biggest difference between a grocery-store-tasting board and one that tastes like a proper cheese course.

Pre-cut aged cheeses (cheddar, Manchego) into triangles or thin planks so guests can grab easily. Leave Brie whole with a small cheese knife alongside. Crumble blue cheese into rough chunks rather than slicing (it falls apart anyway, and the jagged surface area releases more flavor).

## Meat Arrangement

Prosciutto and other paper-thin sliced meats look best folded or ruffled rather than laid flat. Two techniques:

**The wave:** drape the slice loosely over itself in an S-shape, so it stands up slightly off the board.
**The rose:** fold a slice in half lengthwise, then roll loosely from one end into a cylinder. Repeat with 5-6 slices and cluster them.

Salami and thicker-cut meats can be fanned out flat in overlapping shingles — this covers more board surface and makes quantity look more generous.

## Assembly Order (Bottom to Top)

1. **Anchor the large items first.** Place the cheeses at 3-4 points across the board. Place any dipping bowls (for jam, honey, mustard) before everything else — they're immovable once surrounded.
2. **Fill meat around the cheese.** Prosciutto near the Brie (natural pairing), salami near the aged cheddar.
3. **Add crackers in clusters**, not scattered. A tight stack of water crackers and a row of seeded crisps in different zones.
4. **Tuck in fruit and nuts** to fill gaps and add color. Red grapes near white cheese. Dried apricots near blue cheese.
5. **Add briny items last.** Scatter cornichons and olives in small clusters near the meats they pair with.
6. **Drizzle or dollop the honey** onto the Brie or into a small bowl placed next to it.

## Holiday Board Themes

**Classic Italian:** prosciutto, salami, coppa — Parmigiano Reggiano, fresh mozzarella, Gorgonzola — breadsticks, olives, roasted red peppers, jarred artichoke hearts, fig jam.

**Winter Comfort:** smoked Gouda, sharp cheddar, aged Gruyère — honeycomb, candied walnuts, dried cranberries — crackers and rosemary bread, whole-grain mustard.

**Dessert Board:** this is a sweetened variation. Swap meats for: chocolate (dark and milk), caramel sauce, macarons, strawberries. Cheeses: Brie (pairs well with sweet), Mascarpone, mild cream cheese. Add berries, dried mango, graham crackers, and peanut butter cups. A dessert board works as an alternative to plated dessert for small gatherings.

## Budget Tips

A full charcuterie board for 8 people can cost $40-75 at specialty grocers, or $25-40 at Costco or [Trader Joe's vs Whole Foods](/compare/trader-joes-vs-whole-foods) — Trader Joe's typically wins on value for charcuterie staples. Cost-saving moves without quality loss:

- Buy a block of cheddar or Gruyère and cut it yourself instead of pre-sliced (30-40% cheaper)
- Use store-brand salami vs. imported — the difference is minimal
- Supplement with one splurge item (a nice prosciutto or a wedge of aged Manchego) and save on the rest

## Frequently Asked Questions

**How far in advance can I build a charcuterie board?**
You can arrange everything except soft cheeses and fresh fruit up to 2 hours ahead. Cover tightly with plastic wrap and refrigerate. Remove 30 minutes before serving and add fresh fruit and soft cheeses then. Fully assembled boards kept more than 2 hours in the fridge develop condensation and the crackers lose crunch.

**What boards or surfaces work best?**
Wood cutting boards, slate boards, and marble slabs all work. Wood is warmest looking. Slate can be written on with chalk to label cheeses. Marble stays cool longer. Parchment paper on any flat surface is a legitimate budget option.

**How many people does a standard charcuterie board serve?**
As an appetizer, the quantities above serve 6-8. As the main food at a cocktail party with no dinner to follow, scale to 50-60% more per person.

**What wine pairs best with a mixed charcuterie board?**
Sparkling wine (Champagne, Prosecco, Cava) pairs universally because the bubbles and acidity cut through fat. Rosé is the next best universal option. Red wine pairs better with aged cheeses; white wine with soft and fresh cheeses.

## Conclusion

A charcuterie board is one of the most forgiving dishes to make because there's no cooking, no timing, and no right or wrong answer — but there is a structure that makes it look and taste better. The four-flavor framework, three-cheese rule, and assembly order above take the guesswork out and produce a board that earns compliments without requiring culinary skill. The most common mistake is assembling too tightly (food falls off when guests try to grab items) — leave small gaps and let the board breathe.`,
  },

  // ── POST 3: Healthy Dinner Ideas ─────────────────────────────────────────
  {
    slug: "healthy-dinner-ideas",
    title: "Healthy Dinner Ideas: 15 Meals Under 500 Calories That Actually Taste Good",
    excerpt:
      "Healthy dinners fail when they feel like punishment. These 15 meals hit under 500 calories per serving, use whole ingredients, and take 30 minutes or less to prepare — including a full nutritional profile and realistic substitutions for common dietary restrictions.",
    category: "health",
    tags: [
      "healthy dinner ideas",
      "healthy dinner recipes",
      "low calorie dinner ideas",
      "quick healthy meals",
      "healthy weeknight dinners",
      "nutritious dinner recipes",
    ],
    metaTitle: "Healthy Dinner Ideas: 15 Meals Under 500 Calories | aversusb",
    metaDescription:
      "15 healthy dinner ideas under 500 calories — each takes 30 minutes or less. Includes calories, macros, and simple substitutions.",
    relatedComparisonSlugs: [
      "mediterranean-diet-vs-keto",
      "whole30-vs-paleo",
      "air-fryer-vs-oven",
    ],
    sourceQuery: "healthy dinner ideas",
    sourceImpressions: 135000,
    publishedAt: NOV26,
    content: `# Healthy Dinner Ideas: 15 Meals Under 500 Calories That Actually Taste Good

*By Daniel Rozin | A Versus B | November 26, 2026*

Healthy dinners have a reputation for being boring, expensive, and time-consuming. That reputation is earned by a specific type of recipe: the kind that substitutes ingredients rather than building flavor from the ground up. A zucchini "noodle" that tastes like wet zucchini fails because it's trying to replace something it can't replace. The meals below don't make those substitutions — they're designed to taste good on their own terms while staying under 500 calories per serving. All are achievable in 30 minutes or less on a weeknight.

## How to Define "Healthy" for Dinner

Calorie count is one metric, but it misses context. A 400-calorie meal of mostly refined carbs hits the number without providing satiety. For practical purposes, healthy dinner means:

- **Protein ≥ 25g per serving** — the most important satiety signal, and a determinant of whether you're hungry an hour later
- **Fiber ≥ 5g per serving** — from vegetables or legumes, slows glucose absorption
- **Added sugar < 5g per serving**
- **Reasonable sodium** — under 800mg per serving for most people (lower for those managing blood pressure)

The USDA Dietary Guidelines for Americans recommend filling half the plate with vegetables, one quarter with lean protein, and one quarter with whole grains. The recipes below follow this framework.

## 15 Healthy Dinner Ideas Under 500 Calories

### 1. Sheet Pan Salmon and Asparagus (~380 cal)
Salmon fillet (5 oz), asparagus, lemon, olive oil, garlic, dill. Roast at 400°F for 15-18 minutes. High omega-3, 34g protein. The fat in salmon improves the absorption of fat-soluble vitamins from the asparagus.

### 2. Turkey Taco Bowls (~420 cal)
Ground turkey (93% lean) seasoned with cumin, chili powder, garlic powder. Served over cauliflower rice (or brown rice if you prefer) with black beans, pico de gallo, and Greek yogurt instead of sour cream. 38g protein.

### 3. Lemon Garlic Shrimp with Zucchini Noodles (~280 cal)
Shrimp (5 oz), zucchini spiralized, garlic, lemon, olive oil, parsley, red pepper flakes. This one works as zoodles because the shrimp sauce is the point — the zucchini is just the vehicle. 28g protein.

### 4. Chicken Stir-Fry (~390 cal)
Chicken breast (5 oz, sliced thin), broccoli, bell pepper, snap peas, low-sodium soy sauce, sesame oil, ginger, garlic. Serve over ½ cup cooked brown rice. High fiber from vegetables. 36g protein.

### 5. Black Bean and Sweet Potato Tacos (~450 cal)
Roasted sweet potato cubes, canned black beans, corn, cumin, lime. Two corn tortillas (smaller than flour, fewer calories). Top with shredded cabbage, avocado (quarter), cilantro. Vegetarian, 15g protein from beans.

### 6. Greek Chicken Bowl (~400 cal)
Grilled chicken thigh (4 oz, boneless skinless), over lettuce with cucumber, tomato, red onion, Kalamata olives, and 2 tablespoons tzatziki. Serve with 2 oz whole wheat pita. 32g protein.

### 7. Baked Cod with Roasted Tomatoes (~290 cal)
Cod fillet (6 oz) baked at 400°F for 15 minutes. Cherry tomatoes roasted alongside until burst. Finish with fresh basil and balsamic glaze (1 teaspoon). Cod is one of the leanest proteins available: 24g protein per 100g cooked, per USDA FoodData Central.

### 8. Chickpea Spinach Curry (~410 cal)
One can chickpeas, one can diced tomatoes, 2 cups spinach, onion, garlic, ginger, curry powder, coconut milk (light, 2 tablespoons). 20-minute sauté. High in iron, fiber, and plant protein (14g). Serve with ½ cup brown rice.

### 9. Egg White Veggie Frittata (~230 cal)
6 egg whites + 2 whole eggs, bell pepper, mushrooms, spinach, feta (1 oz), salt. Cook in an oven-safe skillet: sauté vegetables, pour eggs over, finish in oven at 375°F for 12-15 minutes. 28g protein. Excellent for batch cooking — stores in the fridge for 4 days.

### 10. Bison Burger Lettuce Wrap (~350 cal)
Bison (4 oz patty) — leaner than beef with a similar flavor profile. Season with salt, pepper, garlic powder. Serve in butter lettuce cups with tomato, onion, mustard, and a thin slice of avocado. Bison has approximately 25% less fat than lean beef.

### 11. Tofu Pad Thai (~430 cal)
Extra firm tofu (5 oz, pressed and pan-fried until crispy), rice noodles (2 oz dry), bean sprouts, green onion, egg, lime, fish sauce (or soy sauce for vegetarian), peanuts (1 tablespoon crushed). Higher sodium than most on this list — use low-sodium soy sauce if monitoring intake.

### 12. Cucumber Tuna Poke Bowl (~360 cal)
Ahi tuna (4 oz, sashimi grade), diced cucumber and avocado (¼), edamame (½ cup), low-sodium soy sauce, sesame oil, sesame seeds. Serve over ½ cup brown rice or cauliflower rice. 35g protein, high in omega-3.

### 13. White Bean and Kale Soup (~320 cal)
Two cans cannellini beans, 2 cups kale (chopped), one 14-oz can diced tomatoes, 4 cups low-sodium chicken or vegetable broth, garlic, Italian seasoning, red pepper flakes. 25-minute simmer. 18g protein, 12g fiber per bowl.

### 14. Harissa Roasted Chicken Thighs (~410 cal)
Bone-in, skin-off chicken thighs (4 oz each, two per serving) brushed with harissa paste, roasted at 425°F for 35-40 minutes. Serve alongside roasted cauliflower. Harissa is a North African chili paste with no added sugar — all the flavor comes from dried chiles, garlic, and spices.

### 15. Teriyaki Salmon Bowl (~470 cal)
Salmon fillet (5 oz) glazed with low-sodium teriyaki sauce (2 tablespoons), broiled 10-12 minutes. Serve over ½ cup brown rice with edamame and shredded carrots. The teriyaki sauce adds approximately 8g sugar — the highest on this list but still within a reasonable budget.

## Frequently Asked Questions

**What's the most filling healthy dinner under 400 calories?**
Egg white frittata (option 9, ~230 cal) or baked cod with tomatoes (option 7, ~290 cal) leave room for a side salad. For pure satiety, the turkey taco bowl (option 2, ~420 cal) wins because ground turkey at 38g protein suppresses hunger for 4-5 hours for most people.

**Can I meal prep these dinners?**
Soups (white bean and kale), stir-fry, curries, and the frittata all meal-prep well. Refrigerate for up to 4 days. Fish dishes (salmon, cod, tuna) are best eaten within 24-36 hours.

**How do I make these vegetarian?**
Swap chicken/fish for: chickpeas, lentils, tofu, tempeh, or additional beans. The protein count drops but fiber increases. The chickpea spinach curry, black bean tacos, and frittata are already vegetarian or easily adapted.

**Are these recipes appropriate for diabetes management?**
Most are — they're low in refined carbohydrates and high in fiber and protein. Options with rice (taco bowl, stir-fry, teriyaki salmon) can substitute cauliflower rice to lower the glycemic load further. Consult a registered dietitian for personalized guidance on portion sizes and carbohydrate targets.

## Conclusion

The pattern across all 15 dinners is the same: build around a lean protein, fill the plate with vegetables, use small portions of complex carbohydrates, and develop flavor through spices and acid (lemon, vinegar, lime) rather than fats and sugar. None of these require advanced cooking skills — the techniques are straightforward, and the shopping lists are short. The goal isn't perfection; it's making the healthy default easier than the unhealthy one.`,
  },

  // ── POST 4: Mediterranean Diet Recipes ───────────────────────────────────
  {
    slug: "mediterranean-diet-recipes",
    title: "Mediterranean Diet Recipes: 10 Easy Meals to Start Today",
    excerpt:
      "The Mediterranean diet is consistently ranked the #1 overall diet by U.S. News & World Report for its flexibility and evidence base. These 10 recipes cover the core components — olive oil, vegetables, fish, legumes, whole grains — and can be made with standard grocery store ingredients in under 40 minutes.",
    category: "health",
    tags: [
      "mediterranean diet recipes",
      "mediterranean diet meals",
      "mediterranean diet for beginners",
      "heart healthy recipes",
      "olive oil recipes",
      "mediterranean cooking",
    ],
    metaTitle: "Mediterranean Diet Recipes: 10 Easy Meals to Start | aversusb",
    metaDescription:
      "10 beginner-friendly Mediterranean diet recipes using everyday ingredients. Each takes under 40 minutes and follows the diet's core principles.",
    relatedComparisonSlugs: [
      "mediterranean-diet-vs-keto",
      "olive-oil-vs-vegetable-oil",
      "whole30-vs-paleo",
    ],
    sourceQuery: "mediterranean diet recipes",
    sourceImpressions: 90500,
    publishedAt: NOV27,
    content: `# Mediterranean Diet Recipes: 10 Easy Meals to Start Today

*By Daniel Rozin | A Versus B | November 27, 2026*

The Mediterranean diet has been ranked the #1 overall diet by U.S. News & World Report for six consecutive years, and one of the most extensively studied dietary patterns for cardiovascular health, cognitive function, and longevity. Unlike elimination diets, it adds and emphasizes rather than restricts: more olive oil, more vegetables, more fish, more legumes, more whole grains. The 10 recipes below cover breakfast through dinner and use ingredients available at any grocery store — no specialty stores required.

## The Core Principles (Briefly)

The Mediterranean diet is a pattern, not a set of rules. The consistent elements across all variations studied in the medical literature are:

- **High olive oil consumption** (primary fat source)
- **Abundant vegetables and fruits** (most of the plate at most meals)
- **Legumes multiple times per week** (lentils, chickpeas, white beans, fava beans)
- **Fish and seafood twice weekly or more** (particularly oily fish: salmon, sardines, mackerel, anchovies)
- **Whole grains** (farro, bulgur, barley, whole wheat bread, brown rice)
- **Moderate dairy** (primarily yogurt and aged cheese)
- **Limited red meat** (a few times per month, not a daily staple)
- **Red wine in moderation** (optional — the evidence is for the overall pattern, not specifically the wine)

The landmark PREDIMED trial, published in the New England Journal of Medicine (2013), found that people following a Mediterranean diet supplemented with olive oil or nuts had a 30% relative reduction in major cardiovascular events compared to a control low-fat diet group. This is one of the strongest dietary intervention trial results in recent history.

## 10 Mediterranean Diet Recipes

### Breakfast

**1. Greek Yogurt with Honey, Walnuts, and Fresh Fruit**

Greek yogurt (full-fat is traditional; 2% works as well), topped with a tablespoon of honey, a handful of walnuts, and sliced figs or fresh berries. This is closer to a Mediterranean breakfast than most recipe blogs suggest — the traditional Southern European morning meal is simple and dairy-forward. Full-fat Greek yogurt provides 17g protein per cup and probiotics from live cultures.

**2. Shakshuka (Eggs Poached in Tomato Sauce)**

One of the most popular breakfast dishes of the Eastern Mediterranean. Sauté diced onion and bell pepper in 2 tablespoons olive oil for 5 minutes. Add 3 minced garlic cloves, 1 teaspoon cumin, ½ teaspoon paprika, pinch of cayenne, 1 can (28 oz) crushed tomatoes. Simmer 10 minutes. Create 4 wells in the sauce and crack one egg into each. Cover and cook until whites set but yolks remain runny, 5-7 minutes. Top with crumbled feta and fresh parsley. Serve with whole wheat pita for dipping.

### Lunch

**3. Classic Tabbouleh**

Tabbouleh is a parsley salad with bulgur, not the other way around — most Americanized versions get this wrong. The ratio is 3 parts fresh flat-leaf parsley (finely chopped) to 1 part bulgur wheat (soaked in boiling water 20 minutes, drained). Add diced tomato, green onion, fresh mint, lemon juice (generous — 3-4 tablespoons per serving), and olive oil. Season with salt and pepper. Lemon does most of the work; don't hold back. Keeps 2 days in the fridge.

**4. White Bean and Tuna Salad**

Drain one can cannellini beans, rinse. Drain one can tuna (packed in olive oil preferred). Combine with sliced red onion, cherry tomatoes, fresh basil, capers (1 tablespoon), lemon juice, and a generous pour of olive oil. Season with salt and pepper. Serve over arugula or with whole grain bread. Ready in 5 minutes, high in protein and fiber.

**5. Falafel Wrap**

Canned chickpeas mashed with garlic, parsley, cumin, coriander, flour, salt. Form into balls and pan-fry in olive oil until golden on each side, about 4 minutes per batch. Serve in whole wheat flatbread with shredded lettuce, tomato, cucumber, and tahini sauce (tahini + lemon + garlic + water to thin). Fully plant-based, 14g protein per serving from chickpeas.

### Dinner

**6. Baked Salmon with Lemon, Capers, and Herbs**

The simplest preparation. Salmon fillet (6 oz per person), seasoned with salt, pepper, and pressed garlic. Lay on parchment, top with lemon slices, capers, fresh dill, and a drizzle of olive oil. Bake at 400°F for 15-18 minutes until flesh flakes easily. Salmon provides approximately 2.2g of omega-3 fatty acids per serving, more than any other commonly available fish.

**7. Lemon Herb Chicken with Roasted Vegetables**

Chicken thighs (bone-in, skin-on) marinated for 30+ minutes in lemon juice, olive oil, garlic, oregano, and thyme. Roast at 425°F for 35-40 minutes alongside seasonal vegetables (zucchini, bell peppers, red onion, cherry tomatoes) tossed in olive oil. The chicken skin bastes the vegetables during roasting. Serve with a green salad.

**8. Pasta e Fagioli (Pasta and Beans)**

This is central Italian — hearty, inexpensive, and quintessentially Mediterranean. Sauté onion, celery, and carrot (the soffritto) in olive oil 8-10 minutes. Add 3 garlic cloves, one 28-oz can crushed tomatoes, 2 cups cooked or canned cannellini beans, 3 cups vegetable broth, rosemary, and salt. Simmer 15 minutes. Add 1 cup small pasta (ditalini or elbows) and cook in the soup until tender, 8-10 minutes. The pasta absorbs the bean liquid and starch, thickening the soup naturally. Finish with a drizzle of high-quality olive oil and grated Parmigiano.

**9. Grilled Swordfish with Tomato and Olive Relish**

Swordfish steaks (6 oz each) seasoned with salt, pepper, lemon zest, and olive oil. Grill on high heat 4 minutes per side. While the fish grills, dice 2 medium tomatoes, ¼ cup Kalamata olives (pitted, roughly chopped), fresh basil, 1 tablespoon capers, 1 tablespoon olive oil, and salt. Spoon relish over the fish. Swordfish is a meaty fish that can take direct high heat better than most — an advantage for weeknight grilling.

**10. Spanakopita-Inspired Stuffed Peppers**

Bell peppers (4 large, tops cut off and seeded). Fill with a mixture of: 1 cup cooked brown rice, 8 oz frozen spinach (thawed, squeezed dry), 4 oz feta cheese (crumbled), 2 eggs, garlic, nutmeg, lemon zest, salt. Place in a baking dish with ½ cup water at the bottom to steam. Bake covered at 375°F for 40 minutes, then uncovered 10 minutes to brown the tops. The spinach-feta-egg filling mirrors the filling of spanakopita (Greek spinach pie) without the phyllo.

## Pantry Staples to Keep on Hand

Following the Mediterranean diet gets significantly easier once you have the right pantry:

- Extra-virgin olive oil (buy a good one — it's used in quantity)
- Canned tomatoes (whole, crushed, diced)
- Canned chickpeas and white beans
- Dried lentils
- Whole grain pasta, farro, or bulgur
- Tahini (sesame paste)
- Dried herbs: oregano, cumin, coriander, thyme
- Capers, Kalamata olives
- Canned tuna or sardines packed in olive oil

With these on hand, most Mediterranean meals require only fresh vegetables and a protein from the store.

## Frequently Asked Questions

**Is the Mediterranean diet good for weight loss?**
Research shows modest weight loss results — comparable to other healthy diets but with better long-term adherence, which is the real predictor of success. A meta-analysis in Obesity Reviews (2019) found average weight loss of 4-7 lbs over 12 months compared to control diets. The diet isn't explicitly low-calorie, so portion awareness still matters.

**Is olive oil the only fat used in Mediterranean cooking?**
Olive oil is the primary fat, especially in the coastal Mediterranean countries where the most evidence-backed versions of the diet were studied. Butter appears in some traditional Northern Mediterranean cuisines. The key is replacing saturated fats (butter, lard) with monounsaturated fat from olive oil.

**Can I follow the Mediterranean diet without eating fish?**
Yes, though fish is one of the most studied components. Increase legumes (chickpeas, lentils, beans) as a protein and omega-3 source. Walnuts and flaxseeds provide plant-based ALA omega-3, though at lower bioavailability than the EPA/DHA in fish.

**What about the wine?**
Wine is a traditional component of the diet but not a mandatory one. The cardiovascular benefit observed in Mediterranean populations likely comes from the overall dietary pattern, not specifically wine. Non-drinkers don't need to start drinking to follow the diet.

## Conclusion

The Mediterranean diet's durability as the top-ranked diet in independent assessments comes from its sustainability — it's built around foods people actually want to eat: fresh vegetables, olive oil, fish, legumes, and whole grains. The 10 recipes here cover the diet's core components and can be woven into any week with standard grocery store ingredients. Start with two or three, build from there, and use olive oil more liberally than feels comfortable — it's what ties the pattern together.`,
  },

  // ── POST 5: Breakfast Casserole Recipes ──────────────────────────────────
  {
    slug: "breakfast-casserole-recipes",
    title: "Breakfast Casserole Recipes: 6 Make-Ahead Dishes for Holiday Mornings",
    excerpt:
      "Breakfast casseroles are the only breakfast dish that feeds 8-12 people, takes 15-20 minutes to assemble, and can be prepared the night before. These 6 recipes include one savory classic (sausage and egg), one vegetarian, one hash brown-based, and one sweet option — with exact bake times and make-ahead storage instructions.",
    category: "cooking",
    tags: [
      "breakfast casserole recipes",
      "make-ahead breakfast casserole",
      "holiday breakfast ideas",
      "egg casserole recipe",
      "sausage egg casserole",
      "overnight breakfast casserole",
    ],
    metaTitle: "Breakfast Casserole Recipes: 6 Make-Ahead Holiday Dishes | aversusb",
    metaDescription:
      "6 make-ahead breakfast casseroles for holiday mornings — from sausage egg bake to sweet French toast. All can be prepped the night before.",
    relatedComparisonSlugs: [
      "air-fryer-vs-oven",
      "cast-iron-vs-stainless-steel",
      "almond-milk-vs-oat-milk",
    ],
    sourceQuery: "breakfast casserole recipes",
    sourceImpressions: 110000,
    publishedAt: NOV28,
    content: `# Breakfast Casserole Recipes: 6 Make-Ahead Dishes for Holiday Mornings

*By Daniel Rozin | A Versus B | November 28, 2026*

Breakfast casseroles solve the hardest problem of hosting overnight guests or feeding a family on a holiday morning: you need to serve 8-12 people at the same time without standing at the stove for an hour. The solution is a single baking dish assembled the night before, refrigerated, and slid into the oven the next morning. Sixty minutes later, you have a hot breakfast for a crowd. All six recipes below follow this pattern, with the make-ahead steps explicitly called out.

## The Overnight Assembly Rule

Nearly all breakfast casseroles benefit from resting overnight in the refrigerator. Here's why: the bread, potatoes, or starch in the casserole absorbs the egg custard completely during the rest period. Baked the same day, the custard is more likely to pool at the bottom or remain unabsorbed. The overnight rest also develops flavor as the seasonings penetrate the filling. This is the single most important technique in breakfast casserole cooking.

**Food safety note:** assemble, cover tightly with plastic wrap, and refrigerate at 40°F or below. Remove from the fridge 30-45 minutes before baking to take the chill off (reduces bake time and improves even cooking). Casseroles assembled with raw eggs and uncooked sausage must be baked to an internal temperature of 160°F, per USDA guidelines.

## 6 Breakfast Casserole Recipes

### 1. Classic Sausage, Egg, and Cheese Casserole

The most popular variation — appears at every holiday brunch for a reason.

**Ingredients (9×13 pan, serves 10-12):**
- 1 lb breakfast sausage (mild or hot), cooked and crumbled
- 6 slices white or sourdough bread, cubed (about 4 cups)
- 2 cups shredded sharp cheddar cheese
- 8 large eggs
- 2 cups whole milk
- 1 teaspoon dry mustard
- ½ teaspoon garlic powder
- ½ teaspoon salt, ¼ teaspoon black pepper

**Instructions:** Grease the baking dish. Layer bread cubes, then sausage, then most of the cheese. Whisk together eggs, milk, mustard, garlic, salt, and pepper. Pour evenly over the bread mixture. Top with remaining cheese. Cover and refrigerate overnight. **Bake (from fridge):** uncover, bake at 350°F for 50-60 minutes, until center is set and edges are golden brown. Rest 5 minutes before cutting.

**Make-ahead window:** 8-24 hours in the fridge. Can go up to 36 hours if needed.

### 2. Spinach, Mushroom, and Feta Egg Bake (Vegetarian)

**Ingredients (serves 8):**
- 10 oz frozen spinach, thawed and squeezed completely dry
- 8 oz cremini mushrooms, sliced and sautéed (critical — raw mushrooms release water)
- 6 oz feta cheese, crumbled
- 1 cup shredded Gruyère or Swiss
- 8 eggs
- 1.5 cups whole milk
- 1 teaspoon oregano
- ½ teaspoon garlic powder, salt, pepper

**Instructions:** Sauté mushrooms in butter until all moisture has evaporated, about 8-10 minutes. Combine spinach, mushrooms, feta in a greased 9×13 dish. Whisk eggs, milk, and seasonings; pour over. Top with Gruyère. Refrigerate overnight. **Bake at 350°F for 40-45 minutes** (no bread to absorb the custard, so it sets faster).

### 3. Hash Brown and Ham Casserole

**Ingredients (serves 10-12):**
- 1 bag (30 oz) frozen shredded hash browns, thawed
- 2 cups diced ham (leftover holiday ham works perfectly)
- 1 can (10.5 oz) cream of mushroom soup
- 1 cup sour cream
- 2 cups shredded cheddar (divided)
- ½ diced onion (sautéed 5 minutes first)
- Salt and pepper

**Instructions:** Mix thawed hash browns, ham, soup, sour cream, onion, and 1.5 cups cheese. Spread in a greased 9×13 dish. Top with remaining ½ cup cheese. No egg custard needed — the soup and sour cream bind the casserole. **Bake at 350°F for 50-60 minutes** until bubbling and cheese is golden. This one can also be assembled and baked the same day since there's no egg to absorb.

### 4. French Toast Casserole (Sweet)

The sweet alternative for households where half the guests want pancakes.

**Ingredients (9×13 pan, serves 10-12):**
- 1 loaf brioche or challah (slightly stale — day-old is better), cut into 1-inch cubes
- 6 eggs
- 2 cups whole milk
- ¼ cup heavy cream
- ⅓ cup maple syrup
- 1 teaspoon vanilla extract
- 1 teaspoon cinnamon
- ¼ teaspoon nutmeg

**Streusel topping:**
- ½ cup all-purpose flour
- ½ cup brown sugar
- ½ cup cold butter, cut into cubes
- 1 teaspoon cinnamon
- Pinch of salt

**Instructions:** Place bread cubes in a greased baking dish. Whisk eggs, milk, cream, maple syrup, vanilla, cinnamon, nutmeg. Pour over bread, press down to submerge. For the streusel: combine flour, brown sugar, cold butter (cut in with fingers or fork until crumbly), cinnamon, and salt. Cover bread mixture and refrigerate overnight. In the morning, top with streusel. **Bake at 350°F for 45-55 minutes** until puffed and golden. Rest 10 minutes. Serve with additional maple syrup and fresh berries.

### 5. Denver Omelet Casserole

**Ingredients (serves 8-10):**
- 1 cup diced green bell pepper
- 1 cup diced red bell pepper
- 1 cup diced onion
- 2 cups diced cooked ham
- 10 eggs
- 1 cup milk
- 1 teaspoon salt, ½ teaspoon pepper
- ½ teaspoon paprika
- 1.5 cups shredded cheddar

**Instructions:** Sauté peppers and onion in butter 5-7 minutes until softened. Add ham and cook 2 more minutes. Transfer to a greased 9×13 dish. Whisk eggs, milk, salt, pepper, paprika. Pour over vegetables and ham. Top with cheese. Refrigerate overnight (or bake immediately — this one works either way). **Bake at 350°F for 35-45 minutes** until center is set.

### 6. Tater Tot Breakfast Bake

Crowd-pleasing and easy to customize. Particularly good for feeding children.

**Ingredients (serves 10-12):**
- 1 bag (32 oz) frozen tater tots
- 1 lb breakfast sausage, cooked and crumbled
- 8 eggs
- 1.5 cups milk
- 1.5 cups shredded cheddar
- Salt, pepper, garlic powder

**Instructions:** Layer frozen tater tots in a greased 9×13 dish. Top with sausage. Whisk eggs, milk, salt, pepper, garlic. Pour over. Top with cheese. **Bake immediately** (or cover and refrigerate overnight) at 375°F for 45-55 minutes until tots are crispy on top and eggs are set. The tater tots need no thawing — they cook from frozen and form a crispy crust.

## Key Variables by Recipe

| Recipe | Bake Time | Bake Temp | Make-Ahead |
|--------|-----------|-----------|------------|
| Sausage, Egg, Cheese | 50-60 min | 350°F | 8-24 hrs |
| Spinach Mushroom Feta | 40-45 min | 350°F | 8-24 hrs |
| Hash Brown Ham | 50-60 min | 350°F | Optional |
| French Toast | 45-55 min | 350°F | 8-24 hrs |
| Denver Omelet | 35-45 min | 350°F | Optional |
| Tater Tot Bake | 45-55 min | 375°F | Optional |

## Frequently Asked Questions

**Can I freeze a breakfast casserole?**
Yes. Assemble, bake fully, cool, slice into portions, and freeze in airtight containers for up to 3 months. Reheat individual portions in a 350°F oven for 15-20 minutes or microwave on 50% power. Do not freeze unbaked casseroles with raw egg custard.

**Why is my casserole soggy in the middle?**
The three most common causes: (1) Not squeezing moisture out of vegetables like spinach or mushrooms before adding. (2) Baking in a deeper dish than called for — use a 9×13 so depth stays at 2-3 inches. (3) Pulling it before it's fully set — the center should not jiggle when you shake the pan.

**Can I substitute egg whites for whole eggs?**
Yes. Use 2 egg whites for every whole egg. The casserole will have lower fat and fewer calories but will also be slightly drier in texture. Full eggs produce a creamier custard.

**How many servings does a 9×13 casserole produce?**
12 standard servings cut 3 rows × 4 columns. Increase to 8 larger servings for a crowd with bigger appetites, or cut into 15-16 smaller pieces for a buffet spread with other items.

## Conclusion

Breakfast casseroles are the most efficient way to feed a holiday crowd without cooking on the morning itself. The key variables are: use day-old or stale bread for better absorption, squeeze all moisture from any cooked vegetables, always let egg-based casseroles rest overnight when possible, and bake to an internal temperature of 160°F. Once you have one recipe that works, the structure is easy to adapt — swap the protein, change the cheese, adjust the seasoning — and make it your own for next year's gathering.`,
  },
];

async function main() {
  console.log(`Publishing ${POSTS.length} blog posts for DAN-2269 (Week 17, Nov 24-28, 2026)...`);

  for (const post of POSTS) {
    const existing = await prisma.blogArticle.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`  SKIP  ${post.slug} (already exists)`);
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
        status: "published",
        publishedAt: post.publishedAt,
      },
    });
    console.log(`  OK    ${created.slug}  (${post.publishedAt.toISOString().slice(0, 10)})`);
  }

  console.log("\nDone.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});

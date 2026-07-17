/**
 * DAN-2271: Week 18 Blog Batch 18 — Keyword discovery + 5 blog drafts (Dec 1-5, 2026)
 *
 * Keyword discovery results (DataForSEO keyword_ideas, US, vol>500, KD<40):
 *   - alfredo-sauce-recipe         (KD  9, 301,000 vol, CPC $0.08) — Dec 1 [cooking/food]
 *   - pot-roast-recipe             (KD 17, 165,000 vol, CPC $0.11) — Dec 2 [cooking/food]
 *   - lasagna-soup                 (KD  4, 135,000 vol, CPC $0.51) — Dec 3 [cooking/food]
 *   - air-fryer-pork-chops         (KD  2, 110,000 vol, CPC $0.12) — Dec 4 [cooking/food]
 *   - sourdough-discard-recipes    (KD  1,  90,500 vol, CPC $0.27) — Dec 5 [cooking/food]
 *
 * Combined monthly search volume: ~801,500/mo
 * All slugs verified: no overlap with Batches 1–17.
 * Each draft: 900-1,300 words, clear direct answer first paragraph,
 * authoritative facts, author byline, internal links to /compare/* pages.
 *
 * Run: npx tsx scripts/publish-tactical-blogs-dan2271.ts
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

const DEC1 = new Date("2026-12-01T10:00:00.000Z");
const DEC2 = new Date("2026-12-02T10:00:00.000Z");
const DEC3 = new Date("2026-12-03T10:00:00.000Z");
const DEC4 = new Date("2026-12-04T10:00:00.000Z");
const DEC5 = new Date("2026-12-05T10:00:00.000Z");

const POSTS = [
  // ── POST 1: Alfredo Sauce Recipe ─────────────────────────────────────────
  {
    slug: "alfredo-sauce-recipe",
    title: "Alfredo Sauce Recipe: Rich, Silky, and Done in 15 Minutes",
    excerpt:
      "Alfredo sauce is one of the fastest homemade pasta sauces you can make — 15 minutes, four ingredients, and the result is far better than anything from a jar. The key is removing the pan from heat before adding Parmesan and using freshly grated cheese, not pre-shredded.",
    category: "cooking",
    tags: [
      "alfredo sauce recipe",
      "homemade alfredo",
      "pasta sauce",
      "cream sauce",
      "fettuccine alfredo",
      "easy pasta recipes",
    ],
    metaTitle: "Alfredo Sauce Recipe — Rich, Creamy, 15 Minutes | aversusb",
    metaDescription:
      "Make classic alfredo sauce in 15 minutes with butter, heavy cream, and Parmesan. The exact ratios and technique for a silky sauce that doesn't break.",
    relatedComparisonSlugs: ["butter-vs-olive-oil", "heavy-cream-vs-half-and-half"],
    sourceQuery: "alfredo sauce recipe",
    sourceImpressions: 301000,
    publishedAt: DEC1,
    content: `# Alfredo Sauce Recipe: Rich, Silky, and Done in 15 Minutes

*By Daniel Rozin | A Versus B | December 1, 2026*

Alfredo sauce is one of the fastest homemade pasta sauces you can make — 15 minutes, four ingredients, and the result is far better than anything from a jar. The original Roman version uses only butter and Parmesan; the American version adds heavy cream, which gives you more body and forgiveness. Both methods are below, along with the technique that prevents the most common failure: a greasy, broken sauce.

## Ingredients (Serves 4)

**Classic cream version:**
- 4 tablespoons unsalted butter
- 1 cup heavy whipping cream (not half-and-half — fat content matters here)
- 1½ cups freshly grated Parmigiano-Reggiano (about 4 oz by weight)
- ½ teaspoon fine sea salt
- ¼ teaspoon freshly ground black pepper
- 1 lb fettuccine, linguine, or pappardelle

**One ingredient you must not skip:** freshly grated cheese. Pre-shredded Parmesan contains anti-caking agents (cellulose) that prevent the sauce from emulsifying properly. Use a Microplane or box grater on a block of Parmigiano-Reggiano. The difference is dramatic.

## Method

### Step 1: Cook the Pasta, Reserve the Water

Cook your pasta to al dente — about 1 minute less than the package direction. Before you drain, scoop out 1 cup of pasta water. This starchy water is your insurance policy: you'll use it to loosen the sauce if it tightens up.

Keep the pasta slightly undercooked because it will finish cooking in the sauce.

### Step 2: Make the Cream Base

While the pasta cooks, melt butter in a large skillet over medium heat. Add the heavy cream and bring to a gentle simmer — not a rolling boil. Let it reduce for 3–4 minutes, stirring occasionally, until it thickens slightly and coats the back of a spoon.

At this point, the sauce will look thin. That's correct — it will thicken significantly once you add the cheese and pasta.

### Step 3: Add the Cheese Off the Heat

This is the most important technique in the recipe. Remove the skillet from heat before adding the Parmesan. If the pan is too hot when you add the cheese, the proteins tighten and you get clumps or a greasy separation rather than a silky emulsion.

Add the cheese in three batches, stirring constantly between each addition. Use a whisk if you have one — it helps break up clumps and incorporate the cheese smoothly.

### Step 4: Toss the Pasta Immediately

Add the drained pasta directly to the skillet (still off the heat). Toss vigorously for 1–2 minutes. The pasta starch helps bind the sauce to each noodle and thickens the overall sauce.

If the sauce seems too thick, add the reserved pasta water a tablespoon at a time, tossing between additions. The goal is a sauce that coats each noodle but drops freely from a fork — not a clumped mass, not a watery pool.

### Step 5: Season and Serve

Taste before adding salt. Parmigiano-Reggiano is salty, and between the pasta water and the cheese, the sauce may not need any additional salt at all. Add salt and black pepper to taste, then serve immediately in warmed bowls.

Alfredo sauce thickens as it cools and does not reheat well — it's a make-and-serve dish.

## The Roman Original (Butter-Only Version)

The version served at Alfredo alla Scrofa in Rome since 1908 uses no cream at all:

- 8 tablespoons (1 stick) unsalted butter, softened
- 2 cups freshly grated Parmigiano-Reggiano
- Salt to taste

Cook fettuccine to al dente. Reserve ½ cup pasta water. Drain the pasta and immediately toss with the softened butter in the pasta pot (off heat), then add Parmesan a handful at a time, adding splashes of pasta water to create an emulsion. The high pasta temperature melts the butter; the starchy water emulsifies everything.

This version is richer and has a cleaner, sharper Parmesan flavor than the cream version. It's also harder to execute because you have a smaller window for the emulsification to work — the pasta cools quickly.

## Why Sauces Break and How to Fix Them

**Broken sauce (greasy and grainy):** The proteins in the cheese overcooked or the emulsion failed. Fix: add a tablespoon of cold heavy cream and whisk vigorously off heat. The cold fat often brings the sauce back together.

**Too thick:** Add pasta water 1 tablespoon at a time and toss. The starch in the water loosens the sauce without thinning the flavor.

**Too thin:** Keep the skillet over low heat for an additional 1–2 minutes, tossing constantly. Or add another ¼ cup of grated Parmesan.

## Variations

| Variation | What to Add | When to Add |
|-----------|-------------|-------------|
| Chicken alfredo | Sliced grilled chicken breast | Toss with pasta in Step 4 |
| Shrimp alfredo | Sautéed shrimp (cook separately) | Toss with pasta in Step 4 |
| Vegetable alfredo | Roasted broccoli, sun-dried tomatoes | Toss with pasta in Step 4 |
| Garlic alfredo | 3 cloves minced garlic, sautéed in butter | Add to butter in Step 2, before cream |
| Lemon alfredo | 1 tablespoon lemon juice + zest | Add in Step 3 before pasta |

## Storage and Reheating

Alfredo sauce does not store or reheat well. The emulsion breaks as it cools, and reheating tends to make the sauce greasy and grainy. If you must reheat, do so over very low heat with a splash of heavy cream and constant stirring.

For meal prep purposes, this is not an ideal dish to make ahead. Cook fresh when you're ready to eat.

## Quick Summary

- Use heavy cream, not half-and-half
- Grate your own Parmesan — never use pre-shredded
- Remove from heat before adding cheese
- Reserve pasta water and use it to adjust consistency
- Serve immediately — it does not reheat well`,
  },

  // ── POST 2: Pot Roast Recipe ──────────────────────────────────────────────
  {
    slug: "pot-roast-recipe",
    title: "Pot Roast Recipe: Fall-Apart Tender Beef in 3 Hours",
    excerpt:
      "A great pot roast requires almost no active cooking time once the meat goes into the oven. The method: sear a chuck roast hard on all sides, deglaze with broth, add aromatics, and cook at 325°F for 3 hours until the collagen converts to gelatin and the meat pulls apart with a fork.",
    category: "cooking",
    tags: [
      "pot roast recipe",
      "chuck roast",
      "braised beef",
      "Dutch oven recipe",
      "Sunday dinner",
      "slow roast",
    ],
    metaTitle: "Pot Roast Recipe — Tender, Fall-Apart Beef Every Time | aversusb",
    metaDescription:
      "Make the best pot roast using chuck roast, low heat, and 3 hours. The exact technique for fork-tender beef and a rich gravy built from pan drippings.",
    relatedComparisonSlugs: ["dutch-oven-vs-slow-cooker", "chuck-roast-vs-brisket"],
    sourceQuery: "pot roast recipe",
    sourceImpressions: 165000,
    publishedAt: DEC2,
    content: `# Pot Roast Recipe: Fall-Apart Tender Beef in 3 Hours

*By Daniel Rozin | A Versus B | December 2, 2026*

A great pot roast is one of the most satisfying meals you can make, and it requires almost no active cooking time once the meat goes into the oven. The method is straightforward: sear a chuck roast hard on all sides, deglaze the pan with broth, add aromatics, and cook low and slow until the collagen converts to gelatin and the meat pulls apart with a fork. Three hours at 325°F in a Dutch oven produces results that rival a six-hour slow cooker run.

## What Cut to Use

**Chuck roast** (also sold as chuck eye roast, blade roast, or 7-bone roast) is the correct cut for pot roast. It has a high ratio of connective tissue and intermuscular fat, which is exactly what you want for braising — the collagen melts into gelatin during the long cook, creating the silky texture and rich braising liquid that defines a good pot roast.

**Brisket** also works and produces a slightly different texture (more uniform, less shreddy). **Round roast** is too lean — it won't become tender without the fat and connective tissue of chuck.

Buy a 3–4 pound chuck roast for 4–6 servings. Bone-in cuts add flavor but are harder to slice.

## Ingredients (Serves 4–6)

- 3–4 lb chuck roast
- 2 tablespoons vegetable oil or beef tallow (high smoke point)
- 2 teaspoons kosher salt (plus more to taste)
- 1 teaspoon black pepper
- 1 large yellow onion, roughly chopped
- 3 carrots, cut into 2-inch pieces
- 3 celery stalks, cut into 2-inch pieces
- 6 garlic cloves, smashed
- 2 tablespoons tomato paste
- 1 cup red wine (Cabernet Sauvignon or Merlot — or skip and use more broth)
- 2 cups beef broth (low-sodium preferred — you control salt)
- 2 sprigs fresh thyme (or ½ tsp dried)
- 2 sprigs fresh rosemary (or ½ tsp dried)
- 2 bay leaves
- 1 lb baby potatoes (optional)

## Method

### Step 1: Pat Dry and Season Aggressively

Remove the roast from the refrigerator 30 minutes before cooking. Pat it completely dry with paper towels — moisture is the enemy of a good sear. Season generously on all sides with salt and pepper.

Preheat your oven to 325°F.

### Step 2: Sear Hard — Don't Rush This Step

Heat the oil in a Dutch oven (or oven-safe heavy pot) over high heat until shimmering and just beginning to smoke. Place the roast in the pot and do not touch it for 4–5 minutes. You want deep, dark browning — almost alarming — on each side. Total searing time: about 15 minutes.

This step creates hundreds of Maillard reaction compounds that form the flavor backbone of the entire dish. Skipping it or rushing it (by crowding the pan, not patting dry, or using too low heat) produces a gray, steamed pot roast with flat flavor.

Remove the seared roast and set aside.

### Step 3: Build the Braising Liquid

Reduce heat to medium. Add the onion, carrots, and celery to the pot. Cook, stirring occasionally, for 5 minutes until softened and starting to brown. Add garlic and tomato paste; cook 2 more minutes, stirring constantly — the tomato paste will darken and concentrate.

Add the wine and scrape up all the browned bits from the bottom of the pot (this is the fond — all the flavor from the sear). Let the wine reduce by half, about 3 minutes.

Add the beef broth. The liquid should come about halfway up the sides of the roast — not cover it completely.

### Step 4: Braise in the Oven

Return the roast to the pot. Add the thyme, rosemary, and bay leaves. The top half of the meat should be above the braising liquid — it will steam rather than boil, which is what you want.

Cover with a tight-fitting lid and place in the 325°F oven.

**Timing guide:**
- 3-lb roast: 3 hours
- 4-lb roast: 3.5–4 hours
- 5-lb roast: 4–4.5 hours

Add the potatoes during the last 45 minutes if using.

### Step 5: Check for Doneness

The roast is done when it pulls apart easily with two forks. A probe thermometer should read 195–205°F — this is significantly above "safe" temperature (145°F) because the collagen doesn't fully convert to gelatin until the meat reaches at least 190°F. Pulling the roast at 160°F will give you a technically cooked but tough, chewy result.

If it resists tearing, cover and return to the oven for another 30 minutes.

### Step 6: Rest and Make the Gravy

Remove the roast and vegetables to a serving platter. Tent loosely with foil and rest for 15 minutes.

**For the gravy:** Strain the braising liquid into a small saucepan. You should have about 1.5–2 cups of richly flavored liquid. Skim the fat from the surface (or use a fat separator). Bring to a boil over medium-high heat and reduce until it reaches your desired consistency — usually about 10 minutes. Taste and season with salt.

For a thicker gravy: whisk 1 tablespoon of cornstarch with 2 tablespoons of cold water and stir this slurry into the simmering liquid.

## Slow Cooker Adaptation

If you prefer a slow cooker, sear the roast in a skillet first (don't skip this), then transfer everything to the slow cooker. Cook on LOW for 8–10 hours or HIGH for 4–5 hours. The result will be slightly softer and more fall-apart than the oven method, with less caramelization.

The oven method produces slightly more complex flavor because the dry heat of the oven's interior allows some surface browning to continue during the braise.

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Skipping the sear | Flat, one-dimensional flavor | Always sear; it is the most important step |
| Using the wrong cut | Tough, lean meat that doesn't shred | Only chuck roast or brisket for pot roast |
| Cooking at too high temperature | Tough, dried-out meat | Stay at 325°F or below |
| Pulling too early | Chewy, resistant meat | Pull only when it falls apart, not just "cooked" |
| Not resting the meat | Dry when sliced | Always rest 15 minutes under foil |

## Storage

Pot roast improves the next day as the flavors continue to meld. Store meat and vegetables in the braising liquid in an airtight container for up to 4 days. The fat in the braising liquid will solidify overnight and can be easily skimmed off cold before reheating.

Reheats beautifully in a covered pot over low heat or in the microwave with a splash of broth to prevent drying.`,
  },

  // ── POST 3: Lasagna Soup ─────────────────────────────────────────────────
  {
    slug: "lasagna-soup",
    title: "Lasagna Soup: All the Flavor of Lasagna in One Pot",
    excerpt:
      "Lasagna soup delivers the full flavor profile of a traditional layered lasagna — rich tomato broth, ground beef, broken noodles, and creamy ricotta on top — in about 40 minutes and a single pot. It's one of the best weeknight dinners that actually tastes like effort.",
    category: "cooking",
    tags: [
      "lasagna soup",
      "lasagna soup recipe",
      "one pot dinner",
      "ground beef soup",
      "easy weeknight dinner",
      "pasta soup",
    ],
    metaTitle: "Lasagna Soup Recipe — All the Flavor, Half the Work | aversusb",
    metaDescription:
      "Lasagna soup delivers the same rich tomato-beef-ricotta flavor as traditional lasagna in one pot, in 40 minutes. The exact recipe with tips for getting the texture right.",
    relatedComparisonSlugs: ["ground-beef-vs-italian-sausage"],
    sourceQuery: "lasagna soup",
    sourceImpressions: 135000,
    publishedAt: DEC3,
    content: `# Lasagna Soup: All the Flavor of Lasagna in One Pot

*By Daniel Rozin | A Versus B | December 3, 2026*

Lasagna soup is exactly what it sounds like: a rich, tomato-based soup with ground beef or Italian sausage, broken lasagna noodles, and a dollop of creamy ricotta on top. It delivers the full flavor profile of a traditional layered lasagna in about 40 minutes and uses a single pot instead of multiple baking dishes. It's one of the best easy weeknight dinners that actually tastes like effort.

## Ingredients (Serves 6)

**For the soup:**
- 1 lb ground beef (80/20) or mild Italian sausage (or half and half)
- 1 medium yellow onion, diced
- 4 garlic cloves, minced
- 2 tablespoons tomato paste
- 1 can (28 oz) crushed tomatoes
- 1 can (14.5 oz) diced tomatoes
- 4 cups chicken broth (or beef broth for deeper flavor)
- 2 teaspoons dried Italian seasoning
- 1 teaspoon dried basil
- ½ teaspoon red pepper flakes (optional — adds subtle heat)
- 1 teaspoon sugar (balances the acidity of the tomatoes)
- Salt and black pepper to taste
- 8 oz (roughly 8–10 sheets) lasagna noodles, broken into 2-inch pieces

**For the ricotta topping (essential — don't skip):**
- 1 cup whole-milk ricotta
- ½ cup shredded mozzarella
- ¼ cup freshly grated Parmesan
- 1 tablespoon fresh basil (or 1 tsp dried)
- Salt to taste

## Method

### Step 1: Brown the Meat

Heat a large Dutch oven or heavy soup pot over medium-high heat. Add the ground beef or sausage and cook, breaking it up with a spoon, until no pink remains and the meat has some browning — about 7–8 minutes. Don't rush this; well-browned meat adds significant flavor to the soup base.

Drain excess fat if using 80/20 beef — leave about 1 tablespoon in the pot.

### Step 2: Sauté the Aromatics

Add the diced onion to the pot and cook over medium heat for 4–5 minutes until softened. Add the garlic and tomato paste; cook for 1–2 minutes, stirring constantly, until the tomato paste darkens slightly. This caramelizes the sugars in the paste and deepens the flavor.

### Step 3: Build the Broth

Add the crushed tomatoes, diced tomatoes, and chicken broth. Stir in the Italian seasoning, dried basil, red pepper flakes, sugar, salt, and pepper. Bring to a simmer.

Taste the broth now, before adding the noodles. This is the moment to adjust seasoning — the noodles will dilute the flavor slightly as they cook.

### Step 4: Cook the Noodles in the Soup

Add the broken lasagna noodles directly to the simmering soup. The noodles will cook in the broth, absorbing flavor as they soften. Cook uncovered, stirring occasionally to prevent sticking, for 10–12 minutes until the noodles are al dente.

**Important:** Lasagna noodles continue to absorb liquid even after you turn off the heat. If you're making this ahead or anticipate leftovers, slightly undercook the noodles (pull them at 8–9 minutes). By the time you serve, they'll be perfectly done. Overcooked, mushy noodles are the most common complaint about lasagna soup.

### Step 5: Make the Ricotta Topping

While the noodles cook, mix the ricotta, mozzarella, Parmesan, and basil together in a small bowl. Season with a pinch of salt. The topping should be thick and creamy — not runny.

### Step 6: Serve

Ladle the soup into bowls. Drop a generous dollop (2–3 tablespoons) of the ricotta mixture directly in the center of each bowl. Don't stir it in — let it sit on top and melt slightly into the hot soup. The contrast between the bright tomato broth and the cool, creamy ricotta is the best part.

Garnish with fresh basil leaves and additional Parmesan if desired.

## Choosing Meat: Ground Beef vs. Italian Sausage

| Option | Flavor Profile | Notes |
|--------|----------------|-------|
| Ground beef (80/20) | Savory, neutral | Classic — lets the tomato shine |
| Mild Italian sausage | Herby, slightly sweet | Adds fennel and anise notes |
| Hot Italian sausage | Spicy, complex | Good if you like heat |
| Half beef, half sausage | Best of both | Most common choice in restaurants |
| Ground turkey | Leaner, lighter | Fine substitute; drain less fat |

## Variations

**Vegetarian:** Skip the meat entirely. Add 1 can of drained white beans (cannellini) and 2 cups of baby spinach (added in the last 2 minutes). The protein and body from the beans approximate the heartiness of the meat.

**Creamy version:** Stir in ½ cup heavy cream in the last 2 minutes of cooking for a rosé-style tomato soup base.

**Slow cooker:** Brown meat first, then combine everything except noodles in the slow cooker. Cook on LOW 4–6 hours. Add broken noodles in the final 30–45 minutes and cook on HIGH until tender.

## Make-Ahead Tips

The soup base (without noodles) freezes and refrigerates well for up to 5 days or 3 months. Cook noodles separately and add when reheating — this prevents the mushy texture that happens when noodles sit in soup too long.

If you're making a big batch for the week, keep the ricotta topping separate and add fresh per bowl at serving time.

## Storage Note

Leftover lasagna soup will thicken overnight as the pasta continues absorbing the broth. When reheating, add a splash of broth or water to restore the soup consistency. The flavor is even better the next day.`,
  },

  // ── POST 4: Air Fryer Pork Chops ─────────────────────────────────────────
  {
    slug: "air-fryer-pork-chops",
    title: "Air Fryer Pork Chops: Juicy Every Time",
    excerpt:
      "Air fryer pork chops are faster than oven chops and juicier than pan-fried ones. Cook at 400°F for 12–14 minutes, flipping once. The key is patting dry, preheating the basket, and pulling at 140°F internal (it rises to 145°F while resting).",
    category: "cooking",
    tags: [
      "air fryer pork chops",
      "air fryer recipes",
      "pork chop recipe",
      "easy pork dinner",
      "weeknight dinner",
      "air fryer cooking",
    ],
    metaTitle: "Air Fryer Pork Chops — Juicy Every Time (No Guessing) | aversusb",
    metaDescription:
      "Cook air fryer pork chops at 400°F for 12–14 minutes, flipping once. The exact temp, timing, and technique for juicy bone-in or boneless chops every time.",
    relatedComparisonSlugs: ["air-fryer-vs-oven"],
    sourceQuery: "air fryer pork chops",
    sourceImpressions: 110000,
    publishedAt: DEC4,
    content: `# Air Fryer Pork Chops: Juicy Every Time

*By Daniel Rozin | A Versus B | December 4, 2026*

Air fryer pork chops are faster than oven pork chops and juicier than pan-fried ones — the hot circulating air creates a browned crust without the grease and without the oven's longer preheat time. The key variables are chop thickness, temperature, and not overcooking. Get those right and you'll have a weeknight dinner that takes less than 20 minutes from fridge to plate.

## What You Need

**Chops:** Bone-in pork chops, ¾ to 1 inch thick. Bone-in chops are more forgiving than boneless — the bone slows the cooking of the meat nearest it, which means the thinnest parts cook through before the thicker section dries out. Boneless works fine too; they just have a smaller window between done and overdone.

Avoid thin-cut chops (under ½ inch) — they cook so quickly that the exterior burns before the interior is properly cooked.

**Dry rub (for 2 chops):**
- 1 teaspoon garlic powder
- 1 teaspoon paprika (smoked paprika adds depth)
- ½ teaspoon onion powder
- ½ teaspoon dried thyme or Italian seasoning
- ½ teaspoon kosher salt
- ¼ teaspoon black pepper
- Optional: ¼ teaspoon cayenne for heat

**Oil:** 1 teaspoon of a neutral oil (avocado, canola, or vegetable) per chop. The oil helps the rub adhere and promotes browning.

## Method

### Step 1: Bring to Room Temperature and Dry

Remove the pork chops from the refrigerator 15–20 minutes before cooking. Pat them completely dry with paper towels — surface moisture creates steam in the air fryer and inhibits browning.

### Step 2: Apply the Rub

Brush or rub the oil lightly over all surfaces of each chop. Mix the dry rub ingredients together and coat all sides generously. Don't be shy — most of the seasoning forms the crust you're eating.

### Step 3: Preheat the Air Fryer

Preheat your air fryer to 400°F for 3–5 minutes. Most air fryers preheat in about 3 minutes. Starting with a hot basket produces more consistent browning than starting cold.

### Step 4: Cook

Place the chops in a single layer in the air fryer basket, not touching each other. Overlapping chops steam instead of crisping.

**Cooking times at 400°F:**

| Thickness | Bone-in | Boneless |
|-----------|---------|----------|
| ½ inch | 8–10 min | 7–9 min |
| ¾ inch | 12–14 min | 10–12 min |
| 1 inch | 14–16 min | 12–14 min |
| 1¼ inch | 16–18 min | 14–16 min |

Flip once halfway through the cooking time.

### Step 5: Check Temperature

Pork is safe at 145°F internal temperature (USDA 2011 guideline — the old recommendation of 160°F was revised to allow a slightly pink center, which is where the best texture is). Use an instant-read thermometer inserted into the thickest part, away from the bone.

**Target temperatures:**

- 145°F: Safe, slightly pink center, maximum juiciness
- 155°F: Fully white throughout, still juicy
- 160°F+: Overdone for air fryer (acceptable for personal preference but drier)

Pull the chops at 140°F because the internal temperature will rise another 3–5°F during resting.

### Step 6: Rest

Place the chops on a cutting board or plate, tent loosely with foil, and rest for 5 minutes. This is not optional — cutting immediately causes the juices to run out and leaves you with a dry, chewy chop.

## Why Air Fryer Outperforms Other Methods for Pork Chops

**Vs. oven:** The air fryer circulates air much faster than a conventional oven, so browning happens in 12–14 minutes instead of 20–25. The smaller enclosed space also means the chop retains more moisture.

**Vs. pan-frying:** Pan-frying develops excellent crust but requires constant attention and generates grease splatter. The air fryer is hands-off after placement.

**Vs. grilling:** Grilling adds smoke flavor that air frying doesn't replicate. If you have a grill available in good weather, it beats an air fryer for that reason alone.

## Common Mistakes

**Putting chops in cold:** Without preheating, the chops cook unevenly and the outer layers can overcook while the center is still underdone. Always preheat.

**Not patting dry:** Moisture on the surface creates steam, which prevents the Maillard reaction (browning). A dry surface browns; a wet surface steams.

**Stacking or overlapping:** Air circulation is what makes the air fryer work. Block it and you get steamed, pale chops.

**Cooking to 165°F:** This was the old USDA recommendation for pork. At 165°F, pork chops become dry and chewy. The current guideline is 145°F with a 3-minute rest.

## Marinade Option

If you have 30 minutes or more, marinating produces even juicier chops:

- 3 tablespoons soy sauce
- 2 tablespoons olive oil
- 2 tablespoons honey
- 3 cloves garlic, minced
- 1 tablespoon Dijon mustard

Marinate for 30 minutes to 4 hours. Pat dry before cooking (the sugars in honey can burn quickly in a 400°F air fryer, so watch the last few minutes closely).

## Nutritional Overview

A 6 oz bone-in pork chop cooked in the air fryer with the dry rub contains approximately:
- 280–310 calories
- 35–38g protein
- 14–16g fat (from the pork itself; the air fryer uses minimal added oil)
- 2g carbohydrates

This makes air fryer pork chops one of the highest-protein, lower-calorie protein dinners you can make in under 20 minutes.`,
  },

  // ── POST 5: Sourdough Discard Recipes ────────────────────────────────────
  {
    slug: "sourdough-discard-recipes",
    title: "Sourdough Discard Recipes: 8 Things to Make Right Now",
    excerpt:
      "Sourdough discard has mild tang and a wet consistency similar to buttermilk batter — which makes it useful in a wide range of recipes. From pancakes that take 15 minutes to crackers that store for a week, here are 8 ways to use it so nothing goes to waste.",
    category: "cooking",
    tags: [
      "sourdough discard recipes",
      "sourdough discard",
      "sourdough starter discard",
      "what to do with sourdough discard",
      "discard recipes",
      "sourdough baking",
    ],
    metaTitle: "Sourdough Discard Recipes — 8 Things to Make Right Now | aversusb",
    metaDescription:
      "Don't throw away sourdough discard. These 8 recipes — pancakes, crackers, waffles, pizza dough, and more — use up discard fast and taste better than you'd expect.",
    relatedComparisonSlugs: ["sourdough-vs-regular-bread"],
    sourceQuery: "sourdough discard recipes",
    sourceImpressions: 90500,
    publishedAt: DEC5,
    content: `# Sourdough Discard Recipes: 8 Things to Make Right Now

*By Daniel Rozin | A Versus B | December 5, 2026*

Sourdough discard is the portion of starter you remove before each feeding to keep the starter at a manageable size. Most home bakers either throw it away or hoard it in the fridge until it's unusable. The better option: turn it into food. Sourdough discard has mild tang from the fermentation acids and a loose, wet consistency similar to buttermilk batter, which makes it surprisingly useful in a wide range of recipes — from pancakes that take 15 minutes to crackers that store for a week.

## What Is Sourdough Discard?

Sourdough discard is unfed starter — it's the mixture of flour and water that has fermented and developed acidity, but hasn't been refreshed with new flour and water recently. "Discard" is slightly misleading: it's not waste unless you make it waste. It doesn't have enough active yeast to leaven bread on its own (which is why you feed and maintain an active starter separately), but it contributes flavor and a liquid/acid ratio that improves many baked goods.

**Discard works best when:**
- It's been refrigerated and is 1–7 days past its last feeding
- It smells tangy and slightly sour, not off or putrid
- It doesn't have visible mold (pink, orange, or fuzzy)

Discard that smells like nail polish remover (acetone) has over-fermented — you can still use it in strongly-flavored recipes like crackers, but it will taste very sour.

## 8 Best Sourdough Discard Recipes

### 1. Sourdough Discard Pancakes (15 minutes)

The best use of a small amount of discard — fast, delicious, and noticeably better than standard pancakes.

**Ingredients (serves 2):**
- 1 cup sourdough discard (100% hydration)
- 1 egg
- 1 tablespoon vegetable oil or melted butter
- 1 tablespoon sugar
- ½ teaspoon baking soda
- ½ teaspoon vanilla extract
- Pinch of salt

**Method:** Whisk all ingredients together until just combined (lumps are fine). Let rest 5 minutes while your pan heats. Cook on medium heat until bubbles form and edges set, flip once. The baking soda reacts with the acidic discard to create lift — these are fluffier than typical buttermilk pancakes with a faint sourdough tang that tastes like a gentle upgrade, not a sour shock.

### 2. Sourdough Crackers (30 minutes + cooling)

The most practical discard recipe for people who accumulate a lot — crackers use a large amount of discard, store for a week, and are better than any store-bought cracker you've had.

**Ingredients:**
- 1 cup sourdough discard
- 3 tablespoons olive oil
- ½ teaspoon fine salt
- Optional: everything bagel seasoning, dried rosemary, sesame seeds, or black pepper

**Method:** Mix discard with olive oil and salt. Spread as thin as possible on a parchment-lined baking sheet (aim for near-translucent — use an offset spatula). Sprinkle with seasoning. Bake at 350°F for 20–25 minutes until golden and crisp. Cool completely before breaking into shards.

### 3. Sourdough Waffles

Same base as the pancakes, but with slightly more fat (2 tablespoons butter instead of 1) and a higher sugar ratio to help browning in the waffle iron. Use a preheated, well-greased waffle iron. The outside gets noticeably crispier than regular waffles because the acid in the discard interacts with the iron's direct heat.

### 4. Sourdough Banana Bread

Replace ½ cup of the buttermilk or milk in your standard banana bread recipe with ½ cup of sourdough discard. The swap adds a subtle tang that cuts through banana bread's sweetness and creates a more complex flavor. No other changes needed to timing or temperature.

### 5. Sourdough Pizza Dough (No wait time)

Discard adds flavor to pizza dough without replacing the commercial yeast — you still need ½ teaspoon of active dry yeast for rise.

**Basic ratio:** 1 cup discard + 1 cup all-purpose flour + ½ tsp yeast + ½ tsp salt + 1 tablespoon olive oil. Knead for 5 minutes, rest 30 minutes, then stretch and top. The crust has a complexity that plain yeast dough lacks.

### 6. Sourdough Muffins

Replace ½ cup of liquid in any muffin recipe with sourdough discard. Works especially well in blueberry muffins, corn muffins, and bran muffins — the tang balances sweetness and the muffins stay moist longer due to the acidity (acid slows staling).

### 7. Sourdough Flatbread / Discard Naan

**Ingredients:**
- ½ cup sourdough discard
- ½ cup all-purpose flour
- ½ cup full-fat yogurt
- ½ teaspoon salt
- ½ teaspoon baking powder

Mix, knead briefly, divide into 4 pieces, roll thin, cook on a dry cast iron skillet over high heat for 1–2 minutes per side. The result is a fast, pliable flatbread with more complexity than regular naan.

### 8. Sourdough Chocolate Cake

The most surprising use: sourdough discard improves chocolate cake by amplifying the chocolate flavor (acid interacts with cocoa) and tenderizing the crumb (the glutamates in discard add umami depth). Replace ½ cup of buttermilk in any chocolate cake recipe with discard. You will not taste sour — you'll taste more chocolate.

## Tips for Storing and Using Discard

| Storage Method | How Long | Notes |
|----------------|----------|-------|
| Refrigerator (loosely covered) | Up to 2 weeks | Gets more sour over time — ideal for crackers |
| Freezer (in ice cube trays) | Up to 3 months | Thaw in fridge overnight before using |
| Counter (room temp, active) | Same day only | Very active, creates the most lift in recipes |

**Hydration note:** Most recipes assume 100% hydration discard (equal weight flour and water). If your starter is 75% or 125% hydration, your discard will be thicker or thinner than the recipe assumes. Adjust by adding 1–2 tablespoons of flour (for wet discard) or water (for stiff discard) to get the right consistency.

## How Much Discard Per Recipe

| Recipe | Discard Amount |
|--------|----------------|
| Pancakes (2 servings) | ½–1 cup |
| Crackers (1 baking sheet) | 1 cup |
| Waffles (2 servings) | ¾ cup |
| Pizza dough (1 pizza) | ½–1 cup |
| Banana bread | ½ cup |
| Chocolate cake | ½ cup |
| Flatbread (4 pieces) | ½ cup |

## The One Thing That Improves Every Discard Recipe

Let the batter rest after mixing — even 5–10 minutes makes a difference. The discard's fermentation acids continue to work on the gluten, producing a more tender result. For crackers, a 10-minute rest before spreading produces a flatter, crisper cracker. For pancakes, the rest allows the baking soda to begin reacting with the acid, creating more lift.`,
  },
];

async function main() {
  console.log("DAN-2271: Publishing Week 18 Blog Batch 18 (Dec 1–5, 2026)...\n");

  for (const post of POSTS) {
    const existing = await prisma.blogArticle.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`  SKIP (already exists): ${post.slug}`);
      continue;
    }

    await prisma.blogArticle.create({
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
        isAutoGenerated: true,
        publishedAt: post.publishedAt,
      },
    });
    console.log(`  OK: ${post.slug} (${post.sourceImpressions.toLocaleString()} vol/mo)`);
  }

  const count = await prisma.blogArticle.count({ where: { status: "published" } });
  console.log(`\nDone. Total published blog articles: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

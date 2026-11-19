import { buildEditorialComparison, textAttrN } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-472 — Ultrasonic vs evaporative vs steam humidifier.
 * Opened 19 November 2026 (Asia/Jerusalem).
 * winnerName null. Every key difference is a tie.
 * Safety and health wording is from the US EPA fact sheet and US CPSC Publication 5046.
 * No noise, output, wattage, or price figure is stored. dataPointCount stays 0.
 * A community thread URL returned 403, so it is not quoted.
 */

const PUBLISHED = "2026-11-19T00:00:00Z";
const SOURCE_DATE = "2026-11-19";

const ULTRASONIC = "ultrasonic-humidifier";
const EVAPORATIVE = "evaporative-humidifier";
const STEAM = "steam-humidifier";

const EPA_URL = "https://www.epa.gov/indoor-air-quality-iaq/use-and-care-home-humidifiers";
const CPSC_URL = "https://www.cpsc.gov/s3fs-public/5046.pdf";

const SHORT_ANSWER = `Choose an evaporative humidifier if you want a type the US EPA groups with steam vaporizers, which generally disperse less, if any, of the microorganisms and minerals that ultrasonic and impeller units can send into the air, and which are not expected to disperse substantial amounts of minerals. Choose a steam humidifier if you want that EPA group and can keep the unit out of the reach of children, since the US EPA says steam and boiling water may cause burns, or choose an ultrasonic humidifier if you will use low-mineral water, such as distilled water, and empty, dry, and clean a portable tank on the schedule the US EPA gives.`;

const CHOOSE_TABLE = [
  "Rows follow US EPA, Use and Care of Home Humidifiers, last updated April 29, 2026, and US CPSC Publication 5046, both read on 19 November 2026. No row is a ranked result.",
  "| Situation | Choose ultrasonic if | Choose evaporative if | Choose steam if |",
  "| --- | --- | --- | --- |",
  "| Moisture | You want a cool mist made by ultrasonic sound vibrations (US EPA) | You want a fan to blow air through a moistened belt, wick, or filter (US EPA) | You want water heated into steam. Warm mist cools that steam before it exits (US EPA) |",
  "| Air | You accept the US EPA grouping of this type with impeller units as generally producing the greatest dispersions of microorganisms and minerals | You want a type that generally disperses less, if any, of those pollutants and is not expected to disperse substantial amounts of minerals (US EPA) | You want that same EPA description of dispersal, and you will still clean a tank that can grow microorganisms |",
  "| Water | You will use low-mineral water such as distilled water, because this type is very efficient at dispersing tap-water minerals (US EPA) | You will use low-mineral water to limit scale, even though this type is not expected to disperse substantial amounts of minerals (US EPA) | You will use low-mineral water to limit scale, for the same US EPA mineral note as an evaporative unit |",
  "| Burns | The US EPA definition uses sound vibrations, not heating, to make the mist | The US EPA definition uses a fan and a moistened belt, wick, or filter, not boiling | You can keep the unit out of the reach of children, because steam and boiling water may cause burns (US EPA) |",
  "| Daily care | You will empty, wipe dry, and refill a portable tank daily and clean every third day (US EPA) | You will follow that same portable schedule and maintain the belt, wick, or filter as the manufacturer instructs (US EPA) | You will follow that same portable schedule and keep the unit away from children (US EPA) |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose an evaporative humidifier if you want a type the US EPA says generally disperses less, if any, microorganisms and minerals, and is not expected to disperse substantial amounts of minerals.
- Choose a steam humidifier if you want that same EPA description and can keep the unit out of the reach of children, because steam and boiling water may cause burns.
- Choose an ultrasonic humidifier if you will use low-mineral water, such as distilled water, and clean a portable tank on the US EPA schedule. The US EPA groups ultrasonic units with impeller units as the types that generally appear to produce the greatest dispersions.
- The US CPSC says bacteria and fungi often grow in humidifier tanks and can be released in the mist, and that white dust may contain particles small enough to enter the lungs. It says the health effects of that dust are not clear.
- Do not humidify above 50 percent (US EPA). The US CPSC says to keep relative humidity between 30% and 50% if possible, and that levels above 60% may let moisture build up.
- This is general information from those two agencies. It is not medical advice. Stop using the humidifier and contact your physician if respiratory symptoms you believe are associated with its use appear, even when you follow the maintenance directions (US EPA).

The two documents are US EPA, Use and Care of Home Humidifiers, last updated April 29, 2026, ${EPA_URL}, and US CPSC Publication 5046, Dirty Humidifiers May Cause Health Problems, ${CPSC_URL}. Both were read on 19 November 2026.

## Which humidifier type to choose

Choose an evaporative humidifier if you want the US EPA description of lower dispersal, choose a steam humidifier if you want that description and children cannot reach boiling water, and choose an ultrasonic humidifier if you will use distilled or other low-mineral water and keep the tank clean.

${CHOOSE_TABLE}

## How ultrasonic, evaporative, and steam humidifiers work

An ultrasonic humidifier creates a cool mist by ultrasonic sound vibrations, an evaporative humidifier uses a fan to blow air through a moistened belt, wick, or filter, and a steam vaporizer heats water to make steam.

The US EPA defines the three mechanisms this way. Ultrasonic units create a cool mist by means of ultrasonic sound vibrations. Evaporative units transmit moisture into the air invisibly by using a fan to blow air through a moistened absorbent material, such as a belt, wick, or filter. Steam vaporizers create steam by heating water with an electrical heating element or electrodes. A warm-mist humidifier is a type of steam vaporizer in which the steam is cooled before exiting the machine.

An impeller humidifier, which the US EPA also calls cool mist, produces a cool mist by means of a high-speed rotating disk. The US EPA groups impeller units with ultrasonic units for what they can put in the air. The same water and cleaning care applies to an impeller unit.

The US EPA also separates portable units, console units in a floor cabinet, and central units built into heating and air conditioning. The daily emptying steps are for portable humidifiers. Console and central units follow the manufacturer's directions. In particular, the US EPA says not to let water stand in a console tank for extended periods, and to keep that water clean.

## What a humidifier can put in the air

The US EPA says ultrasonic and impeller humidifiers generally appear to produce the greatest dispersions of both microorganisms and minerals, while evaporative and steam vaporizer humidifiers generally disperse less, if any.

The US EPA says several studies have shown that ultrasonic and impeller humidifiers can disperse microorganisms and minerals from their water tanks into indoor air. Evaporative and steam vaporizer units can still allow microorganisms to grow if a tank holds standing water, but they generally disperse less, if any, of these pollutants. Steam vaporizer and evaporative humidifiers are not expected to disperse substantial amounts of minerals.

The US EPA says breathing mist containing these pollutants has been implicated as causing a certain type of inflammation of the lungs. It also says the possible health effects from dispersing microorganisms and minerals are not fully understood. The young, the elderly, and people with lung diseases or respiratory allergies may be particularly susceptible to certain airborne pollutants.

The US CPSC says bacteria and fungi often grow in the tanks of portable and console room humidifiers and can be released in the mist. Breathing dirty mist may cause lung problems ranging from flu-like symptoms to serious infection. The US CPSC says this is of special concern to allergy or asthma sufferers, whose symptoms may be increased. Film or scum on the water, on the tank, or on exposed motor parts may indicate bacteria or fungi. Scale is minerals that have settled out of the water, and it creates a surface on which bacteria or fungi may grow.

The US CPSC says minerals can leave the mist as fine white dust, and that this white dust may contain particles small enough to enter the lungs. It says the health effects from inhaling this humidifier dust are not clear, and that any impact depends on the types and amounts of minerals in the water.

Stop using the humidifier and contact your physician if you have respiratory symptoms you believe are associated with periods of use, even if you are following the maintenance directions. This is general information from the US EPA and the US CPSC. It is not medical advice.

## What warm mist and cool mist mean

The US EPA says a warm-mist humidifier is a steam vaporizer in which the steam is cooled before it exits, and it uses cool mist for an impeller humidifier that spins a high-speed disk.

Ultrasonic units also create a cool mist, by sound vibrations rather than by that disk. A product labeled only as cool mist can be either mechanism. The US EPA writes the burn warning for steam vaporizer humidifiers, and warm mist is that type. Cooling the steam before it exits is the US EPA's definition of warm mist. The same fact sheet still says to keep steam vaporizer humidifiers out of the reach of children.

## Whether to use tap water

The US EPA says ultrasonic and impeller humidifiers are very efficient at dispersing minerals in tap water into the air, and the US CPSC says to use distilled or demineralized water and not tap water.

On the US EPA fact sheet, minerals from tap water can show up as white dust on surfaces and can build crusty deposits, or scale. Scale can be a breeding ground for microorganisms. The US EPA says to use water with low mineral content, such as bottled water labeled distilled, to limit scale and to limit minerals in the air. Distilled water still contains some mineral content. It will likely contain less than most tap water. Distillation is the most effective method the US EPA names for removing minerals. Deionization and reverse osmosis remove most minerals but are generally less effective than distillation, so water from those two processes would, on average, be expected to hold more minerals than distilled water. Purified water may be made by any of those processes. Bottled water labeled spring, artesian, or mineral has not been treated to remove minerals.

Demineralization cartridges, cassettes, or filters are worth considering only when the manufacturer supplies or recommends them. The US EPA says their ability to remove minerals may vary widely, that further research is needed on how well and how long they work, and that white dust is a sign minerals are still getting through.

The US CPSC water wording covers room humidifiers in general, not only the ultrasonic and impeller units in the US EPA tap-water discussion. It says to use distilled or demineralized water in your room humidifier to reduce scale and dust, and not to use tap water because it contains more minerals. Use a cartridge or filter when one is supplied or recommended. That advice is for room humidifiers, not only for ultrasonic units. The US EPA mineral-dispersal warning is strongest for ultrasonic and impeller units, and it still tells owners of the other types to use low-mineral water so scale does not build.

## How to clean a humidifier and what humidity to use

Empty, wipe dry, and refill a portable humidifier daily, clean it every third day, and do not humidify above 50 percent. The US CPSC says to keep relative humidity between 30% and 50% if possible, and that levels above 60% may let moisture build up.

- Unplug the unit from the electrical socket before you empty or clean it. The US EPA and the US CPSC both say to unplug first.
- Each day, empty the tank, wipe all surfaces dry, and refill the water in a portable humidifier. The US CPSC says to change the water daily if possible and to empty the tank before you fill it.
- Every third day, empty the tank, scrub it, remove scale, deposits, or film, and wipe all surfaces dry (US EPA).
- If the manufacturer gives no cleaning method, clean surfaces that touch water with a 3% solution of hydrogen peroxide (US EPA).
- After any cleaning or disinfecting agent, rinse the tank thoroughly with several changes of tap water so chemicals are not sent into the air (US EPA). If chlorine bleach or another cleaner is used, the US CPSC says to rinse well to avoid breathing harmful chemicals. Do not damage the motor or scratch the inner surface. Clean or replace sponge filters or belts when needed.
- Do not humidify to indoor relative humidity above 50 percent. Higher levels may encourage dust mites and molds (US EPA). The US CPSC says to maintain 30% to 50% if possible. Humidity above 60% may let moisture condense on surfaces, where bacteria and fungi can settle and grow.

Use a hygrometer, or a built-in humidistat, to measure the level. If water condenses on windows, walls, or pictures, relocate the humidifier, lower the humidistat, or reduce its use. If the area around the unit gets damp, turn the output volume down. If it cannot be turned down, run the unit intermittently. Do not let carpet, drapes, or tablecloths become damp.

At the end of the season, or when the unit will sit unused, clean it, dry every part, dispose of used demineralization cartridges, cassettes, or filters, and store it in a dry place. Clean it again after storage and remove dust on the outside. The US CPSC says to drain and clean the tank before storage and to clean it after summer storage.

## Who should choose which type

Choose evaporative or steam when you want the types the US EPA says generally disperse less, if any, of these pollutants, and choose ultrasonic when you will use low-mineral water and keep the tank on the cleaning schedule.

- Choose an evaporative humidifier if you want moisture from a fan and a moistened belt, wick, or filter, and you will maintain that material the way the manufacturer instructs.
- Choose a steam humidifier if you want moisture made by heating water, including warm mist that cools the steam before it exits, and you can keep the unit out of the reach of children.
- Choose an ultrasonic humidifier if you will buy low-mineral water, such as distilled water, and you will empty, dry, and clean the portable tank on the US EPA schedule, knowing this type is in the higher-dispersal group.
- Choose an impeller humidifier only with that same water and cleaning care. The US EPA groups it with ultrasonic units.
- If a young child, an older adult, or someone with lung disease, a respiratory allergy, or asthma lives in the home, follow those cleaning, water, and humidity steps. The US EPA says those groups may be particularly susceptible to certain airborne pollutants. The US CPSC says the dirty-humidifier warning is of special concern when asthma or allergy symptoms may be increased. Neither document names one type as a treatment. Contact a physician if respiratory symptoms you believe are associated with use appear. This is not medical advice.

Neither document gives a noise level, a water-output rate, a wattage, or a price, so none of those figures are repeated here. A community thread URL for this question did not load on 19 November 2026, so nothing here repeats an account story from it.`;

const FAQS = [
  {
    question: "Is an evaporative or ultrasonic humidifier better?",
    answer:
      "Choose an evaporative humidifier if you want the type the US EPA groups with steam vaporizers. Those types generally disperse less, if any, microorganisms and minerals, and they are not expected to disperse substantial amounts of minerals. Choose an ultrasonic humidifier if you will use low-mineral water, such as distilled water, and clean it on the US EPA schedule. The US EPA says ultrasonic and impeller units generally appear to produce the greatest dispersions of both microorganisms and minerals. This is general information, not medical advice.",
  },
  {
    question: "Are ultrasonic humidifiers bad for your lungs?",
    answer:
      "The US EPA says ultrasonic and impeller humidifiers can disperse microorganisms and minerals from the tank into indoor air, and that breathing mist containing these pollutants has been implicated as causing a certain type of inflammation of the lungs. It also says the possible health effects are not fully understood. The US CPSC says bacteria and fungi often grow in tanks and can be released in the mist, and that white dust may contain particles small enough to enter the lungs. The US CPSC says the health effects from inhaling that dust are not clear. Stop using the humidifier and contact your physician if you have respiratory symptoms you believe are associated with using it, even when you follow the maintenance directions. This is general information from those agencies. It is not medical advice.",
  },
  {
    question: "Can I use tap water in an ultrasonic humidifier?",
    answer:
      "The US EPA says ultrasonic and impeller humidifiers are very efficient at dispersing minerals in tap water into the air. That can appear as white dust and can build scale, and scale can be a breeding ground for microorganisms. Use bottled water labeled distilled. Distilled water still contains some mineral content, and it will likely contain less than most tap water. Bottled water labeled spring, artesian, or mineral has not been treated to remove minerals. The US CPSC says to use distilled or demineralized water in a room humidifier and not to use tap water, because tap water contains more minerals. That CPSC water advice is for room humidifiers in general, not only ultrasonic units.",
  },
  {
    question: "What humidity level should I set?",
    answer:
      "The US CPSC says to maintain relative humidity between 30% and 50% if possible, and that levels above 60% may allow moisture to build up indoors and condense on surfaces, where bacteria and fungi can settle and grow. The US EPA says not to humidify above 50 percent, because higher levels may encourage biological organisms such as dust mites and molds. A hygrometer, or a built-in humidistat, can measure the level. If water condenses on windows, walls, or pictures, the US EPA says to relocate the humidifier, lower its humidistat, or reduce its use.",
  },
  {
    question: "How do I clean a portable humidifier?",
    answer:
      "Unplug the unit first. The US EPA says to empty the tank, wipe all surfaces dry, and refill the water in a portable humidifier daily, and to clean it every third day by emptying, scrubbing, removing scale, deposits, or film, and wiping all surfaces dry. If the manufacturer gives no cleaning instructions, clean surfaces that touch water with a 3% solution of hydrogen peroxide. After any cleaning or disinfecting agent, rinse the tank thoroughly with several changes of tap water. The US CPSC says to unplug before cleaning, and if chlorine bleach or another cleaner is used, rinse well so you do not breathe harmful chemicals. Do not damage the motor or scratch the inner surface. Clean or replace sponge filters or belts when needed. Console and central humidifiers follow the manufacturer's directions. The US EPA says not to let water stand in a console tank for extended periods.",
  },
  {
    question: "Are steam humidifiers a burn risk around children?",
    answer:
      "The US EPA says to keep steam vaporizer humidifiers out of the reach of children, because steam and boiling water may cause burns. The US EPA defines a warm-mist humidifier as a type of steam vaporizer in which the steam is cooled before exiting the machine. The burn warning is written for steam vaporizer humidifiers, and warm mist is that type.",
  },
];

const VERDICT = `Choose an evaporative humidifier if you want the US EPA description of a type that generally disperses less, if any, microorganisms and minerals, and is not expected to disperse substantial amounts of minerals. Choose a steam humidifier if you want that description and can keep steam and boiling water out of the reach of children. Choose an ultrasonic humidifier if you will use low-mineral water, such as distilled water, and empty, dry, and clean the tank on the US EPA schedule.

The US EPA says ultrasonic and impeller units generally appear to produce the greatest dispersions of both microorganisms and minerals. The US CPSC says to use distilled or demineralized water and to keep relative humidity between 30% and 50% if possible. The US EPA says not to exceed 50 percent. This is not medical advice.`;

const BUILT = buildEditorialComparison({
  slug: "ultrasonic-vs-evaporative-vs-steam-humidifier",
  title: "Ultrasonic vs evaporative vs steam humidifier",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "home",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: ULTRASONIC,
      slug: ULTRASONIC,
      name: "Ultrasonic humidifier",
      shortDesc:
        "Creates a cool mist by ultrasonic sound vibrations. The US EPA groups it with impeller units for the greatest dispersions of microorganisms and minerals.",
      imageUrl: null,
      entityType: "appliance",
      position: 0,
      pros: [
        "Creates a cool mist by ultrasonic sound vibrations (US EPA)",
        "Low-mineral water, such as distilled water, limits the minerals this type can put in the air (US EPA)",
      ],
      cons: [
        "Grouped with impeller units as generally producing the greatest dispersions of microorganisms and minerals (US EPA)",
        "Very efficient at dispersing minerals from tap water, which can show up as white dust and as scale (US EPA)",
      ],
      bestFor: null,
    },
    {
      id: EVAPORATIVE,
      slug: EVAPORATIVE,
      name: "Evaporative humidifier",
      shortDesc:
        "A fan blows air through a moistened belt, wick, or filter. The US EPA says this type generally disperses less, if any, microorganisms and minerals.",
      imageUrl: null,
      entityType: "appliance",
      position: 1,
      pros: [
        "A fan blows air through a moistened belt, wick, or filter, and the moisture enters the air invisibly (US EPA)",
        "Generally disperses less, if any, microorganisms and minerals, and is not expected to disperse substantial amounts of minerals (US EPA)",
      ],
      cons: [
        "A tank of standing water can still grow microorganisms (US EPA)",
        "The belt, wick, or filter has to be maintained the way the manufacturer instructs (US EPA)",
      ],
      bestFor: null,
    },
    {
      id: STEAM,
      slug: STEAM,
      name: "Steam humidifier",
      shortDesc:
        "Heats water into steam. Warm mist cools that steam before it exits. The US EPA says to keep steam vaporizers out of children's reach.",
      imageUrl: null,
      entityType: "appliance",
      position: 2,
      pros: [
        "Creates steam by heating water with an electrical heating element or electrodes (US EPA)",
        "Warm mist is this type with the steam cooled before it exits, and the type generally disperses less, if any, of these pollutants (US EPA)",
      ],
      cons: [
        "Steam and boiling water may cause burns. Keep the unit out of the reach of children (US EPA)",
        "A tank of standing water can still grow microorganisms (US EPA)",
      ],
      bestFor: null,
    },
  ],
  keyDifferences: [
    {
      label: "How it adds moisture",
      entityAValue: "Cool mist by ultrasonic sound vibrations",
      entityBValue: "Fan through a moistened belt, wick, or filter",
      values: [
        "Cool mist by ultrasonic sound vibrations",
        "Fan through a moistened belt, wick, or filter",
        "Steam from heated water. Warm mist cools the steam before it exits",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "What can enter the air",
      entityAValue: "US EPA: grouped with impeller units for the greatest dispersions of microorganisms and minerals",
      entityBValue: "US EPA: generally disperses less, if any, and is not expected to disperse substantial minerals",
      values: [
        "US EPA: grouped with impeller units for the greatest dispersions of microorganisms and minerals",
        "US EPA: generally disperses less, if any, and is not expected to disperse substantial minerals",
        "US EPA: generally disperses less, if any, and is not expected to disperse substantial minerals. A standing-water tank can still grow microorganisms",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "Water",
      entityAValue: "Low-mineral water such as distilled. Very efficient at dispersing tap-water minerals",
      entityBValue: "Low-mineral water to limit scale. Not expected to disperse substantial minerals",
      values: [
        "Low-mineral water such as distilled. Very efficient at dispersing tap-water minerals",
        "Low-mineral water to limit scale. Not expected to disperse substantial minerals",
        "Low-mineral water to limit scale. Not expected to disperse substantial minerals",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "Burn risk",
      entityAValue: "US EPA definition uses sound vibrations, not boiling",
      entityBValue: "US EPA definition uses a fan and a moistened material, not boiling",
      values: [
        "US EPA definition uses sound vibrations, not boiling",
        "US EPA definition uses a fan and a moistened material, not boiling",
        "Keep out of the reach of children. Steam and boiling water may cause burns",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "Cleaning",
      entityAValue: "Portable: empty, wipe dry, and refill daily. Clean every third day",
      entityBValue: "Same portable schedule, plus the belt, wick, or filter the manufacturer specifies",
      values: [
        "Portable: empty, wipe dry, and refill daily. Clean every third day",
        "Same portable schedule, plus the belt, wick, or filter the manufacturer specifies",
        "Same portable schedule, and keep the unit out of children's reach",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
  ],
  attributes: [
    textAttrN("how-it-works", "How it adds moisture", "Mechanism", [
      { entityId: ULTRASONIC, text: "Cool mist by ultrasonic sound vibrations (US EPA)" },
      { entityId: EVAPORATIVE, text: "Fan blows air through a moistened belt, wick, or filter (US EPA)" },
      { entityId: STEAM, text: "Heats water into steam. Warm mist cools the steam before it exits (US EPA)" },
    ]),
    textAttrN("air", "What can enter the air", "Air", [
      {
        entityId: ULTRASONIC,
        text: "Grouped with impeller units. Generally the greatest dispersions of microorganisms and minerals (US EPA)",
      },
      {
        entityId: EVAPORATIVE,
        text: "Generally disperses less, if any. Not expected to disperse substantial amounts of minerals. A standing-water tank can still grow microorganisms (US EPA)",
      },
      {
        entityId: STEAM,
        text: "Generally disperses less, if any. Not expected to disperse substantial amounts of minerals. A standing-water tank can still grow microorganisms (US EPA)",
      },
    ]),
    textAttrN("water", "Water", "Water", [
      {
        entityId: ULTRASONIC,
        text: "Use low-mineral water such as distilled. Very efficient at dispersing tap-water minerals. White dust and scale can follow (US EPA)",
      },
      {
        entityId: EVAPORATIVE,
        text: "Use low-mineral water so scale does not build. Not expected to disperse substantial amounts of minerals (US EPA). US CPSC: distilled or demineralized, not tap water, for room humidifiers",
      },
      {
        entityId: STEAM,
        text: "Use low-mineral water so scale does not build. Not expected to disperse substantial amounts of minerals (US EPA). US CPSC: distilled or demineralized, not tap water, for room humidifiers",
      },
    ]),
    textAttrN("burns", "Burn risk", "Safety", [
      { entityId: ULTRASONIC, text: "US EPA definition uses sound vibrations, not heating, to make the mist" },
      { entityId: EVAPORATIVE, text: "US EPA definition uses a fan and a moistened belt, wick, or filter, not boiling" },
      { entityId: STEAM, text: "Keep out of the reach of children. Steam and boiling water may cause burns (US EPA)" },
    ]),
    textAttrN("cleaning", "Cleaning and humidity", "Care", [
      {
        entityId: ULTRASONIC,
        text: "Portable: empty, wipe dry, and refill daily. Clean every third day. Do not exceed 50 percent relative humidity (US EPA). US CPSC: 30% to 50% if possible",
      },
      {
        entityId: EVAPORATIVE,
        text: "Same portable schedule, and maintain the belt, wick, or filter. Do not exceed 50 percent relative humidity (US EPA). US CPSC: 30% to 50% if possible",
      },
      {
        entityId: STEAM,
        text: "Same portable schedule, and keep the unit away from children. Do not exceed 50 percent relative humidity (US EPA). US CPSC: 30% to 50% if possible",
      },
    ]),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "The US EPA fact sheet last updated April 29, 2026 says ultrasonic and impeller humidifiers generally appear to produce the greatest dispersions of both microorganisms and minerals, while evaporative and steam vaporizer humidifiers generally disperse less, if any.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      {
        name: "US EPA, Use and Care of Home Humidifiers (last updated April 29, 2026; read 19 November 2026)",
        url: EPA_URL,
      },
      {
        name: "US CPSC, Dirty Humidifiers May Cause Health Problems, Publication 5046 (read 19 November 2026)",
        url: CPSC_URL,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "US EPA, Use and Care of Home Humidifiers",
      url: EPA_URL,
      description:
        "Read 19 November 2026. Fact sheet last updated April 29, 2026. Types, dispersal, distilled water, daily emptying, cleaning every third day, 3% hydrogen peroxide, 50 percent humidity, and the steam burn warning.",
    },
    {
      type: "external",
      label: "US CPSC Publication 5046",
      url: CPSC_URL,
      description:
        "Read 19 November 2026. Dirty Humidifiers May Cause Health Problems. Bacteria and fungi in tanks, white dust, distilled or demineralized water, and relative humidity of 30% to 50% if possible.",
    },
  ],
  metaTitle: "Ultrasonic vs evaporative vs steam humidifier",
});

BUILT.metadata.metaDescription =
  "Choose evaporative or steam if you want the lower-dispersal types the US EPA describes. Choose ultrasonic if you will use distilled water and clean it often.";

export const ULTRASONIC_VS_EVAPORATIVE_VS_STEAM_HUMIDIFIER: EditorialComparison = BUILT;

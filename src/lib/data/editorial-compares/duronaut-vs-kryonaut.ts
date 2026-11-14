import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-421 — Thermal Grizzly Duronaut vs Kryonaut.
 * Sources opened 12 November 2026 (Asia/Jerusalem).
 *
 * Product facts: Thermal Grizzly Duronaut (TG-D-002), Kryonaut (TG-K-100-R),
 * Duronaut Pro (TG-DP-002-R), and Kryonaut Extreme (TG-KE-002-R).
 * Lab figures: Igor Wallossek, igor'sLAB, 7 February 2025. The 1:1 table
 * column is Duronaut (Prototype 2024). The durability section says a retail
 * pack was tested. Conductivity is that lab's measurement, not a current
 * Thermal Grizzly W/(m·K) rating.
 *
 * Not copied: shop prices on the Thermal Grizzly pages, Geizhals prices,
 * "around 9 euros", any CPU temperature delta, warm-water application,
 * "spreads more easily", unitless Min BLT and interface-resistance cells,
 * and the prototype manufacturer cells for density and working temperature.
 * Reddit threads returned 403 or timed out, so thread themes are omitted.
 * winnerName stays null. isHumanReviewed stays false. dataPointCount stays 0.
 * No EDITORIAL_INBOUND_RELATED edit.
 */

const A = "duronaut";
const B = "kryonaut";

const TG_DURONAUT = "https://www.thermal-grizzly.com/en/duronaut/s-tg-d-002";
const TG_KRYONAUT = "https://www.thermal-grizzly.com/en/kryonaut/s-tg-k-100-r";
const TG_DURONAUT_PRO = "https://www.thermal-grizzly.com/en/duronaut-pro/s-tg-dp-002-r";
const TG_KRYONAUT_EXTREME = "https://www.thermal-grizzly.com/en/kryonaut-extreme/s-tg-ke-002-r";
const IGOR_COMPARE =
  "https://www.igorslab.de/en/thermal-grizzly-duronaut-thermal-paste-review-kryonaut-was-yesterday-welcome-to-the-top-10-of-all-pastes/5/";
const IGOR_DURABILITY =
  "https://www.igorslab.de/en/thermal-grizzly-duronaut-thermal-paste-review-kryonaut-was-yesterday-welcome-to-the-top-10-of-all-pastes/4/";
const NOCTUA_FEATURES = "https://www.noctua.at/en/products/nh-d15-g2/features";
const NOCTUA_SPECS = "https://www.noctua.at/en/products/nh-d15-g2/specifications";

const SOURCE_DATE = "2026-11-12";
const PUBLISHED = "2026-11-12T00:00:00Z";
const SPEC = "Product information";

const SHORT_ANSWER =
  "Choose Duronaut if you want the Thermal Grizzly paste built for long-term stability and a minimized pump-out effect, and choose Kryonaut if you want the overclocking paste Thermal Grizzly ranks just behind Duronaut and Duronaut Pro for cooling performance. Neither paste is right for every PC: Thermal Grizzly says the temperature depends on power, the cooler, the contact surfaces, and installation, and it states no fixed temperature advantage for either paste.";

const VERDICT = `Choose Duronaut if you want the paste Thermal Grizzly describes as focused on exceptional long-term stability, with particle shapes and sizes meant to minimize the pump-out effect.

Choose Kryonaut if you want the paste Thermal Grizzly designed for overclocking. In terms of cooling performance, Thermal Grizzly says Kryonaut ranks just behind Duronaut and Duronaut Pro.

Neither paste is right for every PC. Thermal Grizzly gives no fixed temperature advantage for either one. Check current price. No CPU temperature gap between the two pastes is stated here.`;

const TABLE = `Duronaut and Kryonaut from Thermal Grizzly product information opened 12 November 2026. The conductivity row is Igor's Lab on 7 February 2025, for the Duronaut (Prototype 2024) column against Kryonaut, and it is not a current Thermal Grizzly rating.
| Topic | Duronaut | Kryonaut |
| --- | --- | --- |
| Cooling rank | Duronaut is one of the two pastes Kryonaut ranks just behind | Just behind Duronaut and Duronaut Pro |
| Design focus | Long-term stability and minimized pump-out | Designed for overclocking |
| General W/(m·K) rating | Not given since the end of 2020 | Not given since the end of 2020 |
| Igor's Lab conductivity | 4.9 W/m·K, Prototype 2024 column, +55.0% | 3.2 W/m·K |
| Working temperature | -150 to +150 °C | -250 to +350 °C |
| Electrical behavior | Not electrically conductive | Not electrically conductive, 0 pS/m |
| Hardening | No hardening over time | No curing |
| Viscosity | Thick consistency; no Pa·s figure stated | 130-170 Pa·s |
| Pack sizes named | 2 g, 6 g, and 30 g | 1 g, 1.5 ml, 3 ml, and 10 ml |
| Replacement interval | No universal interval | No universal interval |
| Price | Check current price | Check current price |`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

## Key takeaways

- Choose Duronaut for the long-term stability and minimized pump-out effect Thermal Grizzly describes. Choose Kryonaut for the overclocking paste Thermal Grizzly ranks just behind Duronaut and Duronaut Pro for cooling performance.
- Thermal Grizzly has not published general W/(m·K) ratings since the end of 2020. A single conductivity value is not a cooling-performance ranking.
- Igor's Lab, on 7 February 2025, records 4.9 W/m·K for its Duronaut (Prototype 2024) column and 3.2 W/m·K for Kryonaut, with +55.0% beside the 4.9. That is that lab's measurement. It is not a current Thermal Grizzly rating, and it is not a CPU temperature.
- Thermal Grizzly gives no universal replacement interval for either paste. Replace it if temperatures under a comparable load and ambient temperature show a confirmed deterioration, or any time the cooler is removed.
- Duronaut's thick consistency is described as necessary for long-term stability. Thermal Grizzly says a hair dryer can make application easier. No street price is stated here. Check current price.
- Neither paste is right for every PC. Duronaut Pro and Kryonaut Extreme are separate products, described only from Thermal Grizzly's own product information.

${TABLE}

## What Thermal Grizzly says about Duronaut and Kryonaut

Thermal Grizzly describes Duronaut as a high-end paste focused on outstanding thermal conductivity and exceptional long-term stability. The name is tied to durability. The stability is described as coming from a specially engineered silicone oil combined with aluminum microparticles and zinc oxide nanoparticles of various shapes. Those particle shapes and sizes are said to minimize the pump-out effect, support adhesion, and allow a very thin layer. The properties list says extreme long-term stability, outstanding thermal conductivity, electrically non-conductive, no hardening over time, and sizes of 2 g, 6 g, and 30 g. The 2 g scope of delivery lists one applicator, one TG Spatula, and one TG Spatula Pro.

Kryonaut is described as created for extremely demanding applications and for the overclocking community, and as a top product for critical industrial cooling. The properties list says designed for overclocking, excellent thermal conductivity, no curing, long-term durability, no electrical conductivity, and sizes of 1 g, 1.5 ml, 3 ml, and 10 ml. Thermal Grizzly says a special structure halts the drying-out process at temperatures of up to 80°C, and that the nano-aluminum and zinc oxide components bond to compensate for unevenness. The product information lists color silver matt, density 3.7 g/cm³, electrical conductivity 0 pS/m, operating temperature -250°C to +350°C, and viscosity 130-170 Pa·s.

In terms of cooling performance, Thermal Grizzly says Kryonaut ranks just behind Duronaut and Duronaut Pro. It also says to use independent tests for comparison. Both product answers say the temperature you can achieve depends on power consumption, the cooler, the contact surfaces, and installation. Both say a single thermal conductivity value does not allow a reliable comparison, because the test method, temperature, mounting pressure, and contact surfaces all affect the result. Thermal Grizzly has not published general W/(m·K) ratings since the end of 2020. No W/(m·K) figure is stated here as a Thermal Grizzly rating.

Duronaut's stated working range is -150 to +150 °C. That material specification is not a blanket approval for every continuous high-temperature process. Kryonaut's stated range is -250 to +350 °C, with the same kind of limit. Conventional paste, for both products, can be used on common copper, nickel, or aluminum contact surfaces, and neither paste is suitable for bridging gaps larger than 0.2 mm. The same Kryonaut answer says Duronaut and Duronaut Pro are designed for particularly high long-term stability, and that Kryonaut works best between two copper or nickel-plated surfaces. Kryonaut's own properties list still includes long-term durability. That property and the rank sentence are both Thermal Grizzly's. They are not a temperature test.

## What Igor's Lab measured on 7 February 2025

Igor's Lab records a higher thermal conductivity for its Duronaut (Prototype 2024) column than for Kryonaut in that one comparison: 4.9 W/m·K against 3.2 W/m·K, with +55.0% beside the 4.9. The review date is 7 February 2025, Igor Wallossek. Those numbers are that lab's Measurements row. They are not a current Thermal Grizzly W/(m·K) rating, and they are not a CPU or GPU temperature.

The same comparison's recommendation line for the prototype column says it is a good paste, durable, allows a very thin layer on CPU and GPU, and can be warmed up for a better application. The Kryonaut line says it is not for sub-zero temperatures, is similar to Kryonaut Extreme but a different siloxane, and has medium durability and is not for graphics cards because of pump-out. That graphics-card line is Igor's Lab's note. Thermal Grizzly still says Kryonaut can be used on a GPU die when the cooler is designed for paste.

The durability section says a commercially available retail pack from mass production was used, so series paste could be compared with the prototype, and that the result confirmed the expected efficiency and stability. It also says Duronaut's viscosity makes application somewhat more difficult, that slight heating makes application easier, and that the tests reached thin layers of less than 25 µm. The pump-out method described there is a swelling test on a TIMA5, not an ageing test over weeks. The layer-thickness increase is described as less than 60%, to around 158%, similar to Polartherm X10, and the paste is called one of the more durable pastes in that test. The durability estimates are for smooth surfaces such as dies and polished or clean nickel-plated coolers. The same section says the test does not determine mechanical separation of the mixture or chemical change.

No CPU temperature difference between Duronaut and Kryonaut is stated in the text used here. A chart series that did not load as readable text is not turned into a degree gap.

## How to apply the paste

Apply either paste at room temperature on clean, dry surfaces, and spread it slowly into a thin layer with even pressure. Fast wiping can lift the paste. A thick consistency is not a defect in itself. For Duronaut, Thermal Grizzly says that consistency is necessary for high long-term stability. For Kryonaut, it says the thick consistency is intentional because it improves long-term stability. Do not thin either paste with solvents or oils. Warming the product with a hair dryer can make it easier to apply. Cover the contact area, especially an exposed die. Thermal Grizzly says too much paste does not by itself make temperatures worse, because excess is squeezed out. The Duronaut 2 g pack includes the TG Spatula and the TG Spatula Pro. Kryonaut's application instructions also say to use the spatula.

## GPUs, laptops, and pump-out

Pump-out, in Thermal Grizzly's Kryonaut answer, is temperature change gradually displacing paste from the contact area. A thin, even layer and a correct mount reduce that risk and do not eliminate it in every configuration. Duronaut's answer says the paste is optimized for high long-term stability and minimal displacement, and that complete freedom from pump-out cannot be guaranteed. If temperatures rise, Thermal Grizzly says to check the mount, the cooler, and the contact pattern first. It also says CPU boost can turn improved heat transfer into higher performance rather than a lower temperature, so compare clock speed as well as temperature.

Both pastes can be used on laptop CPU and GPU dies when the cooling system is designed for paste and makes reliable contact. Cover the die. Larger gaps around memory and voltage regulators need pads or putty, not paste. Thermal Grizzly says that if pump-out keeps occurring, long-term stability and the cooler geometry matter more than a general comparison value, and that Duronaut is designed for those applications. The Kryonaut laptop answer says Duronaut or Duronaut Pro are generally better suited to laptops. That is Thermal Grizzly's laptop statement, not a temperature test.

On a direct-die CPU, Thermal Grizzly says both pastes can be affected by pump-out, and that Kryonaut can be particularly susceptible. For Thermal Grizzly direct-die coolers and the underside of its High Performance Heatspreaders, Thermal Grizzly recommends liquid metal such as Conductonaut or Conductonaut Extreme instead. A console contact that Duronaut's product information says was designed for liquid metal, such as a PS5, should not be converted to paste without checking the cooling design.

Igor's Lab's pump-out discussion says smooth graphics-card surfaces are especially exposed because the paste has less mechanical grip, and its Kryonaut note says medium durability and not for graphics cards because of pump-out. Use that as Igor's Lab's 7 February 2025 note, next to Thermal Grizzly's own limits, not as a universal ban.

## A desktop CPU under an NH-D15 G2

On a desktop processor, including a Ryzen 7 9800X3D, Thermal Grizzly's compatibility note is the same for both pastes: direct contact with a correctly installed cooler, and no fixed temperature advantage. The Ryzen 7 7800X3D vs Ryzen 7 9800X3D comparison and the Ryzen 7 9700X vs 9800X3D comparison are separate CPU comparisons. They do not compare thermal paste.

Noctua's NH-D15 G2 specification lists NT-H2 high-grade thermal compound in the scope of delivery, along with an NA-TPG1 thermal paste guard for AM5. The heatsink base, heatpipes, and fins are listed as nickel plated, and the base and heatpipes are copper. Socket support on the features list includes AMD AM5 and AM4. Noctua says the included NT-H2 provides even better performance than NT-H1. Noctua does not give a temperature for NT-H2 against Duronaut or Kryonaut in the sections opened on 12 November 2026. Choose the included NT-H2 if you want the compound Noctua ships with that cooler. Choose Duronaut or Kryonaut only after you check current price. No temperature gap among the three compounds is stated here.

Kryonaut works best between two copper or nickel-plated surfaces, in Thermal Grizzly's words. The NH-D15 G2 base is copper with nickel plating. That match is a materials note. It is not a measured temperature.

## When to replace Duronaut or Kryonaut

Thermal Grizzly gives no universal replacement interval for Duronaut or for Kryonaut once the paste is installed. Check temperatures under comparable loads and comparable ambient temperatures. Replace the paste if temperatures show a confirmed deterioration, or if you have removed the cooler. A universal service life cannot be specified.

Shelf life is a different clock. For Kryonaut, Thermal Grizzly says an unopened tube can be used for up to 10 years and an opened tube for up to 5 years, stored sealed, dry, and away from light and large temperature swings. That storage line is not an installed service interval. Duronaut's product information opened on 12 November 2026 does not state a matching storage life, so none is given here.

## Duronaut Pro and Kryonaut Extreme

Duronaut Pro is a separate paste. Thermal Grizzly says its heat transfer is improved compared with Duronaut, while the focus stays on particularly high long-term stability and low pump-out. It says Duronaut Pro is currently its highest-performing conventional thermal paste. It still has not published a general W/(m·K) rating since the end of 2020, and it still says a fixed temperature advantage cannot be specified for every system. Properties: extreme long-term stability, excellent thermal conductivity, electrically non-conductive, no hardening over time, and sizes of 2 g, 6 g, and 30 g. The 2 g scope lists an applicator, a TG Spatula, and a TG Spatula Pro. Color is gray and electrical conductivity is 0 pS/m. Thermal Grizzly also says Duronaut Pro is very well suited to extreme overclocking with liquid nitrogen or dry ice. The same no-universal-interval rule applies. Complete freedom from pump-out is not guaranteed.

Kryonaut Extreme is based on Kryonaut. Thermal Grizzly says the smallest particle size, a thinner minimum layer height, and improved low-temperature application are what it changed, and that the paste shows its capability in cryogenic use such as liquid nitrogen. It is electrically non-conductive, adds aluminium oxide nanoparticles, does not cure, and is listed for overclocking with long-term durability. Named sizes are 2 g, 6 g, and 9 ml. The product information lists color pink, density 3.76 g/cm³, electrical conductivity 0 pS/m, and viscosity 130-180 Pa·s. The stated temperature range is -250 to +350 °C, with the same warning that this is not approval for every continuous high-temperature process. Storage is up to 10 years unopened and up to 5 years opened. The laptop answer again says Duronaut or Duronaut Pro are generally better suited to laptops. No general W/(m·K) rating is given.

Choose Duronaut Pro if you want the conventional paste Thermal Grizzly currently calls its highest-performing, with the same long-term-stability focus. Choose Kryonaut Extreme if you want the Kryonaut-based paste Thermal Grizzly describes for liquid-nitrogen overclocking. Check current price for either one. Neither sentence is a temperature result.

## Choose Duronaut if

- You want the long-term stability and minimized pump-out effect Thermal Grizzly describes, including on a laptop die where it says Duronaut is designed for that use.
- You can spread a thick paste slowly, with the included spatula, and use a hair dryer if it is hard to move.
- You will check current price and treat Igor's Lab's 4.9 W/m·K as that lab's 7 February 2025 prototype-column measurement, not as a Thermal Grizzly rating.

## Choose Kryonaut if

- You want the overclocking paste Thermal Grizzly ranks just behind Duronaut and Duronaut Pro for cooling performance.
- Your contact surfaces are the copper or nickel-plated pair Thermal Grizzly says Kryonaut works best between.
- You will check current price, and you will not treat Igor's Lab's "not for graphics cards" note as a Thermal Grizzly ban.`;

const FAQS = [
  {
    question: "Is Duronaut better than Kryonaut?",
    answer:
      "Choose Duronaut if you want the long-term stability and minimized pump-out effect Thermal Grizzly describes. Choose Kryonaut if you want the overclocking paste that Thermal Grizzly ranks just behind Duronaut and Duronaut Pro for cooling performance. Thermal Grizzly says the temperature depends on power, the cooler, the contact surfaces, and installation, and that a fixed temperature advantage cannot be specified for every system. Neither paste is right for every PC. Check current price.",
  },
  {
    question: "What is the thermal conductivity of Duronaut?",
    answer:
      "Thermal Grizzly has not published general W/(m·K) ratings since the end of 2020. It says a single conductivity value does not reliably predict cooling, because the test method, temperature, mounting pressure, and contact surfaces all change the result. Igor's Lab, on 7 February 2025, records 4.9 W/m·K for the Duronaut (Prototype 2024) column and 3.2 W/m·K for Kryonaut, with +55.0% beside the 4.9. That is that lab's measurement of those columns. It is not a current Thermal Grizzly rating, and it is not a CPU temperature.",
  },
  {
    question: "How often should you replace Duronaut or Kryonaut?",
    answer:
      "Thermal Grizzly gives no universal replacement interval for either paste. Replace it if temperatures under a comparable load and a comparable ambient temperature show a confirmed deterioration, or any time you remove the cooler. A universal service life is not specified. Kryonaut's storage line is separate: up to 10 years unopened and up to 5 years opened. That is shelf life, not time in a running PC. Duronaut's opened product information does not state a matching storage life.",
  },
  {
    question: "Why is Duronaut hard to spread?",
    answer:
      "Thermal Grizzly says a thick consistency is not a defect. For Duronaut, that consistency is necessary for high long-term stability. Spread it very slowly with the spatula, at room temperature, on a clean dry surface. Warming the syringe with a hair dryer can make it easier. Do not thin it with solvents or oils. The 2 g pack includes a TG Spatula and a TG Spatula Pro. Igor's Lab, on 7 February 2025, also says the viscosity makes application somewhat more difficult and that slight heating helps.",
  },
  {
    question: "Can Duronaut or Kryonaut be used on a GPU?",
    answer:
      "Thermal Grizzly says both can be used on a GPU die when the cooler is designed for paste and makes reliable contact. Cover the die with a thin layer. Gaps larger than 0.2 mm, including many gaps around memory, need pads or putty instead. Kryonaut can be particularly susceptible to pump-out on a direct-die CPU, and Thermal Grizzly says Duronaut or Duronaut Pro are generally better suited to laptops. Igor's Lab's 7 February 2025 note calls Kryonaut medium durability and not for graphics cards because of pump-out. That note is the lab's, and it is not a CPU temperature.",
  },
  {
    question: "Does the Noctua NH-D15 G2 include thermal paste?",
    answer:
      "Yes. Noctua's NH-D15 G2 specification lists NT-H2 in the scope of delivery, and the features text says that NT-H2 provides even better performance than NT-H1. No temperature for NT-H2 against Duronaut or Kryonaut is stated here. The heatsink base is copper with nickel plating, and Kryonaut's product information says Kryonaut works best between two copper or nickel-plated surfaces. That is a materials note, not a measured temperature. Check current price if you buy a Thermal Grizzly paste as well.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "duronaut-vs-kryonaut",
  title: "Duronaut vs Kryonaut Thermal Paste",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Thermal Grizzly Duronaut",
      shortDesc:
        "High-end paste Thermal Grizzly describes for long-term stability, with aluminum microparticles and zinc oxide nanoparticles.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Long-term stability and a minimized pump-out effect (Thermal Grizzly)",
        "No hardening over time, and not electrically conductive (Thermal Grizzly)",
        "2 g pack includes a TG Spatula and a TG Spatula Pro (Thermal Grizzly)",
      ],
      cons: [
        "Thick consistency; a hair dryer can make spreading easier (Thermal Grizzly)",
        "No general W/(m·K) rating since the end of 2020 (Thermal Grizzly)",
        "No street price is stated here. Check current price",
      ],
      bestFor:
        "A paste-designed cooler when you want the long-term stability Thermal Grizzly describes",
    },
    {
      id: B,
      slug: B,
      name: "Thermal Grizzly Kryonaut",
      shortDesc:
        "Overclocking paste Thermal Grizzly ranks just behind Duronaut and Duronaut Pro for cooling performance.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Designed for overclocking, with no curing (Thermal Grizzly)",
        "Not electrically conductive; 0 pS/m (Thermal Grizzly)",
        "Works best between two copper or nickel-plated surfaces (Thermal Grizzly)",
      ],
      cons: [
        "Ranks just behind Duronaut and Duronaut Pro for cooling (Thermal Grizzly)",
        "Igor's Lab, 7 February 2025: medium durability, not for graphics cards (pump-out)",
        "No street price is stated here. Check current price",
      ],
      bestFor:
        "An overclocking mount on copper or nickel-plated surfaces, after you check current price",
    },
  ],
  keyDifferences: [
    {
      label: "Cooling rank",
      entityAValue: "One of the two pastes Kryonaut ranks just behind",
      entityBValue: "Just behind Duronaut and Duronaut Pro",
      winner: "tie",
    },
    {
      label: "Design focus",
      entityAValue: "Long-term stability and minimized pump-out",
      entityBValue: "Designed for overclocking",
      winner: "tie",
    },
    {
      label: "General W/(m·K) rating",
      entityAValue: "Not given since the end of 2020",
      entityBValue: "Not given since the end of 2020",
      winner: "tie",
    },
    {
      label: "Igor's Lab conductivity, 7 February 2025",
      entityAValue: "4.9 W/m·K, Prototype 2024 column, +55.0%",
      entityBValue: "3.2 W/m·K",
      winner: "tie",
    },
    {
      label: "Working temperature",
      entityAValue: "-150 to +150 °C",
      entityBValue: "-250 to +350 °C",
      winner: "tie",
    },
    {
      label: "Electrical behavior",
      entityAValue: "Not electrically conductive",
      entityBValue: "Not electrically conductive, 0 pS/m",
      winner: "tie",
    },
    {
      label: "Hardening",
      entityAValue: "No hardening over time",
      entityBValue: "No curing",
      winner: "tie",
    },
    {
      label: "Viscosity",
      entityAValue: "Thick; no Pa·s figure stated",
      entityBValue: "130-170 Pa·s",
      winner: "tie",
    },
    {
      label: "Named pack sizes",
      entityAValue: "2 g, 6 g, 30 g",
      entityBValue: "1 g, 1.5 ml, 3 ml, 10 ml",
      winner: "tie",
    },
    {
      label: "Replacement interval",
      entityAValue: "No universal interval",
      entityBValue: "No universal interval",
      winner: "tie",
    },
    {
      label: "Price",
      entityAValue: "Check current price",
      entityBValue: "Check current price",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("focus", "Design focus", SPEC, A, B, "Long-term stability and minimized pump-out", "Designed for overclocking"),
    textAttr(
      "rank",
      "Cooling rank",
      SPEC,
      A,
      B,
      "Duronaut is one of the two pastes Kryonaut ranks just behind",
      "Just behind Duronaut and Duronaut Pro"
    ),
    textAttr(
      "conductivity-rating",
      "General W/(m·K) rating",
      SPEC,
      A,
      B,
      "Not given since the end of 2020",
      "Not given since the end of 2020"
    ),
    textAttr(
      "igor-lambda",
      "Igor's Lab thermal conductivity, 7 February 2025",
      "Lab measurement",
      A,
      B,
      "4.9 W/m·K on the Duronaut (Prototype 2024) column, with +55.0%",
      "3.2 W/m·K"
    ),
    textAttr("temp", "Working temperature", SPEC, A, B, "-150 to +150 °C", "-250 to +350 °C"),
    textAttr(
      "electrical",
      "Electrical behavior",
      SPEC,
      A,
      B,
      "Not electrically conductive",
      "Not electrically conductive, 0 pS/m"
    ),
    textAttr("cure", "Hardening", SPEC, A, B, "No hardening over time", "No curing"),
    textAttr("viscosity", "Viscosity", SPEC, A, B, "Thick consistency; no Pa·s figure stated", "130-170 Pa·s"),
    textAttr("sizes", "Named pack sizes", SPEC, A, B, "2 g, 6 g, and 30 g", "1 g, 1.5 ml, 3 ml, and 10 ml"),
    textAttr("density", "Density", SPEC, A, B, "Not stated in the opened product information", "3.7 g/cm³"),
    textAttr(
      "apply",
      "Application help",
      SPEC,
      A,
      B,
      "Hair dryer; TG Spatula and TG Spatula Pro in the 2 g pack",
      "Hair dryer; instructions say to use a spatula"
    ),
    textAttr("interval", "Replacement interval", SPEC, A, B, "No universal interval", "No universal interval"),
    textAttr("price", "Price", SPEC, A, B, "Check current price", "Check current price"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      title: "Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming",
      category: "technology",
    },
    {
      slug: "ryzen-7-9700x-vs-ryzen-7-9800x3d",
      title: "Ryzen 7 9700X vs 9800X3D: Which Gaming CPU to Buy",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "Thermal Grizzly ranks Kryonaut just behind Duronaut and Duronaut Pro for cooling, and it has not published general W/(m·K) ratings since the end of 2020. Igor's Lab measured 4.9 W/m·K and 3.2 W/m·K on 7 February 2025. Check current price.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Thermal Grizzly Duronaut", url: TG_DURONAUT },
      { name: "Thermal Grizzly Kryonaut", url: TG_KRYONAUT },
      { name: "Thermal Grizzly Duronaut Pro", url: TG_DURONAUT_PRO },
      { name: "Thermal Grizzly Kryonaut Extreme", url: TG_KRYONAUT_EXTREME },
      { name: "Igor's Lab Duronaut vs Kryonaut comparison, 7 February 2025", url: IGOR_COMPARE },
      { name: "Igor's Lab Duronaut durability section, 7 February 2025", url: IGOR_DURABILITY },
      { name: "Noctua NH-D15 G2 features", url: NOCTUA_FEATURES },
      { name: "Noctua NH-D15 G2 specifications", url: NOCTUA_SPECS },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Thermal Grizzly Duronaut",
      url: TG_DURONAUT,
      description:
        "Engineered silicone oil, aluminum microparticles, zinc oxide nanoparticles, minimized pump-out, very thin layers, no hardening, electrically non-conductive, sizes 2 g, 6 g, and 30 g. Working range -150 to +150 °C. No general W/(m·K) rating since the end of 2020. No universal replacement interval. Hair dryer for application. 2 g pack includes TG Spatula and TG Spatula Pro.",
    },
    {
      type: "external",
      label: "Thermal Grizzly Kryonaut",
      url: TG_KRYONAUT,
      description:
        "Designed for overclocking. Ranks just behind Duronaut and Duronaut Pro for cooling. No curing. 0 pS/m. Density 3.7 g/cm³. Viscosity 130-170 Pa·s. -250°C to +350°C. Drying-out structure up to 80°C. Works best between two copper or nickel-plated surfaces. Storage up to 10 years unopened and 5 years opened. No universal replacement interval.",
    },
    {
      type: "external",
      label: "Thermal Grizzly Duronaut Pro",
      url: TG_DURONAUT_PRO,
      description:
        "Heat transfer improved versus Duronaut, with high long-term stability and low pump-out. Called Thermal Grizzly's highest-performing conventional thermal paste. Sizes 2 g, 6 g, and 30 g. Gray, 0 pS/m, no hardening. Suited to liquid nitrogen or dry ice. No general W/(m·K) rating since the end of 2020.",
    },
    {
      type: "external",
      label: "Thermal Grizzly Kryonaut Extreme",
      url: TG_KRYONAUT_EXTREME,
      description:
        "Based on Kryonaut, for cryogenic overclocking including liquid nitrogen. Smaller particles, thinner minimum layer, no curing. Pink, 3.76 g/cm³, 0 pS/m, viscosity 130-180 Pa·s, -250 to +350 °C. Sizes 2 g, 6 g, and 9 ml. Thermal Grizzly says Duronaut or Duronaut Pro are generally better suited to laptops.",
    },
    {
      type: "external",
      label: "Igor's Lab comparison, 7 February 2025",
      url: IGOR_COMPARE,
      description:
        "Measurements row: 4.9 W/m·K for Duronaut (Prototype 2024) and 3.2 W/m·K for Kryonaut, +55.0%. Kryonaut note: medium durability, not for graphics cards (pump-out), not for sub-zero. Prototype note: durable, very thin layer, can be warmed for application.",
    },
    {
      type: "external",
      label: "Igor's Lab durability section, 7 February 2025",
      url: IGOR_DURABILITY,
      description:
        "Retail pack tested against the prototype. Viscosity makes application harder; slight heating helps; layers under 25 µm. Swelling test, not a weeks-long ageing test. Layer-thickness increase under 60%, to around 158%. No CPU temperature delta copied.",
    },
    {
      type: "external",
      label: "Noctua NH-D15 G2 features",
      url: NOCTUA_FEATURES,
      description:
        "The cooler includes NT-H2, described as providing even better performance than NT-H1. Socket support includes AM5 and AM4. No temperature against Duronaut or Kryonaut.",
    },
    {
      type: "external",
      label: "Noctua NH-D15 G2 specifications",
      url: NOCTUA_SPECS,
      description:
        "Scope of delivery includes NT-H2 and the NA-TPG1 AM5 paste guard. Heatsink base is copper, nickel plated.",
    },
  ],
  metaTitle: "Duronaut vs Kryonaut Thermal Paste",
});

BUILT.metadata.metaDescription =
  "Choose Duronaut for long-term stability or Kryonaut for overclocking. Thermal Grizzly ranks Kryonaut just behind Duronaut. Check current price.";

export const DURONAUT_VS_KRYONAUT: EditorialComparison = BUILT;

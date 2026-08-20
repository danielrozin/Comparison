import type { ComparisonV3Props } from "./ComparisonV3";
import demo from "./data/messi-vs-ronaldo.json";

/**
 * Studio default. Regenerate any slug's props with:
 *   node scripts/build-v3-props.mjs <slug>
 */
export const V3_DEMO_PROPS = demo as unknown as ComparisonV3Props;

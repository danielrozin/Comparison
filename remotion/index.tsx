import React from "react";
import { Composition, registerRoot } from "remotion";
import { ComparisonVideo, type ComparisonVideoProps } from "./ComparisonVideo";

const DEMO_PROPS: ComparisonVideoProps = {
  title: "Dyson vs Shark Vacuum",
  entityA: "Dyson",
  entityB: "Shark",
  category: "Products",
  stats: [
    { label: "Price", valueA: "$599", valueB: "$299", winner: "b" },
    { label: "Suction Power", valueA: "280 AW", valueB: "200 AW", winner: "a" },
    { label: "Weight", valueA: "6.8 lbs", valueB: "4.5 lbs", winner: "b" },
    { label: "Battery Life", valueA: "60 min", valueB: "45 min", winner: "a" },
    { label: "Warranty", valueA: "2 years", valueB: "5 years", winner: "b" },
    { label: "Filtration", valueA: "HEPA", valueB: "Anti-Allergen", winner: "a" },
  ],
  verdict:
    "Shark delivers 80% of Dyson's performance at half the cost. Dyson wins on raw power and filtration. For most homes, Shark is the smarter buy.",
  slug: "dyson-vs-shark-vacuum",
};

const FPS = 30;
const TITLE_DURATION = 45;
const STAT_DURATION = 45;
const VERDICT_DURATION = 60;

export const RemotionRoot: React.FC = () => {
  const totalFrames =
    TITLE_DURATION + DEMO_PROPS.stats.length * STAT_DURATION + VERDICT_DURATION;

  return (
    <Composition
      id="ComparisonVideo"
      component={ComparisonVideo}
      durationInFrames={totalFrames}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={DEMO_PROPS}
    />
  );
};

registerRoot(RemotionRoot);

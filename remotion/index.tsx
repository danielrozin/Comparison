import React from "react";
import { Composition, registerRoot } from "remotion";
import {
  ComparisonVideo,
  type ComparisonVideoProps,
  FPS,
  getTotalFrames,
} from "./ComparisonVideo";
import { ComparisonVideoXL, getXLTotalFrames } from "./ComparisonVideoXL";
import { ComparisonVideoV2, getV2TotalFrames } from "./ComparisonVideoV2";

const DEFAULT_PROPS: ComparisonVideoProps = {
  title: "BMW vs Mercedes-Benz",
  entityA: "BMW",
  entityB: "Mercedes-Benz",
  category: "Automotive",
  shortAnswer:
    "BMW delivers sharper driving dynamics and sportier handling, while Mercedes-Benz leads in luxury refinement, interior comfort, and cutting-edge cabin technology.",
  keyDifferences: [
    { label: "Driving Feel", entityAValue: "Sport-focused", entityBValue: "Comfort-focused", winner: "a" },
    { label: "Interior Luxury", entityAValue: "Premium", entityBValue: "Ultra-luxury", winner: "b" },
    { label: "Starting Price", entityAValue: "$38,800", entityBValue: "$43,550", winner: "a" },
    { label: "Tech Innovation", entityAValue: "iDrive 9", entityBValue: "MBUX Hyperscreen", winner: "b" },
    { label: "Performance Range", entityAValue: "M Series", entityBValue: "AMG Line", winner: "tie" },
  ],
  stats: [
    { label: "Starting Price", valueA: "$38,800", valueB: "$43,550", winner: "a" },
    { label: "Horsepower (Flagship)", valueA: "617 HP", valueB: "603 HP", winner: "a" },
    { label: "0-60 mph", valueA: "3.6 sec", valueB: "3.5 sec", winner: "b" },
    { label: "Interior Rating", valueA: "9/10", valueB: "10/10", winner: "b" },
    { label: "Driving Dynamics", valueA: "10/10", valueB: "8/10", winner: "a" },
    { label: "Fuel Efficiency", valueA: "28 MPG", valueB: "27 MPG", winner: "a" },
    { label: "Warranty", valueA: "4 yr / 50K", valueB: "4 yr / 50K", winner: "tie" },
    { label: "Global Sales (2025)", valueA: "2.25M", valueB: "2.49M", winner: "b" },
  ],
  prosA: ["Superior driving dynamics", "More affordable entry price", "Better fuel efficiency", "Iconic M performance line"],
  consA: ["Less luxurious interiors", "Smaller dealer network", "Firmer ride quality"],
  prosB: ["Best-in-class interior luxury", "MBUX Hyperscreen tech", "Smoother ride comfort", "Stronger resale value"],
  consB: ["Higher starting price", "Heavier vehicles", "Complex infotainment learning curve"],
  verdict:
    "BMW edges ahead for driving enthusiasts who crave handling precision and sportiness. Mercedes-Benz wins for buyers who prioritize luxury, comfort, and cutting-edge interior tech. It's a 3-3 tie on the stats — your choice depends on what you value most.",
  slug: "bmw-vs-mercedes-benz",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vertical 1080x1920 — TikTok/Shorts/Reels */}
      <Composition
        id="ComparisonVideo"
        component={ComparisonVideo}
        durationInFrames={getTotalFrames()}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={DEFAULT_PROPS}
      />
      {/* Landscape 1920x1080 — YouTube main feed */}
      <Composition
        id="ComparisonVideoLandscape"
        component={ComparisonVideo}
        durationInFrames={getTotalFrames()}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_PROPS}
      />
      {/* Vertical XL — bigger text */}
      <Composition
        id="ComparisonVideoXL"
        component={ComparisonVideoXL}
        durationInFrames={getXLTotalFrames()}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={DEFAULT_PROPS}
      />
      {/* V2 preview — upgraded visuals (vertical 1080x1920) */}
      <Composition
        id="ComparisonVideoV2"
        component={ComparisonVideoV2}
        durationInFrames={getV2TotalFrames()}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={DEFAULT_PROPS}
      />
      {/* V2 preview — landscape variant */}
      <Composition
        id="ComparisonVideoV2Landscape"
        component={ComparisonVideoV2}
        durationInFrames={getV2TotalFrames()}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_PROPS}
      />
    </>
  );
};

registerRoot(RemotionRoot);

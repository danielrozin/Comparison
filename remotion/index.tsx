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
import { DEMO_PROPS } from "./__fixtures__/demo-props";
import {
  ComparisonV3,
  getV3TotalFrames,
  type ComparisonV3Props,
} from "./v3/ComparisonV3";
import { V3_DEMO_PROPS } from "./v3/demo-props";

const v2Metadata = ({ props }: { props: ComparisonVideoProps }) => ({
  durationInFrames: getV2TotalFrames(props.stats?.length ?? 5),
});

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
        defaultProps={DEMO_PROPS}
      />
      {/* Landscape 1920x1080 — YouTube main feed */}
      <Composition
        id="ComparisonVideoLandscape"
        component={ComparisonVideo}
        durationInFrames={getTotalFrames()}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={DEMO_PROPS}
      />
      {/* Vertical XL — bigger text */}
      <Composition
        id="ComparisonVideoXL"
        component={ComparisonVideoXL}
        durationInFrames={getXLTotalFrames()}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={DEMO_PROPS}
      />
      {/* V2 preview — upgraded visuals (vertical 1080x1920) */}
      <Composition
        id="ComparisonVideoV2"
        component={ComparisonVideoV2}
        durationInFrames={getV2TotalFrames(DEMO_PROPS.stats.length)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={DEMO_PROPS}
        calculateMetadata={v2Metadata}
      />
      {/* V2 preview — landscape variant */}
      <Composition
        id="ComparisonVideoV2Landscape"
        component={ComparisonVideoV2}
        durationInFrames={getV2TotalFrames(DEMO_PROPS.stats.length)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={DEMO_PROPS}
        calculateMetadata={v2Metadata}
      />
      {/* V3 "Head to Head" — photo-led, scoreboard-driven. Vertical. */}
      <Composition
        id="ComparisonV3"
        component={ComparisonV3}
        durationInFrames={getV3TotalFrames(V3_DEMO_PROPS.stats.length, V3_DEMO_PROPS.timings)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={V3_DEMO_PROPS}
        calculateMetadata={({ props }: { props: ComparisonV3Props }) => ({
          durationInFrames: getV3TotalFrames(props.stats?.length ?? 5, props.timings),
        })}
      />
      {/* V3 landscape — YouTube main feed. */}
      <Composition
        id="ComparisonV3Landscape"
        component={ComparisonV3}
        durationInFrames={getV3TotalFrames(V3_DEMO_PROPS.stats.length, V3_DEMO_PROPS.timings)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={V3_DEMO_PROPS}
        calculateMetadata={({ props }: { props: ComparisonV3Props }) => ({
          durationInFrames: getV3TotalFrames(props.stats?.length ?? 5, props.timings),
        })}
      />
    </>
  );
};

registerRoot(RemotionRoot);

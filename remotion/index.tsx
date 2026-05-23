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
    </>
  );
};

registerRoot(RemotionRoot);

import React from 'react';
import {Composition} from 'remotion';
import {TravelSequence, CardStage, LockedTitleCuts, GlyphGather, PanelMosaic, CirclePortal, getShotDuration} from '../motion';

// Literal IDs and props let Remotion Studio persist parameter edits.
export const RemotionRoot = () => (
  <>
    <Composition
      id="TravelSequence" component={TravelSequence}
      width={1920} height={1080} fps={30}
      durationInFrames={getShotDuration('TravelSequence', 30, 1)}
      defaultProps={{
        title: '山海之间', subtitle: '去看见 · 去感受 · 去生活',
        accent: '#ecd58e', speed: 1, seed: 7, gap: 8, media: [],
      }}
      calculateMetadata={({props}) => ({durationInFrames: getShotDuration('TravelSequence', 30, props.speed)})}
    />
    <Composition
      id="CardStage" component={CardStage}
      width={1920} height={1080} fps={30}
      durationInFrames={getShotDuration('CardStage', 30, 1)}
      defaultProps={{
        title: '山海之间', subtitle: '去看见 · 去感受 · 去生活',
        accent: '#ecd58e', speed: 1, seed: 7, gap: 8, media: [],
      }}
      calculateMetadata={({props}) => ({durationInFrames: getShotDuration('CardStage', 30, props.speed)})}
    />
    <Composition
      id="LockedTitleCuts" component={LockedTitleCuts}
      width={1920} height={1080} fps={30}
      durationInFrames={getShotDuration('LockedTitleCuts', 30, 1)}
      defaultProps={{
        title: '山海之间', subtitle: '去看见 · 去感受 · 去生活',
        accent: '#ecd58e', speed: 1, seed: 7, gap: 8, media: [],
      }}
      calculateMetadata={({props}) => ({durationInFrames: getShotDuration('LockedTitleCuts', 30, props.speed)})}
    />
    <Composition
      id="GlyphGather" component={GlyphGather}
      width={1920} height={1080} fps={30}
      durationInFrames={getShotDuration('GlyphGather', 30, 1)}
      defaultProps={{
        title: '山海之间', subtitle: '去看见 · 去感受 · 去生活',
        accent: '#ecd58e', speed: 1, seed: 7, gap: 8, media: [],
      }}
      calculateMetadata={({props}) => ({durationInFrames: getShotDuration('GlyphGather', 30, props.speed)})}
    />
    <Composition
      id="PanelMosaic" component={PanelMosaic}
      width={1920} height={1080} fps={30}
      durationInFrames={getShotDuration('PanelMosaic', 30, 1)}
      defaultProps={{
        title: '山海之间', subtitle: '去看见 · 去感受 · 去生活',
        accent: '#ecd58e', speed: 1, seed: 7, gap: 8, media: [],
      }}
      calculateMetadata={({props}) => ({durationInFrames: getShotDuration('PanelMosaic', 30, props.speed)})}
    />
    <Composition
      id="CirclePortal" component={CirclePortal}
      width={1920} height={1080} fps={30}
      durationInFrames={getShotDuration('CirclePortal', 30, 1)}
      defaultProps={{
        title: '山海之间', subtitle: '去看见 · 去感受 · 去生活',
        accent: '#ecd58e', speed: 1, seed: 7, gap: 8, media: [],
      }}
      calculateMetadata={({props}) => ({durationInFrames: getShotDuration('CirclePortal', 30, props.speed)})}
    />
  </>
);

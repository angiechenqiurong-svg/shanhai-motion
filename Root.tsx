import React from 'react';
import {Composition} from 'remotion';
import {components,defaultProps,getShotDuration,shots} from './motion';

export const RemotionRoot = () => <>{shots.map(shot => <Composition
  key={shot.id} id={shot.id} component={components[shot.id]}
  width={1920} height={1080} fps={30}
  durationInFrames={getShotDuration(shot.id,30,1)} defaultProps={defaultProps}
  calculateMetadata={({props})=>({durationInFrames:getShotDuration(shot.id,30,props.speed)})}
/>)}</>;

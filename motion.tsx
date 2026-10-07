import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, durationFrames, layouts, mix, progress, safeSpeed, seeded, travelPhase, type Rect} from './math';
import {Scenery} from './scenery';

export type ShotId = 'CardStage' | 'LockedTitleCuts' | 'GlyphGather' | 'PanelMosaic' | 'CirclePortal' | 'TravelSequence';
export type MotionProps = {
  title: string;
  subtitle: string;
  accent: string;
  speed: number;
  seed: number;
  gap: number;
  /** Local paths, staticFile() URLs, remote image URLs, or browser object URLs. */
  media: string[];
};
export const defaultProps: MotionProps = {title: '山海之间', subtitle: '去看见 · 去感受 · 去生活', accent: '#ecd58e', speed: 1, seed: 7, gap: 8, media: []};
export const shots: {id: ShotId; name: string; english: string; seconds: number; reference: string; description: string; timing: string}[] = [
  {id: 'TravelSequence', name: '旅行串场', english: 'THE JOURNEY', seconds: 8.2, reference: '参考 03', description: '文字聚合、拼屏、圆形扩张与闪白，连成一段完整旅程。', timing: '0–2.2s 聚合 / 2.2–4.2s 拼屏 / 4.2–4.8s 圆形 / 5.3–7.1s 再拼屏 / 7.1s 闪白'},
  {id: 'CardStage', name: '卡片分步展开', english: 'CARD STAGE', seconds: 6, reference: '参考 01', description: '主画面建立舞台，副卡片与步骤依次入场，最后扩展主画面。', timing: '0.3s 主卡 / 1.1s 副卡 / 1.8–3.0s 步骤 / 3.8s 展开'},
  {id: 'LockedTitleCuts', name: '固定标题切镜', english: 'LOCKED TITLE', seconds: 6, reference: '参考 02', description: '标题保持位置和大小，背景硬切与轻微推镜形成节奏。', timing: '每 1.2s 切换背景 / 标题全程锁定'},
  {id: 'GlyphGather', name: '文字聚合', english: 'GLYPH GATHER', seconds: 4.2, reference: '参考 03', description: '字符从不同方向旋转归位，散落的文字逐渐成为主标题。', timing: '0.15–1.65s 聚合 / 1.65–4.2s 停留'},
  {id: 'PanelMosaic', name: '动态拼屏', english: 'PANEL MOSAIC', seconds: 5.5, reference: '参考 03', description: '全屏、双屏、不对称三屏、上下双屏，连续改变画面的重心。', timing: '0–1.0s 全屏 / 1.0s 双屏 / 2.1s 三屏 / 3.3s 上下 / 4.4s 回到全屏'},
  {id: 'CirclePortal', name: '圆形转场', english: 'CIRCLE PORTAL', seconds: 4.2, reference: '参考 03', description: '圆形徽章在拼屏交点建立焦点，新画面从圆心扩张铺满。', timing: '0–1.3s 三屏 / 1.3–2.25s 圆形扩张 / 2.25–4.2s 全屏'},
];
export const getShotDuration = (id: ShotId, fps: number, speed: number) => durationFrames(shots.find(s => s.id === id)!.seconds, fps, speed);

const useMotion = (props: MotionProps) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  return {t: frame / fps * safeSpeed(props.speed), width, height, unit: width / 1280};
};
const Media: React.FC<{props: MotionProps; index: number; t: number}> = ({props, index, t}) => <AbsoluteFill style={{transform: `scale(${1.04 + Math.min(t, 10) * 0.009})`, background: '#283d39'}}>
  {props.media.length ? <Img src={props.media[index % props.media.length]} style={{width: '100%', height: '100%', objectFit: 'cover'}}/> : <Scenery index={index}/>}
</AbsoluteFill>;
const Shade = () => <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(6,20,17,.08) 30%,rgba(4,17,15,.58))'}}/>;
const Eyebrow: React.FC<{text: string; unit: number; accent: string}> = ({text, unit, accent}) => <div style={{fontSize: 13 * unit, letterSpacing: 5 * unit, color: accent, fontWeight: 600}}>{text}</div>;
const Badge: React.FC<{props: MotionProps; unit: number; t: number; x?: number; y?: number}> = ({props, unit, t, x = 54, y = 50}) => <div style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: 108 * unit, height: 108 * unit, borderRadius: '50%', background: props.accent, color: '#233b34', display: 'grid', placeItems: 'center', transform: `translate(-50%,-50%) rotate(${mix(-30, 7, progress(t, 0, 0.7))}deg) scale(${mix(0.15, 1, progress(t, 0, 0.6))})`, fontSize: 23 * unit, fontWeight: 900, border: `${6 * unit}px solid rgba(255,255,255,.22)`, boxShadow: '0 8px 30px #0003'}}>HEY!</div>;
const Gather: React.FC<{props: MotionProps; t: number; unit: number}> = ({props, t, unit}) => {
  const chars = Array.from(props.title.slice(0, 24));
  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'pre', fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', fontSize: Math.min(148, 860 / Math.max(chars.length, 1)) * unit, fontWeight: 900, letterSpacing: -3 * unit, lineHeight: 1.2, color: props.accent, textShadow: '0 6px 40px #13281f66'}}>
    {chars.map((char, i) => {
      const p = progress(t, 0.15 + i * Math.min(0.075, 0.6 / chars.length), 0.85);
      return <span key={i} style={{display: 'inline-block', opacity: mix(0.12, 1, p), transform: `translate(${(seeded(i, props.seed) - .5) * 1100 * unit * (1-p)}px, ${(seeded(i + 40, props.seed) - .5) * 700 * unit * (1-p)}px) rotate(${(seeded(i+80, props.seed)-.5)*180*(1-p)}deg) scale(${mix(.45,1,p)})`}}>{char}</span>;
    })}
  </div>;
};
const Mosaic: React.FC<{props: MotionProps; t: number; mode: keyof typeof layouts; start?: number; offset?: number; unit: number}> = ({props, t, mode, start = 0, offset = 0, unit}) => {
  const p = progress(t, start, .42);
  const gap = clamp(props.gap, 0, 32) * unit;
  return <AbsoluteFill style={{background: '#12241d', overflow: 'hidden'}}>
    {layouts[mode].map((r: Rect, i) => <div key={i} style={{position: 'absolute', left: `${r.x*100}%`, top: `${r.y*100}%`, width: `${r.w*100}%`, height: `${r.h*100}%`, padding: gap/2, boxSizing: 'border-box', transform: `translate(${i===0 ? -(1-p)*10 : (1-p)*110}px,0)`, opacity: i===0 ? 1 : p}}>
      <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}><Media props={props} index={i+offset} t={t}/></div>
    </div>)}
  </AbsoluteFill>;
};
const Portal: React.FC<{props: MotionProps; t: number; start: number; unit: number}> = ({props, t, start, unit}) => {
  const {width,height} = useVideoConfig();
  const p = progress(t, start, .95);
  const radius = mix(54*unit, Math.hypot(width, height)*.8, p);
  return <AbsoluteFill style={{clipPath: `circle(${radius}px at 54% 50%)`, opacity: t < start ? 0 : 1}}>
    <Media props={props} index={4} t={t}/><Shade/>
    <div style={{position: 'absolute', left: '8%', bottom: '13%', color: '#f1eedf', opacity: progress(t,start+.6,.45), fontSize: 46*unit, fontWeight: 700}}>{props.subtitle}</div>
  </AbsoluteFill>;
};

export const GlyphGather: React.FC<MotionProps> = props => {
  const {t,unit} = useMotion(props);
  return <AbsoluteFill style={{overflow:'hidden'}}><Media props={props} index={0} t={t}/><Shade/>
    <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:24*unit}}><Eyebrow text="S H A N H A I  /  0 3" unit={unit} accent={props.accent}/><Gather props={props} t={t} unit={unit}/><div style={{fontSize:20*unit,letterSpacing:4*unit,color:'#f6f1df',opacity:progress(t,1.1,.6)}}>{props.subtitle}</div></AbsoluteFill>
  </AbsoluteFill>;
};
export const PanelMosaic: React.FC<MotionProps> = props => {
  const {t,unit}=useMotion(props);
  const mode = t<1 ? 'full' : t<2.1 ? 'split' : t<3.3 ? 'triple' : t<4.4 ? 'horizontal' : 'full';
  const start = t<1 ? 0 : t<2.1 ? 1 : t<3.3 ? 2.1 : t<4.4 ? 3.3 : 4.4;
  return <AbsoluteFill><Mosaic props={props} t={t} mode={mode} start={start} offset={Math.floor(t/2)} unit={unit}/><Shade/>
    <div style={{position:'absolute',left:'6%',bottom:'8%',color:props.accent,fontSize:42*unit,fontWeight:800}}>{props.title}</div>
    {mode==='triple' && <Badge props={props} t={t-start} unit={unit}/>}
  </AbsoluteFill>;
};
export const CirclePortal: React.FC<MotionProps> = props => {
  const {t,unit}=useMotion(props);
  return <AbsoluteFill style={{overflow:'hidden'}}><Mosaic props={props} t={t} mode="triple" unit={unit}/><Badge props={props} t={t} unit={unit}/><Portal props={props} t={t} start={1.3} unit={unit}/>
    <div style={{position:'absolute',top:'8%',left:'8%',fontSize:60*unit,fontWeight:800,color:props.accent}}>{props.title}</div>
  </AbsoluteFill>;
};
export const LockedTitleCuts: React.FC<MotionProps> = props => {
  const {t,unit}=useMotion(props);
  const shot = Math.floor(t/1.2);
  return <AbsoluteFill style={{overflow:'hidden'}}><Media props={props} index={shot} t={t%1.2}/><Shade/>
    <AbsoluteFill style={{justifyContent:'center',alignItems:'center',gap:20*unit}}>
      <Eyebrow text="ONE TITLE · MANY MOMENTS" unit={unit} accent={props.accent}/>
      <div style={{fontSize:Math.min(116,900/Math.max(Array.from(props.title).length,1))*unit,fontWeight:900,color:props.accent,letterSpacing:-3*unit,textShadow:'0 5px 30px #10251b55'}}>{props.title}</div>
      <div style={{color:'#fff6e1',fontSize:20*unit,letterSpacing:4*unit}}>{props.subtitle}</div>
    </AbsoluteFill>
    <div style={{position:'absolute',right:'5%',bottom:'6%',fontFamily:'monospace',fontSize:14*unit,color:'#eee9d7'}}>SCENE {String(shot+1).padStart(2,'0')}</div>
  </AbsoluteFill>;
};
export const CardStage: React.FC<MotionProps> = props => {
  const {t,unit}=useMotion(props);
  const expand=progress(t,3.8,.8);
  const main=progress(t,.25,.8);
  const small=progress(t,1.1,.7);
  return <AbsoluteFill style={{background:'#e7e3d6',color:'#243c33',overflow:'hidden',fontFamily:'"PingFang SC",sans-serif'}}>
    <div style={{position:'absolute',left:'6%',top:'8%'}}><Eyebrow text="FRAME YOUR STORY" unit={unit} accent="#718477"/><div style={{fontSize:54*unit,fontWeight:800,marginTop:12*unit}}>{props.title}</div></div>
    <div style={{position:'absolute',left:`${mix(6,3,expand)}%`,top:`${mix(32,26,expand)}%`,width:`${mix(54,68,expand)}%`,height:`${mix(56,68,expand)}%`,opacity:main,transform:`translateY(${(1-main)*100*unit}px) rotate(${(1-main)*-8}deg)`,padding:10*unit,background:'#faf7ec',borderRadius:18*unit,boxShadow:'0 20px 50px #253c3330'}}><div style={{width:'100%',height:'100%',position:'relative',overflow:'hidden',borderRadius:10*unit}}><Media props={props} index={0} t={t}/><Shade/><div style={{position:'absolute',left:'7%',bottom:'9%',color:'#fff7df',fontSize:28*unit,fontWeight:700}}>{props.subtitle}</div></div></div>
    <div style={{position:'absolute',right:'6%',top:`${mix(17,12,expand)}%`,width:`${mix(29,22,expand)}%`,height:'35%',background:'#faf7ec',padding:8*unit,borderRadius:14*unit,opacity:small,transform:`translateX(${(1-small)*200*unit}px) rotate(${mix(12,-4,small)}deg)`,boxShadow:'0 15px 45px #253c3328'}}><div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden',borderRadius:8*unit}}><Media props={props} index={1} t={t}/></div></div>
    <div style={{position:'absolute',right:'5%',bottom:'10%',width:'22%',display:'flex',flexDirection:'column',gap:17*unit}}>
      {['看见风景','收集片刻','继续出发'].map((text,i)=>{const p=progress(t,1.8+i*.6,.55);return <div key={text} style={{opacity:p,transform:`translateX(${(1-p)*80*unit}px)`,fontSize:20*unit,display:'flex',gap:12*unit,alignItems:'center'}}><span style={{display:'grid',placeItems:'center',width:32*unit,height:32*unit,borderRadius:'50%',background:props.accent,fontSize:13*unit,fontWeight:800}}>0{i+1}</span>{text}</div>;})}
    </div>
  </AbsoluteFill>;
};
export const TravelSequence: React.FC<MotionProps> = props => {
  const {t,unit}=useMotion(props);
  const phase=travelPhase(t);
  const portal=phase==='portal'||phase==='full';
  const mode=phase==='split'?'split':phase==='triple'||phase==='portal'?'triple':phase==='horizontal'?'horizontal':phase==='triple2'?'triple':'full';
  const start=phase==='split'?2.2:phase==='triple'?3.1:phase==='horizontal'?5.3:phase==='triple2'?6:0;
  return <AbsoluteFill style={{background:'#15372c',overflow:'hidden'}}>
    <Mosaic props={props} t={t} mode={mode} start={start} offset={t>=4.8 ? 3 : 0} unit={unit}/>
    <Shade/>
    {phase==='title' && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:20*unit}}><Eyebrow text="LIFE IS A JOURNEY" unit={unit} accent={props.accent}/><Gather props={props} t={t} unit={unit}/><div style={{color:'#fff4dc',fontSize:20*unit,letterSpacing:4*unit,opacity:progress(t,1,.6)}}>{props.subtitle}</div></AbsoluteFill>}
    {(phase==='triple'||phase==='portal') && <Badge props={props} t={t-3.4} unit={unit}/>}
    {portal && <Portal props={props} t={t} start={4.2} unit={unit}/>}
    {phase==='ending' && <AbsoluteFill style={{alignItems:'center',justifyContent:'center',gap:22*unit}}><div style={{fontSize:88*unit,fontWeight:800,color:props.accent,transform:`translateY(${(1-progress(t,7.35,.4))*40*unit}px)`,opacity:progress(t,7.35,.4)}}>{props.title}</div><Eyebrow text="KEEP WANDERING" unit={unit} accent="#fff0d0"/></AbsoluteFill>}
    {phase==='flash' && <AbsoluteFill style={{background:'#fff7df',opacity:Math.sin(clamp((t-7.1)/.25)*Math.PI)}}/>}
    <div style={{position:'absolute',left:'5%',bottom:'5%',fontSize:12*unit,letterSpacing:3*unit,color:'#fff5d6',opacity:phase==='title'?0:1}}>SHANHAI / FIELD NOTES</div>
  </AbsoluteFill>;
};
export const components: Record<ShotId, React.FC<MotionProps>> = {CardStage,LockedTitleCuts,GlyphGather,PanelMosaic,CirclePortal,TravelSequence};
export const MotionScene: React.FC<MotionProps & {shot: ShotId}> = ({shot,...props}) => {
  const Component=components[shot];
  return <Component {...props}/>;
};

import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player,type PlayerRef} from '@remotion/player';
import {MotionScene,defaultProps,getShotDuration,shots,type MotionProps,type ShotId} from './motion';
import {Scenery} from './scenery';
import './styles.css';

const repository='https://github.com/angiechenqiurong-svg/shanhai-motion';
const App=()=>{
  const [shot,setShot]=useState<ShotId>('TravelSequence');
  const [props,setProps]=useState<MotionProps>({...defaultProps});
  const [aspect,setAspect]=useState<'wide'|'classic'>('wide');
  const [message,setMessage]=useState('');
  const [codeOpen,setCodeOpen]=useState(false);
  const [names,setNames]=useState<string[]>([]);
  const objectUrls=useRef<string[]>([]);
  const player=useRef<PlayerRef>(null);
  const selected=shots.find(s=>s.id===shot)!;
  const width=aspect==='wide'?1280:960;
  const frames=getShotDuration(shot,30,props.speed);
  const update=<K extends keyof MotionProps>(key:K,value:MotionProps[K])=>setProps(p=>({...p,[key]:value}));
  useEffect(()=>()=>objectUrls.current.forEach(URL.revokeObjectURL),[]);
  useEffect(()=>{if(!message)return;const timer=setTimeout(()=>setMessage(''),3500);return()=>clearTimeout(timer);},[message]);
  const clearMedia=()=>{objectUrls.current.forEach(URL.revokeObjectURL);objectUrls.current=[];update('media',[]);setNames([]);};
  const reset=()=>{clearMedia();setProps({...defaultProps});setAspect('wide');setMessage('已恢复默认镜头');};
  const choose=(id:ShotId)=>{setShot(id);player.current?.seekTo(0);};
  const shareProps={...props,media:[]};
  const code=`import {${shot}} from './motion';\n\n// 放入 Remotion Composition 或 Sequence\n<${shot}\n  {...${JSON.stringify(shareProps,null,2)}}\n/>\n\n// 素材替换：media={[staticFile('mountain.jpg'), staticFile('sea.jpg')]}\n// 时长：getShotDuration('${shot}', fps, speed)`;
  const copy=async()=>{try{await navigator.clipboard.writeText(code);setMessage('镜头代码已复制');}catch{setMessage('请选中下方代码手动复制');setCodeOpen(true);}};
  const download=()=>{
    const blob=new Blob([JSON.stringify({version:1,shot,aspect,props:shareProps},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`shanhai-${shot}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage('参数预设已下载');
  };
  return <>
    <header className="header"><a className="brand" href="#"><span className="brand-mark">山</span><span>SHANHAI<span className="brand-light"> MOTION</span><small>山海镜头</small></span></a>
      <nav><span className="release">VOL. 01 / SIX SHOTS</span><a href={repository} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a></nav>
    </header>
    <main>
      <section className="intro"><div><p className="kicker"><span/> A LITTLE MOTION. A BIGGER STORY.</p><h1>把风景，<em>剪成节奏。</em></h1><p className="lead">六种可复用的动态镜头。选择、播放、调整，让每个片刻有自己的出场方式。</p></div><div className="intro-number">06<span>SHOTS<br/>ENDLESS STORIES</span></div></section>
      <div className="workspace">
        <section className="stage-panel" aria-label="镜头预览">
          <div className="stage-heading"><div><span className="dot"/> LIVE PREVIEW <span className="stage-name">{selected.name}</span></div><div className="aspect-switch" aria-label="画幅"><button className={aspect==='wide'?'active':''} onClick={()=>setAspect('wide')}>16:9</button><button className={aspect==='classic'?'active':''} onClick={()=>setAspect('classic')}>4:3</button></div></div>
          <div className={`player-shell ${aspect}`}><Player ref={player} key={`${shot}-${aspect}`} component={MotionScene} inputProps={{...props,shot}} durationInFrames={frames} fps={30} compositionWidth={width} compositionHeight={720} controls loop autoPlay initiallyMuted style={{width:'100%',display:'block'}} clickToPlay doubleClickToFullscreen showVolumeControls={false}/></div>
          <div className="stage-caption"><div><strong>{selected.english}</strong><span>{selected.description}</span></div><span className="duration">{(frames/30).toFixed(1)}<small>SEC</small></span></div>
          <div className="timing"><span>镜头节奏</span><p>{selected.timing}</p></div>
        </section>
        <aside className="controls" aria-label="镜头参数">
          <div className="controls-heading"><h2>调出你的节奏</h2><button className="text-button" onClick={reset}>重置 ↺</button></div>
          <label className="field">主标题<input value={props.title} maxLength={24} onChange={e=>update('title',e.target.value)} /></label>
          <label className="field">一句话<input value={props.subtitle} maxLength={42} onChange={e=>update('subtitle',e.target.value)}/></label>
          <div className="field"><span>强调色</span><div className="color-row">{['#ecd58e','#f2eee0','#c8e4d7','#e1a580','#a9ccdf'].map(color=><button key={color} aria-label={`选择颜色 ${color}`} aria-pressed={props.accent===color} style={{background:color}} className={props.accent===color?'selected':''} onClick={()=>update('accent',color)}/>)}<label className="custom-color" title="自定义颜色"><input type="color" aria-label="自定义强调色" value={props.accent} onChange={e=>update('accent',e.target.value)}/>+</label><code>{props.accent}</code></div></div>
          <label className="field range-field"><span>动效速度 <b>{props.speed.toFixed(2)}×</b></span><input type="range" min="0.5" max="2" step="0.05" value={props.speed} onChange={e=>update('speed',Number(e.target.value))}/><div className="range-labels"><span>从容</span><span>利落</span></div></label>
          <label className="field range-field"><span>拼屏间距 <b>{props.gap}px</b></span><input type="range" min="0" max="32" step="1" value={props.gap} onChange={e=>update('gap',Number(e.target.value))}/></label>
          <div className="seed-row"><span>文字散落方式</span><button onClick={()=>update('seed',props.seed+1)}>换一组 ↗</button></div>
          <div className="media-field"><div className="media-heading"><span>你的画面</span>{names.length>0&&<button className="text-button" onClick={clearMedia}>清除</button>}</div><label className="upload"><input type="file" accept="image/*" multiple aria-label="替换镜头素材" onChange={e=>{
            const files=Array.from(e.target.files??[]).filter(f=>f.type.startsWith('image/')).slice(0,6);
            if(!files.length)return;
            objectUrls.current.forEach(URL.revokeObjectURL);objectUrls.current=files.map(f=>URL.createObjectURL(f));update('media',[...objectUrls.current]);setNames(files.map(f=>f.name));e.target.value='';setMessage(`已替换 ${files.length} 张画面`);
          }}/><span className="upload-icon">＋</span><strong>{names.length?`${names.length} 张素材，点击更换`:'替换为你的照片'}</strong><small>最多 6 张 · 仅在本机预览</small></label>{names.length>0&&<p className="filenames">{names.join(' / ')}</p>}</div>
          <div className="actions"><button className="primary" onClick={copy}>复制镜头代码 <span>↗</span></button><button className="secondary" onClick={download}>保存参数 ↓</button></div>
        </aside>
      </div>
      <section className="library" aria-label="选择镜头"><div className="section-title"><h2>镜头库 <span>THE SHOT COLLECTION</span></h2><p>三个参考，六种出场方式。</p></div>
        <div className="shot-grid">{shots.map((s,i)=><button key={s.id} className={`shot-card ${shot===s.id?'selected':''}`} onClick={()=>choose(s.id)} aria-pressed={shot===s.id}>
          <div className={`thumb thumb-${s.id}`}><Scenery index={i}/><div className="thumb-shade"/>{s.id==='CardStage'?<><div className="mini-card"/><div className="mini-card sub"/></>:s.id==='PanelMosaic'?<><i className="panel-line vertical"/><i className="panel-line horizontal"/></>:s.id==='CirclePortal'?<div className="mini-circle">HEY!</div>:s.id==='GlyphGather'?<div className="mini-glyph"><span>山</span><span>海</span></div>:<strong>{s.id==='TravelSequence'?'MY VLOG':'去旅行'}</strong>}<span className="thumb-index">0{i+1}</span><span className="thumb-time">{s.seconds}s</span></div>
          <div className="shot-label"><div><small>{s.english}</small><h3>{s.name}</h3></div><span className="select-icon">{shot===s.id?'✓':'↗'}</span></div><p>{s.reference}</p>
        </button>)}</div>
      </section>
      <section className="code-section"><button className="code-toggle" onClick={()=>setCodeOpen(!codeOpen)} aria-expanded={codeOpen}><span><span className="code-symbol">&lt;/&gt;</span> 把这个镜头带走 <small>同一套组件，用于网页预览和视频渲染</small></span><span>{codeOpen?'−':'＋'}</span></button>{codeOpen&&<div className="code-body"><p>在你的 Remotion 项目中复制 <code>motion.tsx</code>、<code>math.ts</code> 和 <code>scenery.tsx</code>，再使用下方参数。上传的照片请另行放入项目的 public 目录。</p><pre><code>{code}</code></pre><button className="secondary" onClick={copy}>复制代码</button><a href={`${repository}#使用镜头`} target="_blank" rel="noreferrer">完整使用说明 ↗</a></div>}</section>
    </main>
    <footer><div className="footer-brand">SHANHAI MOTION<span>山海之间，动静有时。</span></div><div>BUILT WITH REMOTION · ORIGINAL VECTOR DEMOS<a href={repository} target="_blank" rel="noreferrer">开源代码 ↗</a></div></footer>
    {message&&<div className="toast" role="status">{message}</div>}
  </>;
};
createRoot(document.getElementById('root')!).render(<App/>);

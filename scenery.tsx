import React from 'react';

/** Original vector demo artwork. Replace through MotionProps.media in production. */
export const Scenery: React.FC<{index: number}> = ({index}) => {
  const scene = ((index % 6) + 6) % 6;
  const palettes = [
    ['#9caeab', '#e4d9bd', '#526d68', '#253d3a'],
    ['#719fae', '#d9e1d8', '#386e70', '#173d48'],
    ['#bc937d', '#f1cda1', '#856859', '#493f3a'],
    ['#b0b7bd', '#f0e7ce', '#65787b', '#283d44'],
    ['#90b8b3', '#e6e3c8', '#478480', '#245656'],
    ['#be8d76', '#edd0a6', '#906654', '#503d36'],
  ][scene];
  const id = `landscape-${scene}`;
  return <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={palettes[0]}/><stop offset="1" stopColor={palettes[1]}/></linearGradient>
      <linearGradient id={`${id}-ground`} x2="0" y2="1"><stop stopColor={palettes[2]}/><stop offset="1" stopColor={palettes[3]}/></linearGradient>
    </defs>
    <path fill={`url(#${id}-sky)`} d="M0 0h1280v720H0z"/>
    <circle cx={scene % 2 ? 970 : 305} cy={175 + scene * 8} r="60" fill="#fff4d1" opacity=".8"/>
    <path d="M-50 400 170 225 308 372 480 158 710 355 928 200 1100 380 1330 280V720H-50Z" fill={palettes[2]} opacity=".45"/>
    <path d="m400 247 80-89 97 105-89-34-40 30Z M865 257l63-57 63 56-54-21-32 20Z" fill="#f5eedb" opacity=".65"/>
    {scene === 1 || scene === 4 ? <>
      <path d="M0 392q310-40 620 12t660-18v334H0Z" fill={`url(#${id}-ground)`}/>
      {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${80+i*64} ${435+i*35}q${210+i*35} -16 ${520+i*40} 0`} stroke="#e3dfc3" strokeWidth="2" opacity={0.26-i*0.025} fill="none"/>)}
      <path d="M0 460q160 16 250 112t240 148H0Z" fill="#d5ba8d"/>
      <path d="M1230 324q-75 47-128 114t-88 75l266 40V260Z" fill={palettes[3]}/>
      <path d="m723 474 23-40 20 40z" fill="#f1e5c5"/><path d="m712 477h66l-14 13h-38z" fill="#262f32"/>
    </> : <>
      <path d="M0 475 210 341 420 510 660 342 900 487 1112 365 1280 464V720H0Z" fill={palettes[2]}/>
      <path d="M0 536q250-70 530 67l125-80q290-160 625-39v236H0Z" fill={`url(#${id}-ground)`}/>
      <path d="M691 514c-14 43-147 60-156 102s160 36 115 104" stroke="#d7c8a9" strokeWidth="24" fill="none"/>
      <path d="M0 668q123-58 274-25t133 77H0Z" fill={palettes[3]}/>
      <path d="M950 620q198-91 330-37v137H880Z" fill={palettes[3]}/>
      {[0,1,2,3,4].map(i=><path key={i} d={`m${1040+i*39} ${535-i%2*16} -13 46h26z`} fill={palettes[3]}/>)}
    </>}
    <path d="M0 0h1280v720H0z" fill="#14241f" opacity=".07"/>
  </svg>;
};

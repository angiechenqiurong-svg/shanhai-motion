import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderFrames,renderStill,openBrowser} from '@remotion/renderer';

const root=path.dirname(fileURLToPath(import.meta.url));
const id=process.argv[2]??'TravelSequence';
const review=process.argv.includes('--stills');
const output=path.join(root,'out',id);
fs.mkdirSync(output,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'remotion.ts'),outDir:path.join(root,'out','bundle')});
const browser=await openBrowser('chrome',{logLevel:'error'});
try {
  const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
  if(review){
    const times=id==='TravelSequence'?[.1,1.7,2.6,3.6,4.5,5.05,5.7,6.6,7.2,7.8]:[.3,1.5,2.8,4.0];
    for(const t of times){const frame=Math.min(composition.durationInFrames-1,Math.round(t*composition.fps));await renderStill({serveUrl,composition,frame,output:path.join(output,`still-${frame}.jpg`),imageFormat:'jpeg',jpegQuality:92,puppeteerInstance:browser});}
    console.log('Reviewed',id);
  }else{
    await renderFrames({serveUrl,composition,outputDir:output,imageFormat:'jpeg',jpegQuality:95,concurrency:4,muted:true,puppeteerInstance:browser,onStart:({frameCount})=>console.log('Rendering',frameCount,'frames')});
    const digits=String(composition.durationInFrames-1).length;
    const result=spawnSync(process.env.FFMPEG??'ffmpeg',['-y','-framerate',String(composition.fps),'-i',path.join(output,`element-%0${digits}d.jpeg`),'-frames:v',String(composition.durationInFrames),'-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',path.join(root,'out',`${id}.mp4`)],{stdio:'inherit'});
    if(result.error)throw result.error;if(result.status!==0)throw new Error(`FFmpeg exited ${result.status}`);
  }
}finally{await browser.close({silent:true});}

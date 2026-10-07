import {strict as assert} from 'node:assert';
import {test} from 'node:test';
import {layouts,durationFrames,travelPhase,seeded,safeSpeed,progress} from './math.ts';

test('every mosaic covers the full frame without overlapping tiles',()=>{
  for(const rects of Object.values(layouts)){
    let area=0;
    for(const r of rects){assert.ok(r.x>=0&&r.y>=0&&r.x+r.w<=1&&r.y+r.h<=1);area+=r.w*r.h;}
    assert.ok(Math.abs(area-1)<1e-10);
    for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
      const a=rects[i],b=rects[j];
      assert.ok(Math.min(a.x+a.w,b.x+b.w)<=Math.max(a.x,b.x)||Math.min(a.y+a.h,b.y+b.h)<=Math.max(a.y,b.y));
    }
  }
});
test('speed changes duration consistently at 24/30/60 fps',()=>{
  for(const fps of [24,30,60])for(const speed of [.5,1,2])assert.equal(durationFrames(8.2,fps,speed),Math.round(8.2*fps/speed));
  assert.equal(safeSpeed(NaN),1);assert.equal(safeSpeed(0),.5);assert.equal(safeSpeed(10),2);
});
test('reference-three boundaries preserve the ordered cuts',()=>{
  assert.deepEqual([0,2.2,3.1,4.2,4.8,5.3,6,7.1,7.35].map(travelPhase),['title','split','triple','portal','full','horizontal','triple2','flash','ending']);
});
test('seek and export are deterministic, with no evolving random state',()=>{
  const forward=Array.from({length:100},(_,i)=>seeded(i,7));
  const reverse=Array.from({length:100},(_,i)=>seeded(99-i,7)).reverse();
  assert.deepEqual(forward,reverse);assert.ok(forward.every(v=>v>=0&&v<1));
  assert.notDeepEqual(forward,Array.from({length:100},(_,i)=>seeded(i,8)));
  assert.equal(progress(-1,0,1),0);assert.equal(progress(2,0,1),1);
});

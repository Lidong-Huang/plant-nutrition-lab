(()=>{'use strict';
const W=['#6e9d9b','#4c95b3'],F=['#c8b16f','#96ae79','#b88e72'];
function outline(w,x,z,width,depth,color,line=2.5,dash=[]){w.line([[x-width/2,.23,z-depth/2],[x+width/2,.23,z-depth/2],[x+width/2,.23,z+depth/2],[x-width/2,.23,z+depth/2],[x-width/2,.23,z-depth/2]],color,line,{dash})}
function environment(w){FieldAssets.environment(w,{split:true})}
function draw(w,s){environment(w);const stage=s.step;const full=stage>=3,plants=stage>=4,compact=w.width<650,wholeFocus=stage===6&&s.compare==='water';const sel=s.selected;
 for(let r=0;r<3;r++){const z=-2.65+r*2.65;
 if(stage>=1){outline(w,0,z,12.65,2.46,'#a0ac85',1,[6,5]);w.label([6.35,.18,z],`区组 ${['I','II','III'][r]}`,{size:12,pill:true})}
 for(let water=0;water<2;water++){const slot=s.mainPositions[r][water],x=-3.12+slot*6.24;const irrigation=stage>=2?W[water]:'#b9b48f';
 w.box(x,.03,z,5.6,.09,2.05,'#c1af88');
 // Raised bunds isolate water treatments at the whole-plot boundary.
 if(stage>=1){for(const zz of [z-1.06,z+1.06])w.box(x,.11,zz,5.78,.16,.085,'#c7b88f');for(const xx of [x-2.86,x+2.86])w.box(xx,.11,z,.085,.16,2.2,'#c7b88f');outline(w,x,z,5.83,2.24,irrigation,stage>=2?3:1.5)}
 if(stage>=2){if(!wholeFocus)w.label([compact?x-2.35:x,.28,z-1.05],compact?`W${water+1}`:`W${water+1} · ${water?'高灌水':'低灌水'}`,{dy:6,size:compact?10:12,color:water?'#407e98':'#527c77',pill:true});
 const vx=x-2.95;FieldAssets.pipe(w,[[vx,.08,-4.9],[vx,.08,z],[vx,.32,z]],{active:stage>=4});FieldAssets.gate(w,vx,z);FieldAssets.channel(w,[[x+2.8,0,z+.8],[x+2.95,0,z+1.22],[7.12,0,z+1.22]],.11,{drain:true,flow:stage>=4});w.cylinder(vx,.06,z,.105,.3,'#829b91',{n:8});w.line([[vx-.13,.39,z],[vx+.13,.39,z]],irrigation,3)}
 if(!full){if(stage>=1)for(let j=0;j<4;j++)for(let k=0;k<2;k++)FieldAssets.maize(w,x-1.9+j*1.25,.13,z-.43+k*.86,.67,j+k+r);continue}
 for(let fertilizer=0;fertilizer<3;fertilizer++){const col=s.subPositions[r][water][fertilizer],sx=x+(col-1)*1.78,selected=sel&&sel.block===r&&sel.water===water&&sel.fertilizer===fertilizer;
 const muted=stage===6&&s.compare==='water';w.box(sx,.13,z,1.58,.045,1.8,muted?'#b5b58f':F[fertilizer]);
 for(let j=0;j<2;j++)for(let k=0;k<3;k++){const obs=s.data.find(d=>d.block===r&&d.water===water&&d.fertilizer===fertilizer).value;const h=plants?.46+(obs-40)*.018:.45;FieldAssets.maize(w,sx-.35+j*.7,.19,z-.55+k*.55,h*1.25,j+k+r)}
 const labelPos=[sx,.85,z];if(!wholeFocus)w.label(labelPos,`F${fertilizer+1}`,{dy:-5,size:compact?10:11,color:['#927a35','#668253','#9c7355'][fertilizer],pill:true});
 if((stage===5&&!compact)||selected){const value=s.data.find(d=>d.block===r&&d.water===water&&d.fertilizer===fertilizer).value;w.label([sx,1.5,z],value.toFixed(1),{size:11,color:water?'#39748c':'#547672',pill:true})}
 if(selected)outline(w,sx,z,1.65,1.92,'#b58a3f',3.2);
 if(stage===6&&s.compare!=='water')outline(w,sx,z,1.65,1.92,'#b49357',2,[4,3]);
 if(stage>=4){const line=[[x-2.95,.37,z-.84],[sx,.37,z-.84],[sx,.28,z+.65]];w.line(line,irrigation,1.5);w.stream(line,water?'#7dbcd2':'#9bc9c8',{count:water?8:4,speed:.13,size:.025,phase:fertilizer*.15});for(let n=0;n<3;n++){const t=(w.time*.24+n/3)%1;w.dot([sx+.18*Math.sin(n*2),.9-t*.65,z-.1+n*.12],.025,F[fertilizer],{glow:true})}}
 s.hitRegions.push({block:r,water,fertilizer,point:w.project([sx,.5,z]),label:`区组${r+1} W${water+1} F${fertilizer+1}`});
 }
 if(wholeFocus){outline(w,x,z,5.88,2.29,'#438da7',4);const whole=s.data.filter(d=>d.block===r&&d.water===water),mean=whole.reduce((v,d)=>v+d.value,0)/3;w.label([x,1.5,z],compact?`W${water+1} · ${mean.toFixed(1)}`:`W${water+1} · 主区均值 ${mean.toFixed(1)}`,{size:compact?11:12,pill:true,color:'#39798e'})}
 }
 }
 if(stage===0){w.label([0,1.2,0],'灌水难以逐小区改变',{dy:-20,size:16,pill:true});w.label([0,.15,1.8],'大主区灌水 · 小副区施肥',{dy:22,size:13})}
 if(stage===4)w.label([-6.25,.3,-3.85],'蓝色水流：同一主区共用灌水水平',{dy:-16,size:11,pill:true});
}
window.SplitPlotWorld={draw};
})();

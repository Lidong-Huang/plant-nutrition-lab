/* Independent normal draws -> one arithmetic mean per sample -> sampling distribution.
   X is normal and population sigma is known; all displayed sampling laws are exact. */
(()=>{'use strict';
const M=NormalMath,S=NormalSamplingModel,C={blue:'#638ba2',green:'#237e5c',gold:'#b98b42',ink:'#244d3b',muted:'#7e9485',grid:'#d8e3d6'},clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),fmt=(x,d=2)=>Number(x.toFixed(d)).toString();
const bar='<mover><mi>X</mi><mo>¯</mo></mover>',variance='<mfrac><msup><mi>σ</mi><mn>2</mn></msup><mi>n</mi></mfrac>',se='<mfrac><mi>σ</mi><msqrt><mi>n</mi></msqrt></mfrac>';
const laws=`<math aria-label="X服从均值μ方差σ平方的正态分布，样本均值服从均值μ方差σ平方除以n的正态分布"><mi>X</mi><mo>∼</mo><mi>N</mi><mo>(</mo><mi>μ</mi><mo>,</mo><msup><mi>σ</mi><mn>2</mn></msup><mo>)</mo><mspace width="1em"/><mo>→</mo><mspace width="1em"/>${bar}<mo>∼</mo><mi>N</mi><mo>(</mo><mi>μ</mi><mo>,</mo>${variance}<mo>)</mo></math>`;
const meanFormula=`<math aria-label="样本均值等于n个观测值相加除以n，服从均值μ方差σ平方除以n的正态分布">${bar}<mo>=</mo><mfrac><mrow><msub><mi>X</mi><mn>1</mn></msub><mo>+</mo><mo>⋯</mo><mo>+</mo><msub><mi>X</mi><mi>n</mi></msub></mrow><mi>n</mi></mfrac><mo>∼</mo><mi>N</mi><mo>(</mo><mi>μ</mi><mo>,</mo>${variance}<mo>)</mo></math>`;
const standards=`<div class="sampling-math-row"><math aria-label="单个观测值减μ除以σ"><mi>Z</mi><mo>=</mo><mfrac><mrow><mi>X</mi><mo>−</mo><mi>μ</mi></mrow><mi>σ</mi></mfrac><mo>∼</mo><mi>N</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>)</mo></math><math aria-label="样本均值减μ除以标准误σ除以根号n"><msub><mi>Z</mi>${bar}</msub><mo>=</mo><mfrac><mrow>${bar}<mo>−</mo><mi>μ</mi></mrow>${se}</mfrac><mo>∼</mo><mi>N</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>)</mo></math></div>`;
function create({canvas,ctx,state,manual,invalidate}){
 const $=id=>document.getElementById(id),u={records:[],batch:null,progress:0,running:false,goal:Infinity,fast:false,phase:0,standardRunning:false,view:-1};let key='',lastDom='',rects=[];
 const params=()=>S.parameters(state.mu,state.sigma,state.n),prob=()=>M.cdf(state.z),active=()=>state.step>=4&&state.step<=6;
 function clear(){u.records=[];u.batch=null;u.progress=0;u.running=false;u.goal=Infinity;u.fast=false;}
 function begin(){u.batch=S.sample(state.mu,state.sigma,state.n);u.progress=0;}
 function pause(){u.running=false;u.standardRunning=false;actions();}
 function sync(){const k=[state.mu,state.sigma,state.n].join(':');if(k===key)return;key=k;clear();if(state.step===4){begin();u.goal=1;u.running=true;actions();}lastDom='';}
 function reset(){clear();u.phase=0;u.standardRunning=false;key='';sync();actions();update();}
 function enter(step,autoplay=false){pause();u.view=step;if(step===4){if(!u.batch)begin();u.goal=Infinity;u.fast=false;u.running=true;}if(step===6){u.phase=0;u.standardRunning=autoplay;}actions();update();}
 function actions(){const e=$('sampling-actions');e.replaceChildren();const add=(id,label,fn,pressed)=>{const b=document.createElement('button');b.id=id;b.textContent=label;if(pressed!==undefined)b.setAttribute('aria-pressed',String(pressed));b.onclick=()=>{const prior={running:u.running,standard:u.standardRunning};manual();fn(prior);actions();update();invalidate();};e.append(b);};
  if(u.view===4){add('sampling-play',u.running?'Ⅱ 暂停抽样':'▶ 连续抽样',p=>{if(!p.running){if(!u.batch)begin();u.running=true;u.goal=Infinity;u.fast=false;}});add('sampling-one','抽取一组',()=>{if(!u.batch)begin();u.running=true;u.fast=false;u.goal=u.records.length+1;});add('sampling-hundred','累积 100 组',()=>{if(!u.batch)begin();u.running=true;u.fast=true;u.goal=u.records.length+100;});add('sampling-clear','清空',()=>clear());}
  if(u.view===5){[1,4,16,64].forEach(n=>add('sampling-n-'+n,'n = '+n,()=>{state.n=n;sync();},state.n===n));}
  if(u.view===6){['① 原始分布','② 减去 μ','③ 除各自标准差'].forEach((v,i)=>add('dual-standard-'+i,v,()=>u.phase=i,Math.round(u.phase)===i));add('dual-standard-play',u.standardRunning?'Ⅱ 暂停':'▶ 同步标准化',p=>{if(!p.standard){if(u.phase>=2)u.phase=0;u.standardRunning=true;}});}
 }
 function update(){sync();const is=active();$('normal-sampling').hidden=!is;$('n-control').hidden=!is;document.body.classList.toggle('normal-sampling',is);if(!is)return;
  $('n').value=state.n;$('n-value').textContent=state.n;if(state.step===6){$('z-bound').value=state.z;$('z-value').textContent=state.z.toFixed(2);}const p=params(),mean=state.mu,seValue=fmt(p.se),stamp=[u.view,key,u.records.length,Math.floor(u.phase*40),state.z].join('|');
  if(stamp!==lastDom){lastDom=stamp;const f=$('sampling-formula');f.innerHTML=u.view===6?standards:u.view===4?meanFormula:laws;const stats=S.summary(u.records);let txt='';
   if(u.view===4){txt=`每组 n=${state.n}　｜　已得到 ${u.records.length} 个均值`+(stats.count>1?`　｜　均值点的标准差 ${fmt(stats.sd)}（理论 ${seValue}）`:`　｜　理论标准误 ${seValue}`);$('sampling-note').textContent='正态总体 · 独立抽样 · 每组一个均值点；两图横轴刻度不同。';}
   if(u.view===5){txt=`相同均值 μ=${mean}　｜　X：标准差 ${state.sigma}　｜　X̄：标准误 ${seValue}`;$('sampling-note').textContent='同一横轴、同一密度刻度；n 增大，均值的分布更集中。两条曲线下面积都为 1。';}
   if(u.view===6){const t=S.transform(mean,state.sigma,state.n,u.phase,state.z),name=u.phase===0?'原始值':u.phase<1?'中心化中':u.phase===1?'中心化':u.phase<2?'标准化中':'标准化';txt=`${name}：X → ${fmt(t[0].value)}　｜　X̄ → ${fmt(t[1].value)}　｜　同一分位 Φ(z)=${prob().toFixed(4)}`;$('sampling-note').textContent='已知总体 σ · X 除以 σ，X̄ 除以 σ/√n；换单位后密度同步改变，概率面积不变。';}
   $('sampling-numeric').textContent=txt;
  }
  canvas.dataset.sampleCount=u.records.length;canvas.dataset.sampleSize=state.n;canvas.dataset.standardError=p.se;canvas.dataset.dualStandardPhase=u.phase.toFixed(3);invalidate();
 }
 function tick(dt){let change=false;if(u.view===4&&u.running){if(!u.batch)begin();u.progress=Math.min(1,u.progress+dt/(u.fast?130:2100));if(u.progress===1){u.records.push(u.batch.mean);u.batch=null;if(u.records.length>=u.goal||u.records.length>=5000){u.running=false;actions();}else begin();}change=true;}
  if(u.view===6&&u.standardRunning){u.phase=Math.min(2,u.phase+dt/2200);if(u.phase===2){u.standardRunning=false;actions();}change=true;}if(change)update();return change;
 }
 function label(s,x,y,{size=13,color=C.ink,align='center',bold=false}={}){ctx.save();ctx.font=`${bold?500:400} ${size}px "Microsoft YaHei",sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(s,x,y);ctx.restore();}
 function line(points,color=C.grid,width=1,dash=[]){if(points.length<2)return;ctx.save();ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();ctx.restore();}
 function fill(points,color,alpha=.16){ctx.save();ctx.globalAlpha=alpha;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.restore();}
 function dot(p,color,r=4){ctx.save();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,r+2,0,7);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();ctx.restore();}
 function chart(rect,camera,{mu=state.mu,unit=state.sigma,max=M.pdf(mu,mu,unit)*1.25,title='',subtitle='',ticks=[-3,-2,-1,0,1,2,3],axis='观测值',density=true}={}){
  const pad=rect.w<330?27:43,ww=rect.w-pad*2,hh=Math.max(55,rect.h-105),cx=rect.x+rect.w/2,base=rect.y+rect.h-31,cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch),zoom=camera.zoom;
  const project=(x,y,z=0)=>{const xx=(x-mu)/(unit*8)*ww*zoom,yy=y/max*hh*zoom,zz=-xx*sy+z*cy,k=1/(1+zz/(Math.max(ww,hh)*4));return {x:cx+(xx*cy+z*sy)*k,y:base-(yy*cp-zz*sp)*k};};
  if(title)label(title,cx,rect.y+5,{size:16,bold:true});if(subtitle)label(subtitle,cx,rect.y+29,{size:11,color:C.muted});
  fill([project(mu-4*unit,0,-9),project(mu+4*unit,0,-9),project(mu+4*unit,0,9),project(mu-4*unit,0,9)],'#bed0b9',.24);
  for(const t of ticks){const x=mu+t*unit,p=project(x,0);line([project(x,0,-9),project(x,0,9)],C.grid,.7);line([p,project(x,-max*.023)],'#94ac95');label(fmt(x,unit<2?1:0),p.x,p.y+17,{size:10,color:C.muted});}
  line([project(mu-4*unit,0),project(mu+4*unit,0)],'#8ba38b',1.2);line([project(mu-4*unit,0),project(mu-4*unit,max)],'#a0b5a0',.9);
  if(density){for(const f of [.5,1]){const p=project(mu-4*unit,max*f);label(fmt(max*f,3),p.x-7,p.y,{size:9,color:C.muted,align:'right'});line([p,project(mu+4*unit,max*f)],C.grid,.6,[3,5]);}}
  const ap=project(mu+4*unit,0);label(axis,ap.x,ap.y+35,{size:10,color:C.muted,align:'right'});
  return {project,rect,mu,unit,max};
 }
 function curve(ch,mu,sd,color,{shade=false,z=null,dash=[],width=2.8}={}){const p=ch.project,lo=ch.mu-4*ch.unit,hi=ch.mu+4*ch.unit,points=Array.from({length:361},(_,i)=>{const x=lo+(hi-lo)*i/360;return p(x,M.pdf(x,mu,sd));});if(shade){const upper=z===null?hi:clamp(mu+z*sd,lo,hi),pts=[p(lo,0)];for(let i=0;i<=180;i++){const x=lo+(upper-lo)*i/180;pts.push(p(x,M.pdf(x,mu,sd)));}pts.push(p(upper,0));fill(pts,color,.13);}line(points,color,width,dash);}
 function panels(w,h){const top=state.step===6?150:126,bottom=114,gap=w<720?47:36;if(w<720){const hh=(h-top-bottom-gap)/2;return [{x:30,y:top,w:w-60,h:hh},{x:30,y:top+hh+gap,w:w-60,h:hh}];}const ww=(w-140-gap)/2;return [{x:70,y:top,w:ww,h:h-top-bottom},{x:70+ww+gap,y:top,w:ww,h:h-top-bottom}];}
 function pointer(ch,x,color,caption){const pos=ch.project(clamp(x,ch.mu-3.9*ch.unit,ch.mu+3.9*ch.unit),0);dot(pos,color,4);if(caption)label(caption,pos.x,pos.y+34,{size:11,color});return pos;}
 function arrow(a,b){line([a,b],C.gold,1.3,[4,5]);const t=Math.atan2(b.y-a.y,b.x-a.x);line([{x:b.x-7*Math.cos(t-.5),y:b.y-7*Math.sin(t-.5)},b,{x:b.x-7*Math.cos(t+.5),y:b.y-7*Math.sin(t+.5)}],C.gold,1.3);}
 function sampleScene(w,h,camera){const p=params(),[a,b]=panels(w,h),hist=S.histogram(u.records,p.mu-4*p.se,p.mu+4*p.se),max=Math.max(M.pdf(p.mu,p.mu,p.se)*1.4,...hist.densities.map(v=>v*1.08)),left=chart(a,camera,{title:'总体：单个观测 X',subtitle:`μ=${p.mu} · σ=${p.sigma}`,axis:'x'}),right=chart(b,camera,{unit:p.se,max,title:'反复抽样：每组一个 X̄',subtitle:`n=${p.n} · 标准误=${fmt(p.se)}`,axis:'x̄'});rects=[a,b];curve(left,p.mu,p.sigma,C.blue,{shade:true});
  const rp=right.project,lo=p.mu-4*p.se;for(let i=0;i<hist.counts.length;i++){if(!hist.counts[i])continue;const x=lo+i*hist.width,y=hist.densities[i];fill([rp(x,0),rp(x,y),rp(x+hist.width*.92,y),rp(x+hist.width*.92,0)],C.green,.25);line([rp(x,0),rp(x,y),rp(x+hist.width*.92,y),rp(x+hist.width*.92,0)],'#90ad8c',.65);}
  curve(right,p.mu,p.se,C.green,{dash:[5,4]});label('直方图：已抽得的均值 · 虚线：理论分布',b.x+b.w/2,b.y+49,{size:10,color:C.muted});
  if(hist.below+hist.above)label(`图示范围外 ${hist.below+hist.above} 个均值（计入总数）`,b.x+b.w/2,b.y+b.h+12,{size:10,color:C.muted});
  if(!u.batch){label(u.records.length?'每一组样本，只留下一个均值':'点击「抽取一组」开始',w/2,h-99,{size:12,color:C.gold});return;}
  const batch=u.batch,t=u.progress,tx=w/2,ty=w<720?(a.y+a.h+24):h-143,spacing=Math.min(14,(w<720?w-90:Math.min(650,w-180))/Math.max(1,p.n-1)),leftX=tx-spacing*(p.n-1)/2;
  const trayStart={x:leftX-12,y:ty},trayEnd={x:leftX+(p.n-1)*spacing+12,y:ty};line([trayStart,trayEnd],'#ccd9c9',2);
  const target=rp(clamp(batch.mean,p.mu-3.9*p.se,p.mu+3.9*p.se),0),merge={x:tx,y:ty};
  batch.values.forEach((v,i)=>{const from=left.project(clamp(v,p.mu-3.9*p.sigma,p.mu+3.9*p.sigma),M.pdf(v,p.mu,p.sigma)),tray={x:leftX+i*spacing,y:ty},q=clamp((t-i/p.n*.18)/.43,0,1),r=clamp((t-.5)/.25,0,1),pos=t<.5?{x:from.x+(tray.x-from.x)*q,y:from.y+(tray.y-from.y)*q-25*Math.sin(q*Math.PI)}:{x:tray.x+(merge.x-tray.x)*r,y:tray.y};if(t<.76)dot(pos,C.blue,p.n>25?2:3);});
  if(t>=.5){const f=clamp((t-.72)/.28,0,1),pos={x:merge.x+(target.x-merge.x)*f,y:merge.y+(target.y-merge.y)*f-20*Math.sin(f*Math.PI)};dot(pos,C.green,5);label('x̄='+fmt(batch.mean),pos.x,pos.y-18,{size:12,color:C.green});}
  if(w>=720){arrow({x:a.x+a.w*.75,y:ty},{x:tx-28,y:ty});arrow({x:tx+28,y:ty},{x:b.x+b.w*.25,y:ty});}label('抽取 n 个观测值 → 求平均 → 记下一个均值点',w/2,w<720?h-98:ty+28,{size:11,color:C.muted});
 }
 function compare(w,h,camera){const p=params(),rect={x:w<720?31:95,y:135,w:w-(w<720?62:190),h:h-330},ch=chart(rect,camera,{max:M.pdf(p.mu,p.mu,p.se)*1.2,title:'同一个 μ，两种波动',subtitle:'蓝色：X　　绿色：X̄',axis:'相同的观测单位'});curve(ch,p.mu,p.sigma,C.blue,{shade:true,width:p.n===1?6:3});curve(ch,p.mu,p.se,C.green,{shade:true,width:3,dash:p.n===1?[6,4]:[]});const q=ch.project;
  line([q(p.mu,0),q(p.mu,ch.max*.88)],C.gold,1,[4,5]);label('共同中心 μ='+p.mu,w/2,rect.y+49,{size:11,color:C.gold});
  for(const [sd,c,caption,y] of [[p.sigma,C.blue,'σ = '+p.sigma,-.09],[p.se,C.green,'σ/√n = '+fmt(p.se),-.24]]){const a=q(p.mu-sd,ch.max*y),b=q(p.mu+sd,ch.max*y);line([a,b],c,1.8);for(const pt of[a,b])line([{x:pt.x,y:pt.y-4},{x:pt.x,y:pt.y+4}],c,1.3);label(caption,(a.x+b.x)/2,(a.y+b.y)/2+14,{size:11,color:c});}
  if(p.n===1)label('n = 1：X 与 X̄ 的分布重合',w/2,h-112,{size:14,color:C.gold});else label(`n = ${p.n}：宽度变为 1/√n，峰值变为 √n 倍`,w/2,h-112,{size:13,color:C.green});
 }
 function standard(w,h,camera){const p=params(),ts=S.transform(p.mu,p.sigma,p.n,u.phase,state.z),[a,b]=panels(w,h),max=M.pdf(0,0,Math.min(ts[0].sd,ts[1].sd))*1.23,unit=Math.max(ts[0].sd,ts[1].sd),center=ts[0].mean,phase=Math.min(2,Math.floor(u.phase+.001));
  if(u.phase>=1.999){const rect={x:w<720?33:110,y:155,w:w-(w<720?66:220),h:h-282},ch=chart(rect,camera,{mu:0,unit:1,max:.5,title:'标准化后：两条曲线重合',subtitle:'Z 与 Zₓ̄ 都服从 N(0,1)',axis:'z'});curve(ch,0,1,C.blue,{shade:true,z:state.z,width:7});curve(ch,0,1,C.green,{z:state.z,dash:[7,5],width:2.6});line([ch.project(state.z,0),ch.project(state.z,M.pdf(state.z))],C.gold,1.3,[4,4]);pointer(ch,state.z,C.gold,'z = '+fmt(state.z));const anchor=ch.project(-.8,.11);label('相同分位面积 '+prob().toFixed(4),anchor.x,anchor.y,{size:12,color:C.green});return;}
  [a,b].forEach((r,i)=>{const v=ts[i],name=i?'X̄':'X',den=i?'σ/√n':'σ',title=phase===0?name:phase===1?name+' − μ':`(${name}−μ)/(${den})`,ch=chart(r,camera,{mu:center,unit,max,title,subtitle:`中心 ${fmt(v.mean)} · 标准差 ${fmt(v.sd)}`,axis:phase===0?(i?'x̄':'x'):phase===1?'减 μ 后':'z'});curve(ch,v.mean,v.sd,i?C.green:C.blue,{shade:true,z:state.z});const at=v.value;line([ch.project(at,0),ch.project(at,M.pdf(at,v.mean,v.sd))],C.gold,1.2,[4,4]);pointer(ch,at,C.gold,fmt(at));label(`同一分位：z = ${fmt(state.z)}`,r.x+r.w/2,r.y+49,{size:10,color:C.muted});});
 }
 function draw({w,h,current}){if(state.step===4)sampleScene(w,h,current);if(state.step===5)compare(w,h,current);if(state.step===6)standard(w,h,current);}
 return {enter,update,draw,tick,pause,reset,actions,get diagnostics(){const p=params(),stats=S.summary(u.records);return {...p,count:u.records.length,empirical:stats,batch:u.batch?{values:[...u.batch.values],mean:u.batch.mean}:null,progress:u.progress,running:u.running,phase:u.phase,standardRunning:u.standardRunning,transforms:S.transform(p.mu,p.sigma,p.n,u.phase,state.z),probability:prob()};}};
}
window.NormalSampling={create};
})();

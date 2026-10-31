/* Linked plant-growth and Liebig barrel metaphor. Relative sufficiency is
   conceptual: neither plant height nor water volume predicts field yield. */
(()=>{'use strict';
const keys=['n','p','k'],names=['N','P','K'],colors=['#d6ad53','#69aabb','#b591ba'],TAU=Math.PI*2;
function evaluate(v){const a=keys.map(k=>Number(v[k]));if(a.some(x=>!Number.isFinite(x)||x<0||x>100))throw Error('Relative sufficiency must be within 0–100');const value=Math.min(...a);return {value,limiters:names.filter((_,i)=>Math.abs(a[i]-value)<.001),limiter:names[a.indexOf(value)],height:.65+value*.033}}
const presets=[[80,35,70],[80,35,70],[100,35,70],[100,90,70],[90,90,90]];
const copy=[['同样的环境，为什么长得不一样？','右侧虚线是充足供给的参照。先看缺磷植株，再观察左侧木桶。'],['磷是短板，其他养分不能替代它','木板表示供给相对需求的满足程度；水位表示受限的生长潜力。'],['只补氮，短板仍然是磷','N 从 80% 提到 100%，P 仍为 35%：水位与示意植株不变。'],['补磷后，限制转向钾','P 提高到 90%，水位升到 70%，K 成为新的短板。'],['协调供给，解除当前短板','N、P、K 均为 90%，共同决定此时的上限；继续拖动滑块探索。']];
function curve(a,b,c,n=16){return Array.from({length:n+1},(_,i)=>{const t=i/n,u=1-t;return a.map((x,k)=>u*u*x+2*u*t*b[k]+t*t*c[k])})}
function crop(w,x,y,z,height,{ghost=false}={}){const sway=Math.sin(w.time*1.3)*.035,stem=curve([x,y,z],[x+sway,y+height*.55,z],[x+sway*2,y+height,z],12),col=ghost?'#a6b39a':'#4f824a';w.line(stem,col,ghost?1:3,{dash:ghost?[4,5]:[],alpha:ghost?.7:1});
for(let i=0;i<7;i++){const f=.2+i*.097,side=i%2?1:-1,base=[x+sway*f,y+height*f,z],len=height*(.4-Math.abs(i-3)*.032),tip=[base[0]+side*len,y+height*f+height*.06,z+(i%3-1)*.25],mid=[base[0]+side*len*.53,y+height*f+height*.22,z+(i%3-1)*.14],axis=curve(base,mid,tip,14);if(ghost){w.line(axis,col,.8,{dash:[4,5],alpha:.6});continue}const width=height*.053;for(let j=0;j<axis.length-1;j++){const t=j/(axis.length-1),u=(j+1)/(axis.length-1),a=axis[j],b=axis[j+1],wa=Math.sin(Math.PI*t)*width,wb=Math.sin(Math.PI*u)*width;w.poly([[a[0],a[1],a[2]-wa],[b[0],b[1],b[2]-wb],[b[0],b[1]-.015,b[2]+wb],[a[0],a[1]-.015,a[2]+wa]],i%2?'#81a658':'#6b9750')}w.line(axis,'#bdd18c',.6)}
}
function draw(w,s){const m=evaluate(s.values),vals=[s.values.n,s.values.p,s.values.k,100,100,100],labels=['N','P','K','Ca','Mg','S'],cx=-2.35,r=1.62,base=.13,h=v=>base+.4+v*.031,water=h(m.value),limit=names.indexOf(m.limiter),angles=[-Math.PI/2-TAU/6,-Math.PI/2,-Math.PI/2+TAU/6,Math.PI/2-TAU/6,Math.PI/2,Math.PI/2+TAU/6];
w.ground(12,6.6);w.road(0,2.7,12,.46);w.tree(-5,-2.3,1.2);w.tree(5,-2.3,1.4);
// Independent wooden sectors, with a visible top edge on every stave.
w.cylinder(cx,base,0,r,.15,'#a3875b',{n:36});
for(let i=0;i<6;i++)for(let j=0;j<4;j++){const a=angles[i]-Math.PI/6+j*Math.PI/12+.009,b=a+Math.PI/12-.018,hh=h(vals[i]),pa=[cx+Math.cos(a)*r,base,Math.sin(a)*r],pb=[cx+Math.cos(b)*r,base,Math.sin(b)*r],up=p=>[p[0],hh,p[2]],inward=p=>[cx+(p[0]-cx)*.93,p[1],p[2]*.93],color=(i<3&&m.limiters.includes(labels[i]))?'#c99754':i<3?'#c4a97b':'#b8ad90';w.poly([pa,pb,up(pb),up(pa)],color,{line:'#f0dfbb',alpha:.91});w.poly([up(pa),up(pb),inward(up(pb)),inward(up(pa))],'#dfc898');}
// Water reaches the shortest edge; it does not turn into a nutrient stream.
w.cylinder(cx,base+.15,0,r*.925,water-base-.15,'#74b8c4',{n:40,alpha:.58});
for(const hh of [.36,.78]){const pts=[];for(let i=0;i<=48;i++){const a=i/48*TAU;pts.push([cx+Math.cos(a)*(r+.025),hh,Math.sin(a)*(r+.025)])}w.line(pts,'#7d8067',3)}
for(let i=0;i<6;i++){if(w.width<600&&i>2)continue;const a=angles[i];w.label([cx+Math.cos(a)*r,h(vals[i])+.2,Math.sin(a)*r],i<3?`${labels[i]} ${Math.round(vals[i])}%`:labels[i],{size:i<3?13:10,pill:i===limit,color:i<3?colors[i]:'#8d967d'});}
for(let k=0;k<3;k++){const rr=.2+(w.time*.24+k*.32)%1*1.2,pts=[];for(let j=0;j<=40;j++){const a=j/40*TAU;pts.push([cx+Math.cos(a)*rr,water+.023,Math.sin(a)*rr])}w.line(pts,'#d1f0ea',.8,{alpha:.65})}
const a=angles[limit],exit=[cx+Math.cos(a)*r,water+.02,Math.sin(a)*r];if(m.value<99.5){w.stream([exit,[exit[0]+Math.cos(a)*.42,water-.15,exit[2]+Math.sin(a)*.42],[exit[0]+Math.cos(a)*.65,.08,exit[2]+Math.sin(a)*.65]],'#69b3c5',{count:13,speed:.35,size:.05});w.label([exit[0],water-.4,exit[2]],'从短板处溢出',{dy:22,pill:true,size:11,color:'#4a8794'})}
// A symbolic inlet keeps the overflow metaphor readable.
w.line([[cx-2.1,.1,.3],[cx-2.1,4.25,.3],[cx-.45,4.25,.3]],'#9eaaa0',5);w.stream([[cx-.45,4.25,.3],[cx-.45,water+.08,.3]],'#7ebdca',{count:9,speed:.42,size:.04});
w.label([cx,4.85,0],w.width<600?'木桶短板':'木桶：最短板决定水位',{size:w.width<600?11:15,color:'#7a7150'});w.label([cx,water,0],`${Math.round(m.value)}%`,{size:22,pill:true,color:'#377884',dy:-8});
// The plant grows in its own soil bed: there is no physical water pipe from barrel.
const px=3.05,py=.18;w.box(px,-.64,0,3.15,.83,2.5,'#b7a17d');w.box(px,.19,0,3.15,.07,2.5,'#9dad78');crop(w,px,py+.08,0,3.95,{ghost:true});crop(w,px,py+.08,0,m.height);
for(let i=0;i<8;i++){const aa=i/8*TAU,b=[px,py,0],mid=[px+Math.cos(aa)*.35,-.16,Math.sin(aa)*.35],end=[px+Math.cos(aa)*.85,-.57,Math.sin(aa)*.7];w.line([b,mid,end],'#e5d8ac',1.3)}
for(let i=0;i<3;i++){const x=px-1+i;w.dot([x,-.34,.9],.1,colors[i]);w.stream([[x,-.34,.9],[px,-.2,.4],[px,py+.3,0]],colors[i],{count:Math.max(2,Math.round(vals[i]/18)),speed:.12,size:.037});w.label([x,-.54,1.05],names[i],{size:11,color:colors[i]})}
w.label([px,4.85,0],w.width<600?'植物生长':'植物：生长受到同一短板限制',{size:w.width<600?11:15,color:'#507947'});w.label([px,4.34,0],'虚线：养分充足参照',{size:10,color:'#8b9b80'});
const z=1.7,meterY=.12;w.line([[1.6,meterY,z],[4.5,meterY,z]],'#d5dfcb',8);w.line([[1.6,meterY+.01,z],[1.6+2.9*m.value/100,meterY+.01,z]],'#709c60',8);w.label([px,-.25,z],`示意生长潜力 ${Math.round(m.value)}%`,{size:12,color:'#547b47',dy:22,pill:true});
w.arrow([-.25,1.65,.15],[1.05,1.65,.15],'#90a382');w.label([.4,1.95,.15],'同一限制',{size:10,color:'#869878'});
}
function setup(world,state){world.extent=14.6;world.target=1.8;world.camera.yaw=world.current.yaw=world.initial.yaw=-.12;world.camera.pitch=world.current.pitch=world.initial.pitch=.29;world.draw=w=>draw(w,state);const stage=document.querySelector('.stage'),card=document.createElement('aside');card.className='minimum-story';card.setAttribute('aria-label','生长与短板');card.innerHTML='<div class="minimum-step" id="minimum-step"></div><h2 id="minimum-heading"></h2><p id="minimum-explain"></p><div class="minimum-result"><strong id="minimum-percent">35%</strong><span id="minimum-limiter"></span></div><div class="minimum-actions"><button id="minimum-feed">补当前短板 ↑</button><button id="minimum-balanced">协调供给</button></div><small>相对供给 ÷ 需求；其他养分、水光温适宜。<br>木桶与株高为比喻，非产量或用肥量预测。</small>';stage.append(card);
let last='';const oldUpdate=world.update;world.update=dt=>{oldUpdate(dt);const signature=state.step+JSON.stringify(state.targets);if(signature===last)return;last=signature;const m=evaluate(state.targets),custom=keys.some((k,i)=>state.targets[k]!==presets[state.step][i]);document.getElementById('minimum-step').textContent=`${String(state.step+1).padStart(2,'0')} / 观察 · 比较 · 补足`;document.getElementById('minimum-heading').textContent=custom?'自己调整，观察新的短板':copy[state.step][0];document.getElementById('minimum-explain').textContent=custom?'比较各养分相对需求的满足度；只有提高当前最低项，才可能解除这一限制。':copy[state.step][1];document.getElementById('minimum-percent').textContent=m.value+'%';document.getElementById('minimum-limiter').textContent=m.limiters.join('、')+(m.limiters.length>1?' 共同限制':' 限制当前生长');world.canvas.dataset.limiter=m.limiters.join(',');world.canvas.dataset.potential=m.value;};
function set(key,v){const input=document.getElementById('param-'+key);input.value=v;input.dispatchEvent(new Event('input',{bubbles:true}))}document.getElementById('minimum-feed').onclick=()=>{const m=evaluate(state.targets);m.limiters.forEach(n=>set(n.toLowerCase(),100))};document.getElementById('minimum-balanced').onclick=()=>keys.forEach(k=>set(k,90));}
window.MinimumGrowth={evaluate,presets,setup};TeachingModels.minimum=evaluate;
})();


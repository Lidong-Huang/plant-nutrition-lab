/* Perspective field and probability scenes, rendered with the site's shared maize. */
(()=>{'use strict';
const M=TrialStoryModel,TAU=2*Math.PI,blue='#7a9db6',green='#62956d',gold='#bb914f',ink='#597354';
const centers=[[-3.05,-2.05],[3.05,-2.05],[-3.05,2.05],[3.05,2.05]];
function create(canvas,view){
 const w=new PlantWorld.World(canvas,{yaw:-.40,pitch:.58,extent:19,target:1.15});
 const originalSky=w.sky.bind(w);w.sky=function(){const v=view();if(v.step<4||v.step===15)return originalSky();const c=w.ctx,g=c.createLinearGradient(0,0,0,w.height);g.addColorStop(0,'#f1f5eb');g.addColorStop(1,'#edf2e4');c.fillStyle=g;c.fillRect(0,0,w.width,w.height)};
 let hits=[],lastStep=-1;
 function field(v){
  w.extent=19;w.target=w.width<600?3.2:.6;
  w.ground(17.6,12);w.road(0,5.1,17.2,.85);w.road(0,0,15.2,.6);w.road(-7.5,0,.7,9.6);w.road(7.5,0,.7,9.6);
  FieldAssets.channel(w,[[-6.9,0,-4.8],[6.8,0,-4.8]],.25);FieldAssets.channel(w,[[6.8,0,-4.8],[6.8,0,4.6]],.25,{drain:true});
  for(let i=0;i<19;i++)FieldAssets.maize(w,-6.3+i*.7,.02,-4.1,.62,30+i,{guard:true});
  for(const x of [-6.6,6.6])for(let i=0;i<8;i++)FieldAssets.maize(w,x,.02,-3.4+i*.94,.62,50+i,{guard:true});
  FieldAssets.tractor(w,-4.5+Math.sin(w.time*.06)*.3,5.1);FieldAssets.gate(w,-6.7,-4.7);
  if(w.width>=600){w.label([-6.7,.2,-4.85],'进水渠',{size:10,pill:true});w.label([6.9,.2,3.4],'排水沟',{size:10,pill:true});}
  hits=[];
  centers.forEach(([x,z],i)=>{
   const harvested=v.session.e.harvest.includes(i),active=v.harvesting===i;
   w.box(x,.015,z,4.7,.06,3.05,harvested?'#b1a67a':'#a5ad75');
   for(let r=0;r<3;r++)w.line([[x-1.9,.09,z-1.05+r*1.0],[x+1.9,.09,z-1.05+r*1.0]],'#bcb385',1);
   for(let a=0;a<3;a++)for(let b=0;b<3;b++){
    const xx=x-1.45+a*1.45,zz=z-.96+b*.96,seed=i*19+a*5+b;
    if(harvested){w.cylinder(xx,.09,zz,.023,.21,'#a49c66',{n:5});continue;}
    if(active&&((a+b)%3)/3<v.harvestPhase)continue;
    MaizeShoot.draw(w,{x:xx,y:.09,z:zz,height:1.24+(seed%5)*.045,stage:'mature',seed,detail:'low'});
   }
   w.line([[x-2.23,.11,z-1.38],[x+2.23,.11,z-1.38],[x+2.23,.11,z+1.38],[x-2.23,.11,z+1.38],[x-2.23,.11,z-1.38]],v.selected===i?'#caa05c':'#d7d9aa',v.selected===i?2.6:1);
   w.label([x,.12,z+1.5],harvested?`重复${i+1} · ${M.values[i]}公斤/亩`:`重复${i+1}${v.step===1?' · 点击收获':''}`,{size:11,pill:true,color:harvested?'#718351':'#4e6e47'});
   hits.push({i,p:w.project([x,.6,z]),radius:Math.max(28,w.project([x,.6,z]).scale*1.9)});
   if(active||v.selected===i&&!harvested){
    for(let j=0;j<4;j++){const f=(v.harvestPhase+j*.19)%1,px=x+(j-1.5)*.25,py=.8+Math.sin(f*Math.PI)*1.1,pz=z+f*.6;
     MaizeGrainGeometry.cob(w,px,py,pz,{scale:.16,husk:true,tilt:.4});
    }
   }
  });
  if(w.width>=600)w.label([0,.18,4.55],'一个处理 · 四次独立重复',{size:12,pill:true});
  if(v.step===1&&v.selected!==null){
   const x=1.4,z=4.9,recorded=v.session.e.harvest.includes(v.selected);
   w.box(x,.7,z,3,.15,1.35,'#bfc8b0');for(const dx of [-1.28,1.28])for(const dz of [-.48,.48])w.box(x+dx,0,z+dz,.08,.7,.08,'#899b82');
   w.box(x,.85,z,1.45,.26,.8,'#e2e6d9');w.box(x,.97,z+.41,.84,.14,.02,'#344d41');w.label([x,1.04,z+.45],`${(M.values[v.selected]*.03*(recorded?1:v.weighPhase)).toFixed(2)} kg`,{size:11,color:'#e4e8be'});
   w.cylinder(x,1.12,z,.65,.04,'#a5b5a5',{n:20});
   if(v.readyForWeigh||recorded)for(let j=0;j<16;j++){const a=j*2.4,r=.42*Math.sqrt((j+.5)/16);MaizeGrainGeometry.kernel(w,x+Math.cos(a)*r,1.21+(j%3)*.035,z+Math.sin(a)*r*.64,{size:.14,color:'#d9ae50'});}
   w.label([x,1.83,z],recorded?'称重 → 折合亩产':'收获称重台',{size:12,pill:true,color:'#7d865e'});
  }
  if(v.step===2||v.step===3){
   const lo=460,hi=620,map=x=>(x-lo)/(hi-lo)*11-5.5;
   w.line([[-5.5,2.8,0],[5.5,2.8,0]],'#92a17a',1.5);
   for(const x of [480,500,520,540,550,560,580,600])w.label([map(x),2.8,0],String(x),{size:10,dy:17});
   for(const x of M.values)w.dot([map(x),2.9,0],.085,blue);
   w.line([[map(500),2.6,0],[map(500),3.7,0]],'#9eae8b',1.3,{dash:[4,4]});w.label([map(500),3.95,0],'历史500',{size:11});
   if(M.correct(v.session,'mean')){w.dot([map(550),3.08,0],.11,gold);w.label([map(550),3.7,0],'均值550 · 高出50',{size:14,pill:true,color:'#94753b'});}
  }
  if(v.step===15){w.label([0,3.75,0],'550 vs 500',{size:26,pill:true,color:'#526d3e'});w.label([0,3.1,0],'p≈0.0152 ＜ 0.05',{size:16,pill:true,color:'#a07f3f'});}
  canvas.dataset.fieldFacilities='roads-guard-irrigation-drain-tractor';
 }
 function axis({lo=-5.5,hi=5.5,ticks=[-4,-2,0,2,4],unit='',yScale=7.5}={}){
  const X=x=>(x-lo)/(hi-lo)*12-6;
  w.line([[-6.2,0,0],[6.4,0,0]],'#90a181',1.2);w.arrow([6.15,0,0],[6.55,0,0],'#90a181');
  w.line([[X((lo+hi)/2),0,0],[X((lo+hi)/2),3.8,0]],'#c4cfb7',.8,{dash:[3,6]});
  for(const x of ticks){w.line([[X(x),0,0],[X(x),-.08,0]],'#9cad89',.8);w.label([X(x),-.31,0],Math.abs(x)<.00001?'0':Number(x.toFixed(2)).toString(),{size:11});}
  w.label([-6.05,3.9,0],'概率密度',{size:10,color:'#8a9b7e'});if(unit)w.label([6.3,-.48,0],unit,{size:10,color:'#8a9b7e'});
  for(let y=1;y<=3;y++)w.line([[-6,y,0],[6,y,0]],'#d9e1cf',.55,{dash:[3,6],alpha:.7});
  return {X,Y:p=>p*yScale,lo,hi};
 }
 function curve(fn,a,color,{fill=false,area=null,dash=[],alpha=.13}={}){
  const points=[],shaded=[];for(let i=0;i<=160;i++){const x=a.lo+(a.hi-a.lo)*i/160,pt=[a.X(x),a.Y(fn(x)),0];points.push(pt);if(area?.(x))shaded.push(pt);}
  if(fill)w.poly([[a.X(a.lo),0,0],...points,[a.X(a.hi),0,0]],color,{alpha,lit:false});
  if(shaded.length)w.poly([[shaded[0][0],0,0],...shaded,[shaded[shaded.length-1][0],0,0]],color,{alpha:.25,lit:false});
  w.line(points,color,2,{dash});
 }
 function sampling(v){
  const n=v.step===4?4:v.sampleN,se=40/Math.sqrt(n),a=axis({lo:340,hi:660,ticks:[380,420,460,500,540,580,620],unit:'公斤/亩',yScale:100});
  curve(x=>NormalMath.pdf(x,500,40),a,blue,{fill:true});if(v.step===5||v.session.e.nullModel)curve(x=>NormalMath.pdf(x,500,se),a,green,{fill:true,dash:v.session.e.samples.length<15?[5,4]:[]});
  w.label([-3.6,3.65,0],'历史单个小区 X',{size:12,color:blue});if(v.step===5||v.session.e.nullModel)w.label([2.3,3.65,0],`每次试验的均值 X̄ · n=${n}`,{size:12,color:green});
  w.line([[a.X(460),-.7,0],[a.X(540),-.7,0]],blue,2);w.label([a.X(500),-1.0,0],'σ＝40',{size:11,color:blue});
  w.line([[a.X(500-se),-.46,0],[a.X(500+se),-.46,0]],green,3);w.label([a.X(500),.28,0],`SE＝${se.toFixed(0)}`,{size:10,color:green});
  if(v.step===4){
   const means=v.session.e.samples.map(x=>x.reduce((s,a)=>s+a,0)/x.length);
   if(means.length<15){for(const x of means)w.dot([a.X(x),.12,0],.055,green);}
   else{const width=10;for(let x=340;x<660;x+=width){const count=means.filter(t=>t>=x&&t<x+width).length,h=count/(means.length*width)*100;if(count)w.box(a.X(x+width/2),0,0,(a.X(x+width)-a.X(x))*.88,h,.10,'#98b18a',{alpha:.63});}}
   if(v.batch){const f=v.batchPhase;for(const x of v.batch.values){const start=[a.X(x),.38,0],end=[a.X(v.batch.mean),.12,0];w.dot(start.map((t,j)=>t+(end[j]-t)*f),.08,f>.9?green:blue);}
    w.label([a.X(v.batch.mean),2.7,0],`本次均值 ${v.batch.mean.toFixed(1)}`,{size:12,pill:true,color:'#638551'});}
  }
  canvas.dataset.samplingWidthRatio=String(1/Math.sqrt(n));canvas.dataset.samplingN=String(n);
 }
 function unknown(v){const a=axis(),estimated=v.session.e.estimated;curve(x=>NormalMath.pdf(x),a,blue,{dash:[5,5]});w.label([0,3.65,0],estimated?'分母估出来了，还能查这张表吗？':'本来可以查标准正态表……',{size:13,color:blue,pill:true});w.label([2.6,1.7,0],estimated?'我们先估成12.91':'但550应该放在哪里？',{size:12,color:'#a38b55',pill:true});w.label([0,-.8,0],estimated?'(550 − 500) / (s/√4) ＝ (550 − 500) / 12.91':'(550 − 500) / (σ/√4) ＝ ？',{size:estimated?12:14,color:'#8e815c'});canvas.dataset.unknownSE='true';}
 function standard(v){
  const phase=v.standardVisual,{center,scale,cutoff:value}=M.standardMapping(phase);
  const lo=center-4*scale,hi=center+4*scale,a=axis({lo,hi,ticks:[-3,-2,-1,0,1,2,3].map(z=>center+z*scale),yScale:scale*7.5});
  const pdf=x=>NormalMath.pdf(x,center,scale);curve(pdf,a,blue,{fill:true});
  const tail=Array.from({length:61},(_,i)=>{const x=value+(hi-value)*i/60;return [a.X(x),a.Y(pdf(x)),0];});w.poly([[a.X(value),0,0],...tail,[a.X(hi),0,0]],gold,{alpha:.65,lit:false});
  if(v.session.e.tableOpened&&phase>=1.99){const parts=Math.round(8+56*(v.lookupVisual||1)),dx=(value-center)/parts;for(let i=0;i<parts;i++){const x=center+i*dx;w.poly([[a.X(x),0,0],[a.X(x),a.Y(pdf(x+dx/2)),0],[a.X(x+dx),a.Y(pdf(x+dx/2)),0],[a.X(x+dx),0,0]],blue,{alpha:.45,lit:false});}w.label([a.X(1.1),1.0,0],'表中：0到2.50',{size:11,color:'#5f8196',pill:true});}
  w.line([[a.X(value),0,0],[a.X(value),2.4,0]],gold,1.4,{dash:[4,4]});w.dot([a.X(value),.05,0],.08,gold);
  w.label([0,3.65,0],phase<.99?'原始均值分布':phase<1.99?'减去500：中心移到0':'除以标准误差：标准差变为1',{size:14,color:ink,pill:true});
  w.label([a.X(value),2.85,0],`${phase<1.99?'当前坐标':'Z'}＝${value.toFixed(phase<1.99?1:2)}`,{size:12,color:'#9e7e3f',pill:true});
  canvas.dataset.standardCenter=String(center);canvas.dataset.standardScale=String(scale);
 }
 function tScene(v){
  const n=v.step===9?v.compareN:4,df=n-1,a=axis(),stage=v.step;
  const compare=stage===8||stage===9;
  const val=stage===14&&v.session.e.noisy?M.stats(M.noisy).t:M.stats(M.values).t;
  const cut=stage===9?2:stage===13?M.stats(M.values).critical:val;
  let area=null;if(stage===9)area=x=>x>=cut;if(stage===11&&v.tail)area=v.tail==='right'?x=>x>=val:v.tail==='left'?x=>x<=val:x=>x>=-val&&x<=val;if(stage===12||stage===13||stage===14&&v.session.e.noisy)area=x=>x>=cut;
  if(compare)curve(x=>NormalMath.pdf(x),a,blue,{area:stage===9?x=>x>=cut:null,dash:[5,4]});
  curve(x=>StudentTMath.pdf(x,df),a,gold,{fill:!compare,area});
  w.label([-3.7,3.65,0],compare?'标准正态 N(0,1)':'本次试验 · n＝4',{size:12,color:compare?blue:ink});w.label([2.3,3.65,0],`t 分布 · df＝${df}`,{size:12,color:gold});
  if(stage>=10){
   if(stage!==10||v.session.e.calculated){w.line([[a.X(val),0,0],[a.X(val),2.65,0]],stage===14?'#728c5b':gold,1.6,{dash:[4,4]});w.dot([a.X(val),.04,0],.08,gold);w.label([a.X(val),2.95,0],`t≈${val.toFixed(2)}`,{size:14,color:'#94723c',pill:true});}
   if(stage===13||stage===14&&v.session.e.noisy){const critical=M.stats(M.values).critical;w.line([[a.X(critical),0,0],[a.X(critical),1.8,0]],'#92a57a',1.2,{dash:[3,4]});w.label([a.X(critical),2.08,0],'临界值2.353',{size:11,color:'#7d8f68',pill:true});w.label([a.X(3.9),.6,0],stage===13?'右尾5% · 拒绝域':'α＝0.05',{size:11,color:'#9c804a'});}
   if((stage===11&&v.session.e.probability)||stage===12)w.label([a.X(4.1),1.8,0],'右尾面积≈1.52%',{size:12,color:'#a08045',pill:true});
  }
  if(stage===9){w.line([[a.X(2),0,0],[a.X(2),2.5,0]],'#99a77f',1.2,{dash:[4,4]});w.label([a.X(2),2.85,0],'同一位置：2',{size:11,color:'#85966f',pill:true});}
  if(stage===8&&v.session.e.runs.length){
   const samples=v.session.e.runs.slice(-7),positions=samples.map((_,i)=>-4.8+i*1.45);
   samples.forEach((sample,i)=>{const st=M.stats(sample),h=Math.min(1,st.se/35);w.box(positions[i],-.9,0,.55,h,.18,'#a9b991',{alpha:.9});w.label([positions[i],-1.12,0],st.se.toFixed(1),{size:10,color:'#798b66'});});
   w.label([0,-1.48,0],'每组样本估计的标准误差会变',{size:10,color:'#839171'});
  }
  if(stage===14){const lo=450,hi=650,X=x=>(x-lo)/(hi-lo)*10-5,y=-.94;w.line([[-5,y,0],[5,y,0]],'#b2b99c',1);for(const x of M.values)w.dot([X(x),y+.10,0],.06,blue);for(const x of M.noisy)w.dot([X(x),y-.14,0],.06,gold);w.label([-5.4,y+.1,0],'原组',{size:9,color:blue});w.label([-5.4,y-.25,0],'练习',{size:9,color:gold});w.label([0,y-.55,0],'两组均值都为550，分散程度不同',{size:10,color:'#80916f'});}
  canvas.dataset.comparisonDf=String(df);canvas.dataset.tMarker=String(val);canvas.dataset.probabilityRight=String(1-StudentTMath.cdf(val,df));
 }
 w.draw=()=>{const v=view();if(lastStep!==v.step){lastStep=v.step;hits=[];}
  if(v.step===0)TrialStoryTeaching.history(w,v);else if(v.step<4||v.step===15)field(v);else{w.extent=16;w.target=w.width<600?3:1.6;if(v.step===4||v.step===5)sampling(v);else if(v.step===6)standard(v);else if(v.step===7)unknown(v);else tScene(v);}
 };
 const originalPaint=w.paint.bind(w);w.paint=()=>{originalPaint();TrialStoryTeaching.paint(w,view());};
 let down=null;canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;const v=view();if(v.step!==1)return;const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,hit=hits.filter(h=>Math.hypot(h.p.x-x,h.p.y-y)<h.radius).sort((a,b)=>Math.hypot(a.p.x-x,a.p.y-y)-Math.hypot(b.p.x-x,b.p.y-y))[0];if(hit&&v.onPlot)v.onPlot(hit.i)});
 return {world:w,centers,front(){w.camera.yaw=0;w.camera.pitch=.08;w.camera.zoom=1},reset(){Object.assign(w.camera,w.initial)},get hits(){return hits}};
}
window.TrialStoryScene={create};
})();

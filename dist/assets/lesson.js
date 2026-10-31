(()=>{'use strict';
const $=id=>document.getElementById(id),id=document.body.dataset.lesson,c=CATALOG.find(x=>x.id===id);
const initialRows=[[0,1,2,3],[2,0,3,1],[1,3,0,2]];
const state={step:0,values:{n:80,p:35,k:70,effect:0},targets:{n:80,p:35,k:70,effect:0},rows:initialRows.map(r=>[...r]),positions:initialRows.map(r=>[0,1,2,3].map(i=>r.indexOf(i))),speed:1};
const hints={uptake:['玉米为须根系：节根分出侧根，细根可形成根毛。','养分随质流、扩散等过程到达吸收根表面。','根毛是表皮细胞的伸长；离子跨膜进入后运向中柱。','进入木质部，随水分运向地上部。'],minimum:['比较相对供给，而非绝对用量。','最短的木板，决定水位。','只补氮，仍受缺磷限制。','补磷后，钾成为新的限制养分。','协调供给，提高相对生长潜力。'],nitrogen:['有机氮：储存在有机质与残体中。','矿化：有机氮 → NH₄⁺。','硝化：NH₄⁺ → NO₂⁻ → NO₃⁻。','吸收、淋失与反硝化，形成不同去向。'],blocks:['同一块田，肥力也可能不同。','沿梯度分层，区组内条件相近。','每个区组内，独立随机排列全部处理。','3 个区组重复，控制环境差异。'],interaction:['氮 × 磷：四个组合，四组植株。','两条线平行：氮效应不随磷改变。','两条线不平行：出现交互作用。','交互对比不为零；显著性仍需误差估计。']};
const extents={uptake:12,minimum:13,nitrogen:15,blocks:17,interaction:16};
const world=new PlantWorld.World($('scene'),{extent:extents[id],target:id==='uptake'?.5:id==='nitrogen'?.65:1.15,pitch:id==='blocks'?.65:.39,yaw:id==='blocks'?-.35:-.45});
world.draw=w=>TeachingWorlds[id](w,state);
const motionButton=$('motion'),rotateButton=$('rotate');
world.onInteract=()=>{rotateButton.setAttribute('aria-pressed','false')};
world.update=dt=>{for(let key of Object.keys(state.values))state.values[key]+=(state.targets[key]-state.values[key])*Math.min(1,dt*5);state.rows.forEach((row,r)=>row.forEach((treatment,column)=>{const target=state.step<2?treatment:column;state.positions[r][treatment]+=(target-state.positions[r][treatment])*Math.min(1,dt*5)}))};
if(id==='minimum'&&window.MinimumGrowth)MinimumGrowth.setup(world,state);
if(id==='uptake'&&window.MaizeUptake)MaizeUptake.setup(world,state);
document.title=`${c.title} · 立体互动演示`;$('title').textContent=c.title;$('stage-keyword').textContent=c.chapter;
const nav=$('steps');c.steps.forEach((title,i)=>{const b=document.createElement('button');b.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span>${title}`;b.onclick=()=>{stopAuto();setStep(i)};nav.append(b)});
let auto=false,autoTimer=null;const inputs={};
function slider(key,label,min,max,value,unit=''){const l=document.createElement('label');l.htmlFor=`param-${key}`;l.innerHTML=`<span>${label}</span><output id="${key}-value">${value}${unit}</output><input id="param-${key}" type="range" min="${min}" max="${max}" step="${key==='speed'?.1:1}" value="${value}" aria-label="${label}">`;$('controls').append(l);const input=l.querySelector('input');inputs[key]=input;input.oninput=()=>{stopAuto();let v=Number(input.value);if(key==='speed'){state.speed=v;world.motionSpeed=v}else state.targets[key]=v;l.querySelector('output').textContent=`${v}${unit}`;updateReadout()}}
if(id==='minimum'){slider('n','氮 N',10,100,80,'%');slider('p','磷 P',10,100,35,'%');slider('k','钾 K',10,100,70,'%')}
else if(id==='interaction')slider('effect','交互强度',-25,25,0);
else if(id==='blocks'){let b=document.createElement('button');b.className='randomize';b.id='randomize';b.textContent='重新随机 ↻';b.onclick=()=>{stopAuto();state.rows=Array.from({length:3},()=>TeachingModels.shuffle([0,1,2,3]));state.step=2;updateUI()};$('controls').append(b);let span=document.createElement('span');span.className='control-note';span.textContent='CK · N · P · NP';$('controls').append(span)}
else slider('speed','流动速度',.3,2,1,'×');
function setParam(key,v){state.targets[key]=v;if(inputs[key]){inputs[key].value=v;inputs[key].previousElementSibling.textContent=v+(id==='minimum'?'%':'')}}
function setStep(n){state.step=Math.max(0,Math.min(c.steps.length-1,n));if(id==='minimum')MinimumGrowth.presets[state.step].forEach((v,i)=>setParam(['n','p','k'][i],v));if(id==='interaction')setParam('effect',[0,0,20,20][state.step]);updateUI()}
function updateReadout(){let txt='';if(id==='minimum'){const m=TeachingModels.minimum(state.targets);txt=`${m.limiters?.join("、")||m.limiter} 限制 · 相对满足度 ${m.value}%`}else if(id==='interaction'){const m=TeachingModels.interaction(state.targets.effect);txt=`(${m.means[3]} − 35) − (40 − 20) = ${m.contrast}`}else if(id==='blocks')txt='4 处理 × 3 区组';$('readout').textContent=txt;$('scene').dataset.model=txt}
function updateUI(){nav.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===state.step);b.setAttribute('aria-current',i===state.step?'step':'false')});$('caption').textContent=hints[id][state.step];$('description').textContent=`${c.steps[state.step]}。${hints[id][state.step]}`;$('scene').setAttribute('aria-label',`${c.title}三维场景。${hints[id][state.step]} 拖动旋转，滚轮缩放。`);$('progress').textContent=`${state.step+1} / ${c.steps.length}`;$('prev').disabled=state.step===0;$('next').disabled=state.step===c.steps.length-1;updateReadout();world.canvas.dataset.step=state.step}
function stopAuto(){auto=false;clearInterval(autoTimer);autoTimer=null;$('play').textContent='▶';$('play').setAttribute('aria-pressed','false');$('play').setAttribute('aria-label','自动演示')}
function toggleAuto(){if(auto){stopAuto();return}auto=true;if(state.step===c.steps.length-1)setStep(0);world.paused=false;syncMotion();$('play').textContent='Ⅱ';$('play').setAttribute('aria-pressed','true');$('play').setAttribute('aria-label','暂停自动演示');autoTimer=setInterval(()=>{if(state.step===c.steps.length-1){stopAuto();return}setStep(state.step+1)},8500)}
function syncMotion(){motionButton.textContent=world.paused?'▶ 动画':'Ⅱ 动画';motionButton.setAttribute('aria-pressed',String(!world.paused));$('scene').dataset.motion=world.paused?'paused':'running'}
$('play').onclick=toggleAuto;motionButton.onclick=()=>{world.paused=!world.paused;syncMotion();if(world.paused)stopAuto()};rotateButton.onclick=()=>{world.autoRotate=!world.autoRotate;rotateButton.setAttribute('aria-pressed',String(world.autoRotate))};$('front').onclick=()=>{world.autoRotate=false;world.camera.yaw=0;world.camera.pitch=.1;world.camera.zoom=1;rotateButton.setAttribute('aria-pressed','false')};$('tilt').onclick=()=>{world.autoRotate=false;world.camera.pitch=world.camera.pitch>.8?world.initial.pitch:1.18;rotateButton.setAttribute('aria-pressed','false')};$('reset').onclick=()=>{stopAuto();world.resetView();world.paused=false;state.speed=1;world.motionSpeed=1;if(inputs.speed){inputs.speed.value=1;inputs.speed.previousElementSibling.textContent='1×'}state.rows=initialRows.map(r=>[...r]);setStep(0);syncMotion();rotateButton.setAttribute('aria-pressed','false')};$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('fullscreen').textContent='F11 全屏'}};$('prev').onclick=()=>{stopAuto();setStep(state.step-1)};$('next').onclick=()=>{stopAuto();setStep(state.step+1)};
document.addEventListener('keydown',e=>{if(['INPUT','BUTTON','A','CANVAS'].includes(document.activeElement.tagName))return;if(e.key==='ArrowRight'){stopAuto();setStep(state.step+1);e.preventDefault()}else if(e.key==='ArrowLeft'){stopAuto();setStep(state.step-1);e.preventDefault()}else if(e.code==='Space'){toggleAuto();e.preventDefault()}});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAuto()});
window.lessonDiagnostics={get state(){return JSON.parse(JSON.stringify(state))},get camera(){return {...world.camera}},get primitives(){return world.items.length},get time(){return world.time},get paused(){return world.paused}};
setStep(0);syncMotion();
})();





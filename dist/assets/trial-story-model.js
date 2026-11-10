/* A gated, local classroom journey. All numerical results use the recorded plots. */
(()=>{'use strict';
const baseline=500,alpha=.05,values=[520,540,560,580],noisy=[490,530,570,610];
const acts=['历史收获','四个小区','均值的波动','标准化与概率','作出判断'];
const steps=[
 ['先看看往年的小区',0,'先别急着看这次试验。往年同类条件下的小区，收成各不相同。我们把这些亩产一笔笔汇总，再看看它们怎样分布。','history','这些小区的长期平均亩产为500，说明什么？',[
  ['exact','每个小区都收获500公斤'],['center','产量有高有低，长期平均为500公斤']], 'center','对，500是这批记录的中心。小区之间仍有高低差别；接下来，我们用这个长期平均水平作比较的基准。'],
 ['现在看我们的四个小区',1,'有了历史基准，再看2024级农资班的试验。四块独立小区采用同一种处理，每块算一次重复。我们逐块收获、称重，再折算亩产。'],
 ['这次试验平均收了多少？',1,'','mean','四个小区合起来，平均亩产是多少？',[
  ['540','540公斤'],['550','550公斤'],['560','560公斤']], '550','对，平均亩产是550，比历史基准高50公斤。'],
 ['高出50，就算提高了吗？',1,'','vote','这50公斤的差别，你现在怎样看？',[
  ['usual','可能属于通常波动'],['higher','可能已经显著提高'],['unsure','信息还不够']],null,'已保留初判。接下来用分布与概率检验它。'],
 ['单个小区与四次重复的均值',2,'蓝线描述历史单个小区的波动。现在先假设处理没有提高平均水平，四个独立小区仍来自均值为500的模型。反复做这样的试验，四个数的均值又会怎样分布？','reference','我们的550来自四次重复，应放到哪个分布里判断？',[
  ['individual','历史单个小区产量的分布'],['means','每次取四个小区，再算均值的分布']], 'means','对。一个蓝点表示一个小区；一个绿点表示一次四重复试验的均值。许多次这样的均值，才构成绿色的均值抽样分布。'],
 ['增加重复数，会怎样？',2,'如果每次试验从4个小区增加到16个，平均值会不会更稳定？我们把重复数改一改，同时看蓝色单个小区分布和绿色均值分布。','width','重复数增加后，更集中的绿色分布说明什么？',[
  ['narrow','均值的波动减小，估计更稳定、更精确'],['wide','单个小区之间的波动变大'],['same','均值不再波动，试验一定显著提高']], 'narrow','对，这就是对均值估计“更有把握”：独立重复增多，SE变小，估计通常更精确。它不保证显著增产；能否显著，还要看增幅相对误差有多大。'],
 ['求概率，为什么先标准化？',3,'我们要求的是：平均亩产达到550或更高的概率。它对应曲线右侧的面积。先把产量标准化，就能共用一张标准正态积分表来求概率。','unit','为了用标准正态积分表求概率，为什么要标准化？',[
  ['sd','只把产量数值变小，面积也跟着变小'],['se','化为标准正态，共用一张积分表，所求概率不变']], 'se','对。550先减500得到50，再除以标准误差20得到2.50。曲线换了刻度，同一块面积保留下来；我们就能从标准正态积分表读取它。'],
 ['标准误差如果未知，怎么求概率？',3,'总体标准误差σ/√n未知，就不能直接算出U来查标准正态表。只有这四个小区的数据，我们只能先用样本标准误差s/√n代替总体标准误差，再判断该用哪种分布求概率。','estimate','总体标准误差未知，用什么代替？',[
  ['s','直接用四个小区的标准差 s'],['sroot','先算样本标准差s，再用s/√4'],['mean','把平均亩产550填进去']], 'sroot','对，四个产量给出s≈25.82，估计标准误差为s/√4≈12.91。请留意：刚才的20是已知σ的演示设定，现在的12.91才是本次试验算出的估计。'],
 ['先抽样，再看结果怎样分布',3,'每次抽取四个小区，计算均值和样本标准误差，再算(均值−500)÷样本标准误差。先收集这些结果，再按区间统计频率。','distribution','用样本标准误差代替总体标准误差后，应查哪种分布求概率？',[
  ['normal','标准正态分布'],['student','t分布'],['uniform','均匀分布']], 'student','对，估计分母后的这类结果服从t分布。自由度只记右边这一个例子：四个偏差的和为0，前三个确定，第4个也确定，因此df＝4−1＝3。'],
 ['U和T都有√n，为什么分布不同？',3,'我们把两式并排写出来。U用已知的总体标准误差，T用样本估计的标准误差。固定同一个n，前者的分母是定值，后者会随抽到的数据改变。沿用本课独立重复、正态总体的设定，只用几行式子看区别。','converge','两式中，决定这一区别的关键是什么？',[
  ['away','U公式里没有n，t公式里才有n'],['toward','同一n下，U的分母是已知定值；T的分母用s估计，会随样本变化'],['fixed','n大时估计分母必然精确等于总体标准误差']], 'toward','对。均值原有的方差是σ²/n，U除以σ/√n后，方差变为1。原来的均值是正态，线性变换后仍是正态，因此U的理论分布恒为N(0,1)。T额外带着随机比值σ/s，分布通过df＝n−1与n有关。'],
 ['在t分布上，我们的平均产量在哪里？概率大还是小？',3,'回到我们的四个小区：平均亩产550，估计标准误差约12.91。先把550换成t坐标，再放到自由度为3的曲线上。这个点右边还剩多少面积？','statistic','(550−500)÷12.91，约为多少？',[
  ['1.94','1.94'],['3.87','3.87'],['50','50']], '3.87','t≈3.87，df＝4−1＝3。应放到t₃分布中判断。'],
 ['比这次还偏高的结果，在哪里？',3,'试验前我们问的是“是否提高”。现在从本次t≈3.87出发，把比它还偏高的结果也包括进来。我们该看哪一侧？','tail','哪块面积包含本次及更偏高的t统计量？',[
  ['left','左侧尾部'],['right','右侧尾部'],['middle','曲线中间']], 'right','右尾包含本次及更偏高的t统计量。点击计算，查看着色面积。'],
 ['这1.52%回答了什么？',3,'我们一遍遍做同类四重复试验，每次都算一个t值。达到3.87或更高的结果，在这一同类分布的右尾约占1.52%。请对照图中的橙色部分来理解。','meaning','这句话中的1.52%，对应图中的哪一部分？',[
  ['null','曲线中央的面积'],['conditional','同类分布中，达到本次t值或更高的右尾面积'],['exact','恰好等于550公斤这一点的概率']], 'conditional','对，就是从本次t≈3.87向右一直延伸的橙色面积。同类试验的参照仍是图上标明的历史基准500，四次重复的统计量使用t₃分布。'],
 ['这种偏高，够不够少见？',4,'我们在看结果前约定：用0.05作判断界限。现在算出的p约为0.0152，小于这条界限。如果平均水平一直没变，这样的偏高确实不常见。你会怎样判断？','conclusion','按事先约定的规则，应该选择哪项结论？',[
  ['significant','在0.05水平下，相较历史基准显著提高'],['insufficient','尚未发现显著提高的证据'],['certain','已经证明提高绝不可能由波动造成']], 'significant','拒绝均值为500的基准假设，方向为偏高。仍然有误判风险。'],
 ['我们再做一批试验',4,'还是同一种处理、四次独立重复。我们先收获新的四个小区，再沿着“产量→平均值与标准误差→t位置与概率→结论”走一遍，把前面的知识放在同一页比较。','challenge','根据新一批试验的概率，这次应怎样判断？',[
  ['same','均值相同，所以仍然显著提高'],['notyet','p＞0.05，尚未发现显著提高的证据'],['noeffect','已经证明处理没有效果']], 'notyet','分散程度变大，标准误差变大，t≈1.94、p≈0.074。同样高出50公斤，证据强弱会不同。'],
 ['完成这次判断',4,'回到试验田，查看你的初判与最后的判断。']
].map((r,id)=>({id,title:r[0],act:r[1],intro:r[2],key:r[3],question:r[4],options:r[5],correct:r[6],feedback:r[7]}));
function stats(v){if(!Array.isArray(v)||v.length<2||v.some(x=>!Number.isFinite(x)))throw Error('Invalid observations');const n=v.length,mean=v.reduce((s,x)=>s+x,0)/n,s=Math.sqrt(v.reduce((a,x)=>a+(x-mean)**2,0)/(n-1)),se=s/Math.sqrt(n);if(!(s>0))throw Error('Positive sample variation required');const t=(mean-baseline)/se,df=n-1,p=1-StudentTMath.cdf(t,df),critical=StudentTMath.quantile(1-alpha,df);return {n,mean,s,se,t,df,p,critical,significant:p<alpha};}
function fresh(){return {version:4,current:0,answers:{},attempts:[],e:{history:false,historyStage:0,harvest:[],nullModel:false,samples:[],sampleN:[4],standard:0,tableOpened:false,tableMatched:false,lookup:false,estimated:false,runs:[],manualRuns:0,histogramShown:false,tRevealed:false,normalCompared:false,tailCompared:false,gossetShown:false,dfN:[4],calculated:false,probability:false,newHarvest:[],noisy:false},completedAt:null};}
function correct(s,key){const step=steps.find(x=>x.key===key),v=s.answers[key];return !!step&&step.options.some(o=>o[0]===v)&&(step.correct===null||v===step.correct);}
function ready(s,i){const e=s.e;switch(i){case 0:return e.history===true&&e.historyStage===2;case 1:return [0,1,2,3].every(x=>e.harvest.includes(x));case 4:return e.nullModel===true&&e.samples.length>=3;case 5:return [1,4,16].every(n=>e.sampleN.includes(n));case 6:return e.standard===2&&e.tableOpened&&e.tableMatched&&e.lookup;case 7:return e.estimated===true;case 8:return e.manualRuns>=3&&e.runs.length>=1000&&e.histogramShown&&e.tRevealed&&e.normalCompared&&e.tailCompared&&e.gossetShown;case 9:return e.dfN.includes(4)&&e.dfN.some(n=>n>=30);case 10:return e.calculated===true;case 11:return e.probability===true;case 14:return e.noisy===true&&[0,1,2,3].every(i=>e.newHarvest.includes(i));case 15:return false;default:return true;}}
function passed(s,i){return ready(s,i)&&(!steps[i].key||correct(s,steps[i].key));}
function unlocked(s){let i=0;while(i<steps.length-1&&passed(s,i))i++;return i;}
function navigate(s,i){if(!Number.isInteger(i)||i<0||i>unlocked(s))return false;s.current=i;return true;}
function answer(s,key,value){const step=steps[s.current];if(step.key!==key||!step.options?.some(o=>o[0]===value)||(!ready(s,s.current)&&s.current!==11))return false;if(passed(s,s.current))return correct(s,key);s.answers[key]=value;s.attempts.push({step:s.current,choice:value,correct:step.correct===null||step.correct===value});s.attempts=s.attempts.slice(-250);return correct(s,key);}
function sample(n=4,random=Math.random){const v=Array.from({length:n},()=>baseline+40*NormalMath.gaussian(random));return {n,values:v,mean:v.reduce((a,b)=>a+b,0)/n};}
function generator(seed=83091){let value=seed>>>0;return ()=>{value=(1664525*value+1013904223)>>>0;return (value+.5)/4294967296};}
function pair(v){const n=v.length,mean=v.reduce((a,b)=>a+b,0)/n,s=Math.sqrt(v.reduce((a,x)=>a+(x-mean)**2,0)/(n-1)),trueSE=40/Math.sqrt(n),estimatedSE=s/Math.sqrt(n);return {n,mean,s,trueSE,estimatedSE,z:(mean-500)/trueSE,r:(mean-500)/estimatedSE,ratio:s/40};}
function deviations(first){if(!Array.isArray(first)||first.length!==3||first.some(x=>!Number.isFinite(x)))throw Error('Three finite deviations required');return [...first,-first.reduce((a,b)=>a+b,0)];}
const convergenceCache=new Map();function convergence(n){if(!Number.isInteger(n)||n<2||n>1000)throw Error('Invalid n');if(!convergenceCache.has(n)){const random=generator(9713+n),groups=Array.from({length:120},()=>pair(sample(n,random).values)),ratios=groups.map(g=>g.ratio),trueSE=40/Math.sqrt(n);convergenceCache.set(n,{n,df:n-1,trueSE,ratios,relativeRMSE:Math.sqrt(ratios.reduce((s,r)=>s+(r-1)**2,0)/ratios.length),zTail:1-NormalMath.cdf(2),tTail:1-StudentTMath.cdf(2,n-1)});}return convergenceCache.get(n);}
let historyCache;
function historyRecords(){if(!historyCache){let seed=78391;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return (seed+.5)/4294967296},raw=Array.from({length:120},()=>NormalMath.gaussian(random)),scale=40/Math.sqrt(raw.reduce((s,x)=>s+x*x,0)/raw.length);historyCache=raw.flatMap(x=>[500+x*scale,500-x*scale]);for(let i=historyCache.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[historyCache[i],historyCache[j]]=[historyCache[j],historyCache[i]];}}return historyCache.slice();}
function historyHistogram(){const records=historyRecords(),lo=340,hi=660,width=10,counts=Array(32).fill(0);let below=0,above=0;for(const value of records){if(value<lo)below++;else if(value>=hi)above++;else counts[Math.floor((value-lo)/width)]++;}return {records,lo,hi,width,counts,below,above,total:records.length};}
function standardMapping(phase){const p=Math.max(0,Math.min(2,phase)),center=500*(1-Math.min(1,p)),divide=Math.max(0,Math.min(1,(p-1)/.72)),divisor=1+19*divide,scale=20/divisor,zoom=1+19*Math.max(0,Math.min(1,(p-1.72)/.28));return {center,scale,divisor,zoom,cutoff:center+2.5*scale,z:2.5,between:NormalMath.cdf(2.5)-.5,right:1-NormalMath.cdf(2.5)};}
function restore(raw){try{const x=typeof raw==='string'?JSON.parse(raw):raw;if(x?.version!==4||!x.e||!x.answers)return fresh();const s=fresh(),e=x.e;for(const step of steps)if(step.key&&step.options.some(o=>o[0]===x.answers[step.key]))s.answers[step.key]=x.answers[step.key];
 s.e.history=e.history===true;s.e.historyStage=[0,1,2].includes(e.historyStage)?e.historyStage:0;s.e.harvest=Array.isArray(e.harvest)?[...new Set(e.harvest.filter(i=>Number.isInteger(i)&&i>=0&&i<4))]:[];
 const finite=a=>Array.isArray(a)&&a.length===4&&a.every(Number.isFinite);s.e.samples=Array.isArray(e.samples)?e.samples.filter(finite).slice(-200):[];s.e.runs=Array.isArray(e.runs)?e.runs.filter(finite).slice(-1200):[];
 s.e.sampleN=Array.isArray(e.sampleN)?[...new Set(e.sampleN.filter(n=>[1,4,16].includes(n)))]:[4];s.e.dfN=Array.isArray(e.dfN)?[...new Set(e.dfN.filter(n=>Number.isInteger(n)&&n>=4&&n<=100))]:[4];s.e.standard=[0,1,2].includes(e.standard)?e.standard:0;
 s.e.manualRuns=Number.isInteger(e.manualRuns)?Math.max(0,Math.min(1200,e.manualRuns)):0;s.e.newHarvest=Array.isArray(e.newHarvest)?[...new Set(e.newHarvest.filter(i=>[0,1,2,3].includes(i)))]:[];
 for(const k of ['nullModel','tableOpened','tableMatched','lookup','estimated','tailCompared','tRevealed','calculated','probability','noisy'])s.e[k]=e[k]===true;const legacy=!('histogramShown' in e)&&!('normalCompared' in e)&&!('gossetShown' in e)&&e.tRevealed===true&&e.tailCompared===true,valid=s.e.manualRuns>=3&&s.e.runs.length>=1000;s.e.histogramShown=valid&&(e.histogramShown===true||legacy);s.e.tRevealed=s.e.histogramShown&&e.tRevealed===true;s.e.normalCompared=s.e.tRevealed&&(e.normalCompared===true||legacy);s.e.tailCompared=s.e.normalCompared&&e.tailCompared===true;s.e.gossetShown=s.e.tailCompared&&(e.gossetShown===true||legacy);s.attempts=Array.isArray(x.attempts)?x.attempts.filter(a=>Number.isInteger(a.step)&&typeof a.choice==='string'&&typeof a.correct==='boolean').slice(-250):[];s.current=Math.min(Number.isInteger(x.current)?Math.max(0,x.current):0,unlocked(s));s.completedAt=unlocked(s)===15&&typeof x.completedAt==='string'?x.completedAt:null;return s;}catch{return fresh()}}
window.TrialStoryModel={baseline,alpha,values,noisy,acts,steps,stats,fresh,ready,passed,unlocked,navigate,answer,correct,sample,restore,historyRecords,historyHistogram,standardMapping,generator,pair,deviations,convergence};
})();

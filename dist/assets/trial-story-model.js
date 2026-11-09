/* A gated, local classroom journey. All numerical results use the recorded plots. */
(()=>{'use strict';
const baseline=500,alpha=.05,values=[520,540,560,580],noisy=[490,530,570,610];
const acts=['历史收获','四个小区','均值的波动','标准化与概率','作出判断'];
const steps=[
 ['先看看往年的小区',0,'先别急着看这次试验。往年同类条件下的小区，收成各不相同。我们把这些亩产一笔笔汇总，再看看它们怎样分布。','history','这些小区的长期平均亩产为500，说明什么？',[
  ['exact','每个小区都收获500公斤'],['center','产量有高有低，长期平均为500公斤']], 'center','对，500是这批记录的中心。小区之间仍有高低差别；接下来，我们用这个长期平均水平作比较的基准。'],
 ['现在看我们的四个小区',1,'有了历史基准，再看2024级农资班的试验。四块独立小区采用同一种处理，每块算一次重复。我们逐块收获、称重，再折算亩产。'],
 ['这次试验平均收了多少？',1,'四张收获单都拿到了。我们先用一个平均值概括这次试验，再和历史上的500比较。','mean','四个小区合起来，平均亩产是多少？',[
  ['540','540公斤'],['550','550公斤'],['560','560公斤']], '550','对，平均亩产是550，比历史基准高50公斤。接下来要判断的是这个均值，而不是挑出产量最高的一块地。'],
 ['高出50，就算提高了吗？',1,'先把你的看法选出来。我们暂不下结论，等算出这种偏高有多罕见，再回来对照。','vote','这50公斤的差别，你现在怎样看？',[
  ['usual','可能属于通常波动'],['higher','可能已经显著提高'],['unsure','信息还不够']],null,'已保留初判。接下来用分布与概率检验它。'],
 ['单个小区与四次重复的均值',2,'蓝线描述历史单个小区的波动。现在先假设处理没有提高平均水平，四个独立小区仍来自均值为500的模型。反复做这样的试验，四个数的均值又会怎样分布？','reference','我们的550来自四次重复，应放到哪个分布里判断？',[
  ['individual','历史单个小区产量的分布'],['means','每次取四个小区，再算均值的分布']], 'means','对。一个蓝点表示一个小区；一个绿点表示一次四重复试验的均值。许多次这样的均值，才构成绿色的均值抽样分布。'],
 ['增加重复数，会怎样？',2,'如果每次试验从4个小区增加到16个，平均值会不会更稳定？我们把重复数改一改，同时看蓝色单个小区分布和绿色均值分布。','width','重复数增加后，更集中的绿色分布说明什么？',[
  ['narrow','均值的波动减小，估计更稳定、更精确'],['wide','单个小区之间的波动变大'],['same','均值不再波动，试验一定显著提高']], 'narrow','对，这就是对均值估计“更有把握”：独立重复增多，SE变小，估计通常更精确。它不保证显著增产；能否显著，还要看增幅相对误差有多大。'],
 ['求这块面积，为什么先标准化？',3,'550落在曲线右边。我们想知道它右侧的面积，也就是概率。过去靠积分表求面积，总不能为每个均值和标准误差都编一张表。怎样让它们共用一张表？','unit','完成换刻度与查表后，你认为标准化解决了什么问题？',[
  ['sd','只把产量数值变小，面积也跟着变小'],['se','化为标准正态，共用一张积分表，所求概率不变']], 'se','对。550先减500得到50，再除以标准误差20得到2.50。曲线换了刻度，同一块面积保留下来；我们就能从标准正态积分表读取它。'],
 ['标准误差不知道，怎么办？',3,'刚才先假定总体标准误差已知，所以能用标准正态表。现在回到这次试验的四张收获单：我们不知道这次试验总体的σ，σ/√4也就不知道。Z公式的分母该填什么？','estimate','只有四个小区的数据，可以怎样估计这个分母？',[
  ['s','直接用四个小区的标准差 s'],['sroot','先算样本标准差s，再用s/√4'],['mean','把平均亩产550填进去']], 'sroot','对，四个产量给出s≈25.82，估计标准误差为s/√4≈12.91。请留意：刚才的20是已知σ的演示设定，现在的12.91才是本次试验算出的估计。'],
 ['分母换成估计值，还能查原来的表吗？',3,'我们再做几次四重复模拟。每次都从四个数估计标准误差，看分母会不会一样。若分母本身也在变，求概率时就要把这份不确定性算进去。','distribution','用样本估计的s/√n作分母后，应查哪种分布？',[
  ['normal','仍查标准正态分布'],['student','查自由度n−1的t分布'],['uniform','查均匀分布']], 'student','对，Gosset以Student为笔名研究了这个问题。分母也要靠样本估计，T的尾部便更厚。原始产量仍按正态模型处理，改用t分布的是这个统计量。'],
 ['重复多了，t和正态还差多少？',3,'先看只有4次重复的t曲线，再把模拟重复数增加到30或100。我们固定同一位置，比较两条曲线右边的面积。','converge','随着独立重复增多，t分布会怎样变化？',[
  ['away','逐渐远离标准正态分布'],['toward','逐渐接近标准正态分布'],['fixed','形状始终不变']], 'toward','自由度df＝n−1。自由度增大，t分布逐渐接近标准正态分布。'],
 ['把高出的50公斤放到t曲线上',3,'现在回到我们的四个小区。均值高出50，估计标准误差约12.91；我们把50除以12.91，看看高出了几个估计标准误差。','statistic','50÷12.91，约为多少？',[
  ['1.94','1.94'],['3.87','3.87'],['50','50']], '3.87','t≈3.87，df＝4−1＝3。应放到t₃分布中判断。'],
 ['比这次还偏高的结果，在哪里？',3,'试验前我们问的是“是否提高”。现在从本次t≈3.87出发，把比它还偏高的结果也包括进来。我们该看哪一侧？','tail','哪块面积包含本次及更偏高的t统计量？',[
  ['left','左侧尾部'],['right','右侧尾部'],['middle','曲线中间']], 'right','右尾包含本次及更偏高的t统计量。点击计算，查看着色面积。'],
 ['这1.52%回答了什么？',3,'设想平均水平仍为500，我们一遍遍做四重复试验，每次都算一个t值。像本次这样达到3.87或更高的结果，在模型下约占1.52%。','meaning','这句话中的1.52%，指的是什么？',[
  ['null','平均水平仍为500的概率是1.52%'],['conditional','若均值仍为500且模型成立，得到这样或更偏高的T值的概率约1.52%'],['exact','恰好收获550公斤的概率是1.52%']], 'conditional','p值是在基准假设与模型成立时的尾部概率，不能解释成假设为真的概率。'],
 ['这种偏高，够不够少见？',4,'我们在看结果前约定：用0.05作判断界限。现在算出的p约为0.0152，小于这条界限。如果平均水平一直没变，这样的偏高确实不常见。你会怎样判断？','conclusion','按事先约定的规则，应该选择哪项结论？',[
  ['significant','在0.05水平下，相较历史基准显著提高'],['insufficient','尚未发现显著提高的证据'],['certain','已经证明提高绝不可能由波动造成']], 'significant','拒绝均值为500的基准假设，方向为偏高。统计判断仍保留误判风险。'],
 ['再看一组：均值相同就够了吗？',4,'我们换成490、530、570、610，均值仍是550。先看四个点散得有多开，再重新计算标准误差。高出的50，现在还算不算少见？','challenge','根据重新算出的概率，这次应怎样判断？',[
  ['same','均值相同，所以仍然显著提高'],['notyet','p＞0.05，尚未发现显著提高的证据'],['noeffect','已经证明处理没有效果']], 'notyet','分散程度变大，标准误差变大，t≈1.94、p≈0.074。同样高出50公斤，证据强弱会不同。'],
 ['完成这次判断',4,'回到试验田，查看你的初判与最后的判断。']
].map((r,id)=>({id,title:r[0],act:r[1],intro:r[2],key:r[3],question:r[4],options:r[5],correct:r[6],feedback:r[7]}));
function stats(v){if(!Array.isArray(v)||v.length<2||v.some(x=>!Number.isFinite(x)))throw Error('Invalid observations');const n=v.length,mean=v.reduce((s,x)=>s+x,0)/n,s=Math.sqrt(v.reduce((a,x)=>a+(x-mean)**2,0)/(n-1)),se=s/Math.sqrt(n);if(!(s>0))throw Error('Positive sample variation required');const t=(mean-baseline)/se,df=n-1,p=1-StudentTMath.cdf(t,df),critical=StudentTMath.quantile(1-alpha,df);return {n,mean,s,se,t,df,p,critical,significant:p<alpha};}
function fresh(){return {version:2,current:0,answers:{},attempts:[],e:{history:false,historyStage:0,harvest:[],nullModel:false,samples:[],sampleN:[4],standard:0,tableOpened:false,tableMatched:false,lookup:false,estimated:false,runs:[],dfN:[4],calculated:false,probability:false,noisy:false},completedAt:null};}
function correct(s,key){const step=steps.find(x=>x.key===key),v=s.answers[key];return !!step&&step.options.some(o=>o[0]===v)&&(step.correct===null||v===step.correct);}
function ready(s,i){const e=s.e;switch(i){case 0:return e.history===true&&e.historyStage===2;case 1:return [0,1,2,3].every(x=>e.harvest.includes(x));case 4:return e.nullModel===true&&e.samples.length>=3;case 5:return [1,4,16].every(n=>e.sampleN.includes(n));case 6:return e.standard===2&&e.tableOpened&&e.tableMatched&&e.lookup;case 7:return e.estimated===true;case 8:return e.runs.length>=3;case 9:return e.dfN.includes(4)&&e.dfN.some(n=>n>=30);case 10:return e.calculated===true;case 11:return e.probability===true;case 14:return e.noisy===true;case 15:return false;default:return true;}}
function passed(s,i){return ready(s,i)&&(!steps[i].key||correct(s,steps[i].key));}
function unlocked(s){let i=0;while(i<steps.length-1&&passed(s,i))i++;return i;}
function navigate(s,i){if(!Number.isInteger(i)||i<0||i>unlocked(s))return false;s.current=i;return true;}
function answer(s,key,value){const step=steps[s.current];if(step.key!==key||!step.options?.some(o=>o[0]===value)||(!ready(s,s.current)&&s.current!==11))return false;if(passed(s,s.current))return correct(s,key);s.answers[key]=value;s.attempts.push({step:s.current,choice:value,correct:step.correct===null||step.correct===value});s.attempts=s.attempts.slice(-250);return correct(s,key);}
function sample(n=4,random=Math.random){const v=Array.from({length:n},()=>baseline+40*NormalMath.gaussian(random));return {n,values:v,mean:v.reduce((a,b)=>a+b,0)/n};}
let historyCache;
function historyRecords(){if(!historyCache){let seed=78391;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return (seed+.5)/4294967296},raw=Array.from({length:120},()=>NormalMath.gaussian(random)),scale=40/Math.sqrt(raw.reduce((s,x)=>s+x*x,0)/raw.length);historyCache=raw.flatMap(x=>[500+x*scale,500-x*scale]);for(let i=historyCache.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[historyCache[i],historyCache[j]]=[historyCache[j],historyCache[i]];}}return historyCache.slice();}
function historyHistogram(){const records=historyRecords(),lo=340,hi=660,width=10,counts=Array(32).fill(0);let below=0,above=0;for(const value of records){if(value<lo)below++;else if(value>=hi)above++;else counts[Math.floor((value-lo)/width)]++;}return {records,lo,hi,width,counts,below,above,total:records.length};}
function standardMapping(phase){const p=Math.max(0,Math.min(2,phase)),center=500*(1-Math.min(1,p)),scale=p>1?20-19*(p-1):20;return {center,scale,cutoff:center+2.5*scale,z:2.5,between:NormalMath.cdf(2.5)-.5,right:1-NormalMath.cdf(2.5)};}
function restore(raw){try{const x=typeof raw==='string'?JSON.parse(raw):raw;if(x?.version!==2||!x.e||!x.answers)return fresh();const s=fresh(),e=x.e;for(const step of steps)if(step.key&&step.options.some(o=>o[0]===x.answers[step.key]))s.answers[step.key]=x.answers[step.key];
 s.e.history=e.history===true;s.e.historyStage=[0,1,2].includes(e.historyStage)?e.historyStage:0;s.e.harvest=Array.isArray(e.harvest)?[...new Set(e.harvest.filter(i=>Number.isInteger(i)&&i>=0&&i<4))]:[];
 const finite=a=>Array.isArray(a)&&a.length===4&&a.every(Number.isFinite);s.e.samples=Array.isArray(e.samples)?e.samples.filter(finite).slice(-200):[];s.e.runs=Array.isArray(e.runs)?e.runs.filter(finite).slice(-30):[];
 s.e.sampleN=Array.isArray(e.sampleN)?[...new Set(e.sampleN.filter(n=>[1,4,16].includes(n)))]:[4];s.e.dfN=Array.isArray(e.dfN)?[...new Set(e.dfN.filter(n=>Number.isInteger(n)&&n>=4&&n<=100))]:[4];s.e.standard=[0,1,2].includes(e.standard)?e.standard:0;
 for(const k of ['nullModel','tableOpened','tableMatched','lookup','estimated','calculated','probability','noisy'])s.e[k]=e[k]===true;s.attempts=Array.isArray(x.attempts)?x.attempts.filter(a=>Number.isInteger(a.step)&&typeof a.choice==='string'&&typeof a.correct==='boolean').slice(-250):[];s.current=Math.min(Number.isInteger(x.current)?Math.max(0,x.current):0,unlocked(s));s.completedAt=unlocked(s)===15&&typeof x.completedAt==='string'?x.completedAt:null;return s;}catch{return fresh()}}
window.TrialStoryModel={baseline,alpha,values,noisy,acts,steps,stats,fresh,ready,passed,unlocked,navigate,answer,correct,sample,restore,historyRecords,historyHistogram,standardMapping};
})();

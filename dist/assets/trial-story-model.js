/* A gated, local classroom journey. All numerical results use the recorded plots. */
(()=>{'use strict';
const baseline=500,alpha=.05,values=[520,540,560,580],noisy=[490,530,570,610];
const acts=['历史收获','四个小区','均值的波动','标准化与概率','作出判断'];
const steps=[
 ['历史留下的500',0,'展开历史记录，观察产量的中心与波动。','history','长期平均500公斤，意味着什么？',[
  ['exact','每个小区都收获500公斤'],['center','产量有高有低，长期平均为500公斤']], 'center','平均值表示中心；标准差表示分散程度。'],
 ['收获四个小区',1,'一个处理，四次独立重复。逐块收获并称重。'],
 ['找到平均值',1,'四张收获单，汇成一个平均值。','mean','四次重复的平均亩产是多少？',[
  ['540','540公斤'],['550','550公斤'],['560','560公斤']], '550','四个数相加再除以4，平均亩产为550公斤。'],
 ['留下你的初判',1,'比历史基准高出50公斤，先留下判断。','vote','这属于通常波动，还是显著提高？',[
  ['usual','可能属于通常波动'],['higher','可能已经显著提高'],['unsure','信息还不够']],null,'已保留初判。接下来用分布与概率检验它。'],
 ['亲手生成均值分布',2,'每次抽取四个产量，四个蓝点汇成一个绿色均值。','reference','本次550是四个小区的平均值，应与哪个分布比较？',[
  ['individual','单个小区产量的分布'],['means','四个小区平均产量的抽样分布']], 'means','平均值有自己的抽样分布。要判断均值，就看绿色分布。'],
 ['让重复数改变宽度',2,'分别查看1、4、16次重复，比较同一数轴上的两条曲线。','width','重复数增加，平均值的抽样分布通常怎样变化？',[
  ['narrow','更集中'],['wide','更分散'],['same','宽度不变']], 'narrow','SE＝σ/√n。n为4时宽度减半，n为16时变为原来的四分之一。'],
 ['把产量换成标准单位',3,'播放“减去基准、除以标准误差”的标准化过程。','unit','比较平均值时，应除以什么波动尺度？',[
  ['sd','单个小区产量的标准差 σ'],['se','平均值的标准误差 σ/√n']], 'se','已知σ时，Z＝(X̄−500)/(σ/√n)。在基准假设下服从N(0,1)。'],
 ['总体标准差未知',3,'用四个小区的样本标准差，估计平均值的标准误差。','estimate','总体σ未知，应怎样估计平均值的标准误差？',[
  ['s','直接使用 s'],['sroot','使用 s/√n'],['mean','使用平均值550']], 'sroot','s≈25.82，估计标准误差s/√4≈12.91公斤/亩。'],
 ['为什么需要t分布',3,'反复抽样，看看用样本估计的分母是否固定。','distribution','用每组样本的s/√n替换后，这个统计量使用什么分布？',[
  ['normal','标准正态分布'],['student','自由度n−1的t分布'],['uniform','均匀分布']], 'student','每次抽样的s都会变。额外的不确定性使T的尾部更厚；原始产量仍采用正态模型。'],
 ['拖动样本量，比较曲线',3,'至少比较n＝4和n≥30，观察自由度与两侧尾部。','converge','样本量增大，t分布会怎样变化？',[
  ['away','逐渐远离标准正态分布'],['toward','逐渐接近标准正态分布'],['fixed','形状始终不变']], 'toward','自由度df＝n−1。自由度增大，t分布逐渐接近标准正态分布。'],
 ['计算本次t值',3,'回到四个小区：高出的50公斤相当于几个估计标准误差？','statistic','50÷12.91，约为多少？',[
  ['1.94','1.94'],['3.87','3.87'],['50','50']], '3.87','t≈3.87，df＝4−1＝3。应放到t₃分布中判断。'],
 ['选择求概率的区域',3,'试验前约定只检验“是否提高”。在曲线上选择相应区域。','tail','本次应查看哪一部分尾部概率？',[
  ['left','左侧尾部'],['right','右侧尾部'],['middle','曲线中间']], 'right','右尾包含本次及更偏高的t统计量。点击计算，查看着色面积。'],
 ['读懂这1.52%',3,'概率已经算出，再确认它回答的是什么。','meaning','p≈0.0152，正确的理解是？',[
  ['null','平均水平仍为500的概率是1.52%'],['conditional','若均值仍为500且模型成立，得到这样或更偏高的T值的概率约1.52%'],['exact','恰好收获550公斤的概率是1.52%']], 'conditional','p值是在基准假设与模型成立时的尾部概率，不能解释成假设为真的概率。'],
 ['按事先约定的规则判断',4,'α＝0.05是试验前定下的规则。现在将p与α比较。','conclusion','p≈0.0152＜0.05，应作出什么判断？',[
  ['significant','在0.05水平下，相较历史基准显著提高'],['insufficient','尚未发现显著提高的证据'],['certain','已经证明提高绝不可能由波动造成']], 'significant','拒绝均值为500的基准假设，方向为偏高。统计判断仍保留误判风险。'],
 ['同样的550，结论也一样？',4,'换一组练习数据：490、530、570、610。均值仍为550。','challenge','重新计算后，这组练习数据应怎样判断？',[
  ['same','均值相同，所以仍然显著提高'],['notyet','p＞0.05，尚未发现显著提高的证据'],['noeffect','已经证明处理没有效果']], 'notyet','分散程度变大，标准误差变大，t≈1.94、p≈0.074。同样高出50公斤，证据强弱会不同。'],
 ['完成这次判断',4,'回到试验田，查看你的初判与最后的判断。']
].map((r,id)=>({id,title:r[0],act:r[1],intro:r[2],key:r[3],question:r[4],options:r[5],correct:r[6],feedback:r[7]}));
function stats(v){if(!Array.isArray(v)||v.length<2||v.some(x=>!Number.isFinite(x)))throw Error('Invalid observations');const n=v.length,mean=v.reduce((s,x)=>s+x,0)/n,s=Math.sqrt(v.reduce((a,x)=>a+(x-mean)**2,0)/(n-1)),se=s/Math.sqrt(n);if(!(s>0))throw Error('Positive sample variation required');const t=(mean-baseline)/se,df=n-1,p=1-StudentTMath.cdf(t,df),critical=StudentTMath.quantile(1-alpha,df);return {n,mean,s,se,t,df,p,critical,significant:p<alpha};}
function fresh(){return {version:1,current:0,answers:{},attempts:[],e:{history:false,harvest:[],samples:[],sampleN:[4],standard:0,estimated:false,runs:[],dfN:[4],calculated:false,probability:false,noisy:false},completedAt:null};}
function correct(s,key){const step=steps.find(x=>x.key===key),v=s.answers[key];return !!step&&step.options.some(o=>o[0]===v)&&(step.correct===null||v===step.correct);}
function ready(s,i){const e=s.e;switch(i){case 0:return e.history===true;case 1:return [0,1,2,3].every(x=>e.harvest.includes(x));case 4:return e.samples.length>=3;case 5:return [1,4,16].every(n=>e.sampleN.includes(n));case 6:return e.standard===2;case 7:return e.estimated===true;case 8:return e.runs.length>=3;case 9:return e.dfN.includes(4)&&e.dfN.some(n=>n>=30);case 10:return e.calculated===true;case 11:return e.probability===true;case 14:return e.noisy===true;case 15:return false;default:return true;}}
function passed(s,i){return ready(s,i)&&(!steps[i].key||correct(s,steps[i].key));}
function unlocked(s){let i=0;while(i<steps.length-1&&passed(s,i))i++;return i;}
function navigate(s,i){if(!Number.isInteger(i)||i<0||i>unlocked(s))return false;s.current=i;return true;}
function answer(s,key,value){const step=steps[s.current];if(step.key!==key||!step.options?.some(o=>o[0]===value)||(!ready(s,s.current)&&s.current!==11))return false;if(passed(s,s.current))return correct(s,key);s.answers[key]=value;s.attempts.push({step:s.current,choice:value,correct:step.correct===null||step.correct===value});s.attempts=s.attempts.slice(-250);return correct(s,key);}
function sample(n=4,random=Math.random){const v=Array.from({length:n},()=>baseline+40*NormalMath.gaussian(random));return {n,values:v,mean:v.reduce((a,b)=>a+b,0)/n};}
function restore(raw){try{const x=typeof raw==='string'?JSON.parse(raw):raw;if(x?.version!==1||!x.e||!x.answers)return fresh();const s=fresh(),e=x.e;s.answers=Object.fromEntries(steps.filter(x=>x.key&&x.options.some(o=>o[0]===safestr(xkey(x)))).map(x=>[x.key,safestr(xkey(x))]));function xkey(step){return x.answers[step.key]}function safestr(v){return typeof v==='string'?v:''}
 s.e.history=e.history===true;s.e.harvest=Array.isArray(e.harvest)?[...new Set(e.harvest.filter(i=>Number.isInteger(i)&&i>=0&&i<4))]:[];
 const finite=a=>Array.isArray(a)&&a.length===4&&a.every(Number.isFinite);s.e.samples=Array.isArray(e.samples)?e.samples.filter(finite).slice(-200):[];s.e.runs=Array.isArray(e.runs)?e.runs.filter(finite).slice(-30):[];
 s.e.sampleN=Array.isArray(e.sampleN)?[...new Set(e.sampleN.filter(n=>[1,4,16].includes(n)))]:[4];s.e.dfN=Array.isArray(e.dfN)?[...new Set(e.dfN.filter(n=>Number.isInteger(n)&&n>=4&&n<=100))]:[4];s.e.standard=[0,1,2].includes(e.standard)?e.standard:0;
 for(const k of ['estimated','calculated','probability','noisy'])s.e[k]=e[k]===true;s.attempts=Array.isArray(x.attempts)?x.attempts.filter(a=>Number.isInteger(a.step)&&typeof a.choice==='string'&&typeof a.correct==='boolean').slice(-250):[];s.current=Math.min(Number.isInteger(x.current)?Math.max(0,x.current):0,unlocked(s));s.completedAt=typeof x.completedAt==='string'?x.completedAt:null;return s;}catch{return fresh()}}
window.TrialStoryModel={baseline,alpha,values,noisy,acts,steps,stats,fresh,ready,passed,unlocked,navigate,answer,correct,sample,restore};
})();

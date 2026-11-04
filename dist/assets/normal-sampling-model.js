(function(root){
 'use strict';
 const M=root.NormalMath;
 function parameters(mu,sigma,n){
  if(!Number.isFinite(mu)||!Number.isFinite(sigma)||sigma<=0||!Number.isInteger(n)||n<1)throw Error('Invalid independent normal sample');
  return {mu,sigma,n,variance:sigma*sigma/n,se:sigma/Math.sqrt(n)};
 }
 function sample(mu,sigma,n,random=Math.random){
  parameters(mu,sigma,n);
  const values=Array.from({length:n},()=>mu+sigma*M.gaussian(random));
  return {values,mean:values.reduce((a,b)=>a+b,0)/n};
 }
 function summary(values){
  const count=values.length;if(!count)return {count,mean:null,sd:null};
  const mean=values.reduce((a,b)=>a+b,0)/count;
  return {count,mean,sd:count>1?Math.sqrt(values.reduce((s,x)=>s+(x-mean)**2,0)/(count-1)):null};
 }
 function histogram(values,lo,hi,bins=24){
  const width=(hi-lo)/bins,counts=Array(bins).fill(0);let below=0,above=0;
  for(const x of values){if(x<lo)below++;else if(x>=hi)above++;else counts[Math.floor((x-lo)/width)]++;}
  return {width,counts,below,above,densities:counts.map(c=>values.length?c/(values.length*width):0)};
 }
 function transform(mu,sigma,n,phase,z=1){
  const p=parameters(mu,sigma,n),center=Math.min(1,Math.max(0,phase)),scale=Math.min(1,Math.max(0,phase-1));
  return [sigma,p.se].map(sd=>{const divisor=sd**scale,mean=mu*(1-center),spread=sd/divisor;return {mean,sd:spread,divisor,value:mean+spread*z};});
 }
 const api={parameters,sample,summary,histogram,transform};root.NormalSamplingModel=api;
 if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);

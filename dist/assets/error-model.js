/* Known reference and bias are simulation parameters, not estimates of a real sample. */
(()=>{'use strict';
function rng(seed=73){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
function draws(n,seed=73,distribution='normal'){const r=rng(seed),out=[];for(let i=0;i<n;i++){let z;if(distribution==='uniform')z=(r()*2-1)*Math.sqrt(3);else if(distribution==='skew')z=-Math.log(Math.max(r(),1e-12))-1;else z=Math.sqrt(-2*Math.log(Math.max(r(),1e-12)))*Math.cos(2*Math.PI*r());out.push(z)}return out}
function samples({n=40,bias=3,sigma=1,reference=50,seed=73,distribution='normal'}={}){if(!Number.isInteger(n)||n<2||n>10000||!Number.isFinite(bias)||!(sigma>0)||!Number.isFinite(reference))throw Error('Invalid measurement parameters');return draws(n,seed,distribution).map(e=>({epsilon:sigma*e,value:reference+bias+sigma*e,error:bias+sigma*e}))}
// The reference is fixed for the SAME measurand: subtraction changes the origin,
// not the sample's ranks, frequencies, variance, or shape. It is not a correction.
function coordinates(a,reference){if(!Number.isFinite(reference))throw Error('Invalid fixed reference');return {observed:a.map(p=>p.value),error:a.map(p=>p.value-reference),random:a.map(p=>p.epsilon)}}
function impacts(a,{seed=73,distribution='normal',sigma=1}={}){const yy=draws(a.length,seed+137,distribution);return a.map((p,i)=>({index:i,...p,horizontal:p.error*.1,vertical:yy[i]*sigma*.17}))}
function summary(a){const n=a.length,mean=a.reduce((s,v)=>s+v,0)/n,sd=n>1?Math.sqrt(a.reduce((s,v)=>s+(v-mean)**2,0)/(n-1)):0;return {n,mean,sd,se:sd/Math.sqrt(n)}}
const se=(sigma,n)=>sigma/Math.sqrt(n),pdf=(x,mean,sigma)=>Math.exp(-.5*((x-mean)/sigma)**2)/(sigma*Math.sqrt(2*Math.PI));
function histogram(values,min,max,bins=24){const counts=Array(bins).fill(0),width=(max-min)/bins;for(const x of values){const j=Math.floor((x-min)/width);if(j>=0&&j<bins)counts[j]++;else if(x===max)counts[bins-1]++}return counts.map((count,i)=>({x:min+(i+.5)*width,count,density:count/(values.length*width)}))}
window.ErrorModel={rng,draws,samples,coordinates,impacts,summary,se,pdf,histogram};
})();

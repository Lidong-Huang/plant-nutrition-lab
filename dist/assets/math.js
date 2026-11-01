(function(root){
 'use strict';
 function pdf(x,mu=0,sigma=1){return Math.exp(-.5*((x-mu)/sigma)**2)/(sigma*Math.sqrt(2*Math.PI))}
 function cdf(x){const sign=x<0?-1:1,z=Math.abs(x)/Math.sqrt(2),t=1/(1+.3275911*z),p=((((1.061405429*t-1.453152027)*t+1.421413741)*t-.284496736)*t+.254829592)*t;return .5*(1+sign*(1-p*Math.exp(-z*z)))}
 function probability(lo,hi){return Math.max(0,Math.min(1,cdf(hi)-cdf(lo)))}
 function gaussian(random=Math.random){let u=0;while(u===0)u=random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*random())}
 function standardize(x,mu,sigma){if(!Number.isFinite(x)||!Number.isFinite(mu)||!Number.isFinite(sigma)||sigma<=0)throw Error('Invalid standardization');return (x-mu)/sigma}
 function midpoint(lo,hi,n=24){if(!Number.isFinite(lo)||!Number.isFinite(hi)||hi<lo||!Number.isInteger(n)||n<1||n>10000)throw Error('Invalid integral bounds');const width=(hi-lo)/n;let sum=0;const rectangles=Array.from({length:n},(_,i)=>{const left=lo+i*width,right=left+width,t=(left+right)/2,height=pdf(t),area=height*width;sum+=area;return {left,right,t,height,area,sum}});return {width,sum,rectangles}}
 const api={pdf,cdf,probability,gaussian,standardize,midpoint};root.NormalMath=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);

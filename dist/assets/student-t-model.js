/* Student t density/CDF and numerical inverse CDF. No fitted normal shortcut. */
(()=>{'use strict';
const lanczos=[.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7],normCache=new Map(),quantileCache=new Map();
function logGamma(z){if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);z-=1;let a=lanczos[0];for(let i=1;i<lanczos.length;i++)a+=lanczos[i]/(z+i);const t=z+7.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(a)}
function valid(df){if(!Number.isFinite(df)||df<=0)throw Error('Degrees of freedom must be positive')}
function logNorm(df){valid(df);if(!normCache.has(df)){if(normCache.size>1000)normCache.clear();normCache.set(df,logGamma((df+1)/2)-logGamma(df/2)-.5*Math.log(df*Math.PI))}return normCache.get(df)}
function pdf(x,df){const c=logNorm(df);return Math.exp(c-(df+1)/2*Math.log1p(x*x/df))}
function fraction(a,b,x){const tiny=1e-300,eps=3e-14;let c=1,d=1-(a+b)*x/(a+1);if(Math.abs(d)<tiny)d=tiny;d=1/d;let h=d;for(let m=1;m<=300;m++){const m2=2*m;let aa=m*(b-m)*x/((a+m2-1)*(a+m2));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;h*=d*c;aa=-(a+m)*(a+b+m)*x/((a+m2)*(a+m2+1));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;const delta=d*c;h*=delta;if(Math.abs(delta-1)<eps)return h}throw Error('Incomplete beta did not converge')}
function beta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const front=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));return x<(a+1)/(a+b+2)?front*fraction(a,b,x)/a:1-front*fraction(b,a,1-x)/b}
function cdf(x,df){valid(df);if(x===Infinity)return 1;if(x===-Infinity)return 0;if(x===0)return .5;const tail=.5*beta(df/(df+x*x),df/2,.5);return x>0?1-tail:tail}
function quantile(p,df){valid(df);if(!(p>=0&&p<=1))throw Error('Invalid probability');if(p===0)return -Infinity;if(p===1)return Infinity;if(p===.5)return 0;if(p<.5)return -quantile(1-p,df);const key=p+':'+df;if(quantileCache.has(key))return quantileCache.get(key);let lo=0,hi=1;while(cdf(hi,df)<p&&hi<1e14)hi*=2;for(let i=0;i<64;i++){const mid=(lo+hi)/2;if(cdf(mid,df)<p)lo=mid;else hi=mid}const value=(lo+hi)/2;if(quantileCache.size>1000)quantileCache.clear();quantileCache.set(key,value);return value}
const Z975=1.959963984540054;
function comparison(n){if(!Number.isInteger(n)||n<2||n>10000)throw Error('Invalid sample size');const df=n-1,c=quantile(.975,df);return {n,df,critical:c,normalCritical:Z975,leftTail:cdf(-c,df),rightTail:1-cdf(c,df),central:cdf(c,df)-cdf(-c,df),tailAtNormal:2*(1-cdf(Z975,df)),width:2*c,normalWidth:2*Z975}}
window.StudentTMath={pdf,cdf,quantile,comparison,logGamma,Z975};
})();

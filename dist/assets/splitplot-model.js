/* Balanced RCBD split-plot model. Water is randomized to whole plots;
   fertilizer is randomized independently within each whole plot. */
(()=>{'use strict';
function shuffle(a,random=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function seeded(seed=731){return()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296}}
function design(r=3,random=seeded()){if(!Number.isInteger(r)||r<2)throw Error('At least two blocks are needed');return Array.from({length:r},(_,block)=>({block,water:shuffle([0,1],random),fertilizer:[shuffle([0,1,2],random),shuffle([0,1,2],random)]}))}
function randomizeMain(design,random=Math.random){return design.map(d=>({...d,water:shuffle([0,1],random),fertilizer:d.fertilizer.map(a=>[...a])}))}
function randomizeSub(design,random=Math.random){return design.map(d=>({...d,water:[...d.water],fertilizer:[shuffle([0,1,2],random),shuffle([0,1,2],random)]}))}
function observations(r=3){const blockEffect=[-3,2,1,-1,3],wholeError=[[-2,1],[3,-1],[-1,2],[1,-2],[2,-3]],residual=[[-1.2,.3,.9],[.4,-.9,.5],[.8,.6,-1.4]];const out=[];for(let block=0;block<r;block++)for(let water=0;water<2;water++)for(let fertilizer=0;fertilizer<3;fertilizer++){const value=50+blockEffect[block]+water*10+fertilizer*7+water*fertilizer*4+wholeError[block][water]+residual[(block+water)%3][fertilizer]*(water?1.2:1);out.push({block,water,fertilizer,value})}return out}
function anova(data){const blocks=[...new Set(data.map(d=>d.block))],r=blocks.length,a=2,b=3;if(r<2||data.length!==r*a*b)throw Error('A balanced 2 by 3 design is required');const keys=new Set;for(const d of data){if(!blocks.includes(d.block)||![0,1].includes(d.water)||![0,1,2].includes(d.fertilizer)||!Number.isFinite(d.value))throw Error('Invalid observation');const key=`${d.block}:${d.water}:${d.fertilizer}`;if(keys.has(key))throw Error('Duplicate subplot');keys.add(key)}
 const sum=xs=>xs.reduce((s,d)=>s+d.value,0),G=sum(data),CF=G*G/data.length,total=data.reduce((s,d)=>s+d.value*d.value,0)-CF;
 const blockSS=blocks.reduce((s,i)=>s+sum(data.filter(d=>d.block===i))**2/(a*b),0)-CF;
 const waterSS=[0,1].reduce((s,j)=>s+sum(data.filter(d=>d.water===j))**2/(r*b),0)-CF;
 const wholeSS=blocks.reduce((s,i)=>s+[0,1].reduce((q,j)=>q+sum(data.filter(d=>d.block===i&&d.water===j))**2/b,0),0)-CF;
 const errorASS=wholeSS-blockSS-waterSS;
 const fertilizerSS=[0,1,2].reduce((s,k)=>s+sum(data.filter(d=>d.fertilizer===k))**2/(r*a),0)-CF;
 const combinationSS=[0,1].reduce((s,j)=>s+[0,1,2].reduce((q,k)=>q+sum(data.filter(d=>d.water===j&&d.fertilizer===k))**2/r,0),0)-CF;
 const interactionSS=combinationSS-waterSS-fertilizerSS,errorBSS=total-blockSS-waterSS-errorASS-fertilizerSS-interactionSS;
 const row=(id,label,ss,df,denominator=null)=>({id,label,ss:Math.max(0,ss),df,ms:Math.max(0,ss)/df,denominator});
 const rows=[row('block','区组',blockSS,r-1),row('water','灌水 A',waterSS,a-1,'ea'),row('ea','主区误差 Eₐ',errorASS,(r-1)*(a-1)),row('fertilizer','施肥 B',fertilizerSS,b-1,'eb'),row('interaction','A × B',interactionSS,(a-1)*(b-1),'eb'),row('eb','副区误差 Eᵦ',errorBSS,a*(r-1)*(b-1))];
 for(const x of rows)if(x.denominator){const den=rows.find(v=>v.id===x.denominator);x.f=den.ms>0?x.ms/den.ms:null}
 return {r,a,b,n:data.length,wholePlots:r*a,rows,total:{ss:total,df:data.length-1},means:[0,1].map(w=>[0,1,2].map(f=>sum(data.filter(d=>d.water===w&&d.fertilizer===f))/r))}
}
window.SplitPlotModel={design,randomizeMain,randomizeSub,observations,anova,seeded,shuffle};
})();

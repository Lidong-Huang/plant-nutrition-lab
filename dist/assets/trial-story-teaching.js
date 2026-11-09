/* Historical fields -> individual records -> observed histogram; one area -> a shared table. */
(()=>{'use strict';const M=TrialStoryModel,H=M.historyHistogram(),clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t;
function history(w,v){w.extent=25;w.target=w.width<600?3.8:.2;w.ground(23.8,15);w.road(0,6.8,23.2,.7);w.road(-11.2,0,.6,13.4);FieldAssets.channel(w,[[-10.6,0,-6.7],[10.8,0,-6.7]],.19);FieldAssets.tractor(w,-7,6.8);
 for(let r=0;r<6;r++)for(let c=0;c<8;c++){const id=r*8+c,x=(c-3.5)*2.55,z=(r-2.5)*2.08;w.box(x,.02,z,2.25,.055,1.78,id%3?'#a8b182':'#a0ad7b');for(let j=0;j<2;j++)MaizeShoot.draw(w,{x:x-.43+j*.86,y:.08,z,height:.67+(id%4)*.025,stage:'mature',seed:id+j,detail:'low'});if(id%7===0)w.label([x,.12,z+.65],`${Math.round(H.records[id])}`,{size:w.width<600?9:11,pill:true,color:'#72805b'});}
 if(w.width>=600)w.label([0,.12,7.5],'往年、同类条件下的大量小区',{size:12,pill:true});w.canvas.dataset.historicalPlotCount='48';w.canvas.dataset.fieldFacilities='historical-fields-roads-irrigation-tractor';
}
function paintHistory(w,v){if(v.historyVisual<=0)return;const c=w.ctx,mobile=w.width<600,cw=Math.min(w.width-34,mobile?420:710),ch=mobile?200:304,x=(w.width-cw)/2,y=mobile?166:203,p=v.historyVisual;
 c.save();c.fillStyle='#fffdf1f5';c.shadowColor='#536b4028';c.shadowBlur=18;c.beginPath();c.roundRect(x,y,cw,ch,12);c.fill();c.shadowBlur=0;c.strokeStyle='#dce4cd';c.stroke();c.font=`${mobile?10:12}px Microsoft YaHei,sans-serif`;c.fillStyle='#607951';c.textAlign='left';c.fillText(p<1.001?'逐笔汇总：每个数来自一个历史小区':'把同一产量段的记录放到一起',x+16,y+25);c.textAlign='right';c.fillText(`${Math.round(H.total*Math.min(1,p))} 个小区`,x+cw-16,y+46);
 const cols=mobile?6:10,rows=mobile?5:7,visible=cols*rows,left=x+19,right=x+cw-19,top=y+57,base=y+ch-34,h=ch-103,cellW=(right-left)/cols,cellH=h/rows,f=clamp(p-1),count=Math.max(1,Math.round(Math.min(1,p)*H.total)),offset=Math.max(0,count-visible),rank=Array(H.counts.length).fill(0),maxCount=Math.max(...H.counts),plotX=value=>left+(value-H.lo)/(H.hi-H.lo)*(right-left);
 const starts=new Map();for(let i=0;i<count;i++){const at=i-offset;if(at>=0)starts.set(i,{x:left+(at%cols+.5)*cellW,y:top+(Math.floor(at/cols)+.55)*cellH});}
 if(p<1.001){for(const [i,pos] of starts){c.fillStyle='#eef1e2';c.beginPath();c.roundRect(pos.x-cellW*.43,pos.y-cellH*.39,cellW*.86,cellH*.8,3);c.fill();c.fillStyle='#758269';c.font=`${mobile?10:13}px Georgia,serif`;c.textAlign='center';c.fillText(H.records[i].toFixed(0),pos.x,pos.y+4);}}
 else{for(let i=0;i<H.total;i++){const value=H.records[i],bin=Math.floor((value-H.lo)/H.width);if(bin<0||bin>=H.counts.length)continue;const level=rank[bin]++,target={x:plotX(H.lo+(bin+.5)*H.width),y:base-(level+.55)/maxCount*h},source=starts.get(i)||{x:left+(i%cols+.5)*cellW,y:top+((Math.floor(i/cols)%rows)+.55)*cellH};c.fillStyle='#97b295';c.globalAlpha=1;c.beginPath();c.arc(mix(source.x,target.x,f),mix(source.y,target.y,f),mobile?1.8:2.4,0,7);c.fill();}
  if(f>.55){c.globalAlpha=(f-.55)/.45;for(let j=0;j<H.counts.length;j++){const bw=(right-left)/H.counts.length,height=H.counts[j]/maxCount*h;c.fillStyle=j===16?'#789f7d':'#b1c5a7';c.fillRect(left+j*bw+1,base-height,bw-2,height);}c.beginPath();for(let i=0;i<=160;i++){const value=H.lo+(H.hi-H.lo)*i/160,yy=base-NormalMath.pdf(value,500,40)*H.total*H.width/maxCount*h;i?c.lineTo(plotX(value),yy):c.moveTo(plotX(value),yy);}c.strokeStyle='#7496a9';c.lineWidth=1.8;c.stroke();}
 }
 c.globalAlpha=1;if(p>1){c.strokeStyle='#bac8aa';c.beginPath();c.moveTo(left,base);c.lineTo(right,base);c.stroke();c.font=`${mobile?9:11}px Georgia,serif`;c.fillStyle='#819171';c.textAlign='center';for(const value of [380,440,500,560,620])c.fillText(String(value),plotX(value),base+19);}
 c.font=`${mobile?9:11}px Microsoft YaHei,sans-serif`;c.textAlign='left';c.fillStyle='#8b987c';c.fillText(p<1.001?'收获记录越来越多，先保留每一笔产量。':'柱高＝相应产量段的小区数',x+16,p<1.001?y+ch-10:y+46);c.restore();
 w.canvas.dataset.historyPhase=p<1.001?'records':'histogram';w.canvas.dataset.historyCount=String(count);w.canvas.dataset.historyHistogramCount=String(H.counts.reduce((a,b)=>a+b,0));
}
function paintStandard(w,v){const c=w.ctx,mobile=w.width<600,map=M.standardMapping(v.standardVisual),cw=Math.min(w.width-38,mobile?410:700),x=(w.width-cw)/2,y=w.height-(mobile?145:174);
 c.save();c.fillStyle='#fffcedeb';c.strokeStyle='#dfe3cb';c.beginPath();c.roundRect(x,y,cw,mobile?53:67,8);c.fill();c.stroke();c.textAlign='center';c.fillStyle='#6a8057';c.font=`${mobile?11:15}px Georgia,Microsoft YaHei,serif`;
 const label=v.standardVisual<.99?'P(X̄ ≥ 550) = ∫₅₅₀^∞ fX̄(x) dx':v.standardVisual<1.99?'P(X̄ − 500 ≥ 50) = 同一块右尾面积':'P(Z ≥ 2.50) = ∫₂.₅₀^∞ φ(z) dz';c.fillText(label,x+cw/2,y+(mobile?21:27));c.font=`${mobile?9:11}px Microsoft YaHei,sans-serif`;c.fillStyle='#9d8351';c.fillText(v.session.e.lookup?'表中0到2.50面积0.4938 → 右尾0.5−0.4938＝0.0062':'刻度可以换，着色部分所代表的概率保持不变。',x+cw/2,y+(mobile?41:50));c.restore();
 w.canvas.dataset.standardTail=String(map.right);w.canvas.dataset.standardCutoff=String(map.cutoff);w.canvas.dataset.lookupZ='2.50';
}
function paint(w,v){if(v.step===0)paintHistory(w,v);if(v.step===6)paintStandard(w,v);}
window.TrialStoryTeaching={history,paint};
})();

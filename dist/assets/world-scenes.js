/* Five independent teaching worlds, built from rotatable geometry. */
(()=>{'use strict';
const palette={N:'#d7b658',P:'#7ba9b8',K:'#b38a76',Ca:'#9fb47e',Mg:'#a6b6ba',S:'#d1c59a'},lerp=PlantWorld.lerp;
function fence(w,x,z,length,along='x'){for(let i=0;i<=length;i+=.6){let xx=x+(along==='x'?i:0),zz=z+(along==='z'?i:0);w.box(xx,0,zz,.045,.4,.045,'#d6c9a7')}let a=[x,.28,z],b=[x+(along==='x'?length:0),.28,z+(along==='z'?length:0)];w.line([a,b],'#c0b391',2)}
function pipe(w,pts,color){w.line(pts,'#c7cebd',7);w.line(pts,'#eff1dd',3);w.stream(pts,color,{count:7,speed:.13,size:.045})}
function rootWorld(w,s){const step=s.step;
 w.box(0,-2.2,0,9,.2,6,'#c2c5ad');
 // Leave the near half open, so the root system is actually visible in section.
 w.box(0,-1.9,1.25,6.3,1.9,2.1,'#baab82');w.box(3.3,-1.9,0,.3,1.9,4.6,'#c9b894');w.box(-3.3,-1.9,0,.3,1.9,4.6,'#c9b894');
 w.box(0,.01,1.25,6.35,.07,2.14,'#a8bd7e');w.box(0,-1.88,-.85,6.3,.05,2.1,'#b8d4cf',{alpha:.85});
 for(let i=0;i<30;i++){let x=-2.9+(i*1.713)%5.8,y=-1.75+(i*.317)%1.45,z=-1.6+(i*.413)%1.4;w.dot([x,y,z],.026+i%3*.012,['#c6b789','#d9cbad','#a79772'][i%3])}
 w.plant(0,0,0,3,0,{roots:true});for(let j=0;j<5;j++){let a=j/5*Math.PI*2,root=[[0,0,0],[Math.cos(a)*.5,-.6,Math.sin(a)*.38],[Math.cos(a)*1.3,-1.6,Math.sin(a)*.7-.3]];w.line(root,'#e9d8ad',2.4);for(let i=0;i<4;i++){const p=w.pathPoint(root,.3+i*.16);w.line([p,[p[0]-.23,p[1]-.22,p[2]-.24]],'#efe1bd',1)}}
 for(let i=0;i<15;i++){let a=w.time*.2+i*2.4,x=Math.cos(a)*2.5,z=-1+Math.sin(a*.7)*.6,y=-1.2+Math.sin(a*.9)*.38;w.dot([x,y,z],.055,[palette.N,palette.P,palette.K][i%3],{glow:true})}
 if(step>=1){w.stream([[-2.8,-1.1,-1],[ -1.5,-.8,-.6],[-.55,-.6,-.1]],palette.N,{count:12,speed:.12});w.stream([[2.6,-1.3,-1],[1.4,-.9,-.5],[.43,-.65,-.1]],palette.P,{count:10,speed:.1,phase:.3})}
 if(step>=2){w.stream([[-.55,-.6,-.1],[-.15,-.5,0],[0,-.2,0]],palette.N,{count:6,speed:.2});w.label([-.65,-.6,0],'跨膜吸收',{dx:-65,dy:3,leader:true,pill:true,size:12});
 // A magnified, spatial membrane gate, kept beside the biological path.
 w.cylinder(2.2,.25,-.4,.5,.12,'#c5d2a3',{n:18});w.cylinder(2.2,.37,-.4,.4,.1,'#e1e5bc',{n:18});w.box(2.2,.48,-.4,.15,.27,.15,'#7aa5a9');w.stream([[2.2,1.38,-.4],[2.2,.7,-.4],[2.2,.15,-.4]],palette.N,{count:5,speed:.2});w.label([2.2,.25,-.4],'转运蛋白 · 放大示意',{dy:30,size:11,pill:true})}
 if(step>=3){w.stream([[0,-.4,0],[.02,.7,0],[.03,1.6,0],[.04,2.7,0]],palette.P,{count:18,speed:.13,size:.06});w.stream([[.03,1.4,0],[.55,1.6,-.15],[1.12,1.9,-.2]],palette.N,{count:5,speed:.12});w.label([.05,2.2,0],'木质部 ↑',{dx:-70,dy:-8,leader:true,pill:true})}
 w.label([-2.4,-1.6,-1.7],'土壤溶液',{dy:20,size:12});w.label([0,-.12,0],'根表',{dx:-43,dy:-6,size:11,pill:true});w.label([-1.3,2.9,-.4],'叶片',{dx:-20,dy:-15,size:12});
 w.label([1.8,-1.7,-1.5],'NO₃⁻ · NH₄⁺ · K⁺',{dy:27,size:12,color:'#8b7950'});
}
function barrelWorld(w,s){let vals=[s.values.n,s.values.p,s.values.k,90,85,95],names=['N','P','K','Ca','Mg','S'],min=Math.min(...vals),limit=vals.indexOf(min),r=1.65,base=.2;
 w.ground(10,7);w.road(0,2.75,10,.55);w.tree(-4,-2.5,1.5);w.tree(4,2.2,1.35);
 // Six staves form a complete round barrel, each with an independent height.
 for(let i=0;i<6;i++){let a=i*Math.PI/3-.3,b=a+Math.PI/3-.035,h=.45+vals[i]*.034;let pa=[Math.cos(a)*r,base,Math.sin(a)*r],pb=[Math.cos(b)*r,base,Math.sin(b)*r];w.poly([pa,pb,[pb[0],h,pb[2]],[pa[0],h,pa[2]]],i===limit?'#b99a67':'#bfad82',{line:'#e8ddbd'});let mid=(a+b)/2;w.label([Math.cos(mid)*r,h+.17,Math.sin(mid)*r],names[i],{size:15,color:palette[names[i]]});if(s.step>=1&&i===limit)w.label([Math.cos(mid)*r,h,Math.sin(mid)*r],`限制养分 ${names[i]}`,{dy:-35,pill:true,color:'#997233',leader:true,size:12})}
 const water=.45+min*.034;
 w.cylinder(0,base,0,r*.98,water-base,'#8bbcc3',{alpha:.48,n:30});for(let hoop of [.53,1.05]){let pts=[];for(let i=0;i<=40;i++){let a=i/40*Math.PI*2;pts.push([Math.cos(a)*(r+.015),hoop,Math.sin(a)*(r+.015)])}w.line(pts,'#7f8465',3)}
 for(let k=0;k<3;k++){let rr=.35+((w.time*.3+k*.4)%1)*1.1,pts=[];for(let i=0;i<=36;i++){let a=i/36*Math.PI*2;pts.push([Math.cos(a)*rr,water+.018,Math.sin(a)*rr])}w.line(pts,'#d1ebdf',.7,{alpha:.5})}
 pipe(w,[[-3.3,.1,-.2],[-3.3,4.1,-.2],[-.5,4.1,-.2],[-.5,water+.08,-.2]],'#9ec9cc');
 let a=limit*Math.PI/3+.2;w.stream([[Math.cos(a)*1.62,water,Math.sin(a)*1.62],[Math.cos(a)*2.2,water-.4,Math.sin(a)*2.2],[Math.cos(a)*2.45,.07,Math.sin(a)*2.45]],'#8bbcc3',{count:10,speed:.22,size:.04});
 const plantHeight=.8+min/100*2.5;w.cylinder(3.1,.02,-.65,.7,.65,'#c3ad85');w.cylinder(3.1,.67,-.65,.61,.03,'#988562');w.plant(3.1,.7,-.65,plantHeight,1);
 w.label([0,water,0],`${Math.round(min)}%`,{size:26,color:'#315f65',pill:true});w.label([3.1,.3,-.65],'相对生长潜力',{dy:30,size:11});w.label([-3.35,3,-.2],'养分满足度',{dx:-28,dy:-8,size:11});
}
function nitrogenWorld(w,s){const step=s.step;w.box(0,-1.8,0,11,1.8,6.3,'#bcad88');w.box(0,.01,1.3,11,.08,3.7,'#b3c68e');w.box(0,-1.7,-1.3,11,.08,3.2,'#a9c7bd');w.road(0,2.7,11,.6);w.tree(-4.5,2,1.8);w.tree(4.7,2,1.4);w.plant(3.1,.08,.15,2.65,3,{roots:true});w.plant(4.15,.08,1.1,1.9,5);let pos=[[-3.5,-.58,-.9],[0,-.58,-.9],[3,-.58,-.9]],names=['有机氮','NH₄⁺','NO₃⁻'],colors=['#a7aa6c',palette.N,palette.P];
 for(let j=0;j<3;j++){const [x,y,z]=pos[j];w.cylinder(x,y-.25,z,.65,.45,colors[j],{alpha:.55,n:20});w.label([x,y+.15,z],names[j],{dy:-9,pill:true,size:15,color:j===0?'#73784a':j===1?'#9a792b':'#477d8b'});for(let i=0;i<7;i++){let a=i*1.17+w.time*.22;w.dot([x+Math.cos(a)*.4,y+.15+Math.sin(a*1.3)*.15,z+Math.sin(a)*.4],.045,colors[j],{glow:true})}}
 for(let i=0;i<5;i++){let x=-4+i*.23;w.leaf([x,.04,-.4],[x+.35,.15,.04],.13,'#b1a16e')}
 if(step>=1){w.stream([[-3.4,-.4,-.9],[-2,-.15,-1],[0,-.4,-.9]],palette.N,{count:14,speed:.1});w.label([-1.8,-.1,-1],'矿化',{dy:-14,size:12,pill:true})}
 if(step>=2){w.stream([[0,-.4,-.9],[1.5,-.2,-.9],[3,-.4,-.9]],palette.P,{count:14,speed:.12});w.label([1.5,-.2,-.9],'硝化 · 经 NO₂⁻',{dy:32,size:11,pill:true});w.stream([[-.1,2.1,-1],[0,.8,-1],[0,-.1,-1]],'#bdcfda',{count:4,speed:.1,size:.035});w.label([0,1.7,-1],'O₂',{dx:-24,size:12,color:'#8b9c9d'})}
 if(step>=3){w.stream([[3,-.5,-.9],[3.05,.05,0],[3.1,1.5,0],[3.1,2.5,0]],'#92ba71',{count:15,speed:.12});w.stream([[.15,-.5,-.9],[1.7,-.7,-.6],[3.05,-.1,0]],palette.N,{count:7,speed:.08});w.stream([[3,-.6,-.9],[3.4,-1.2,-1.3],[4.7,-1.65,-2]],palette.P,{count:10,speed:.15});w.label([4.6,-1.7,-2],'淋失 ↓',{dy:27,size:12,color:'#4e8293',pill:true});w.stream([[3,-.4,-.9],[4.9,.2,-.9],[5,1.7,-.8],[4.5,3.2,-.8]],'#a9b7a7',{count:7,speed:.12,size:.06});w.label([4.9,2,-.8],'N₂ / N₂O ↑',{dx:20,pill:true,size:11});w.label([3.1,1.3,0],'吸收 ↑',{dx:-45,dy:-5,pill:true,size:12})}
 w.label([-4.7,-1.75,-2.5],'土壤剖面',{dy:25,size:11});w.label([-3.8,.2,-.3],'植物残体',{dy:-22,size:11});
}
function fieldEnvironment(w,s){FieldAssets.environment(w);for(let r=0;r<3;r++){const z=-2.35+r*2.28;FieldAssets.pipe(w,[[-6.4,.12,-4.9],[-6.4,.12,z-1.05],[4.9,.12,z-1.05]],{active:true});FieldAssets.channel(w,[[5.0,0,z+.9],[5.12,0,z+1.08],[7.12,0,z+1.08]],.13,{drain:true});} }
function blocksWorld(w,s){fieldEnvironment(w,s);const step=s.step,rows=s.rows||[[0,1,2,3],[2,0,3,1],[1,3,0,2]],cols=['#a8bf79','#d6bf76','#90b7b7','#bc9c7b'],names=['CK','N','P','NP'];
 for(let r=0;r<3;r++){let z=-2.35+r*2.28;for(let c=0;c<4;c++){let idx=c,x=-3.75+s.positions[r][idx]*2.5,base=1-r*.12;w.box(x,.02,z,2.1,.12,1.8,PlantWorld.shade(cols[idx],base));FieldAssets.pipe(w,[[x,.12,z-1.05],[x,.12,z-.91]],{active:true});FieldAssets.gate(w,x,z-.94);for(const zz of [z-.92,z+.92])w.box(x,.13,zz,2.13,.065,.055,'#c1ad81');for(const xx of [x-1.07,x+1.07])w.box(xx,.13,z,.055,.065,1.88,'#c1ad81');for(let j=0;j<3;j++)w.line([[x-.8,.15,z-.57+j*.57],[x+.8,.15,z-.57+j*.57]],'#a28d62',.65);for(let j=0;j<4;j++)for(let k=0;k<3;k++){let h=.45+base*.2+Math.sin(j*3+k+r)*.06;FieldAssets.maize(w,x-.72+j*.48,.15,z-.55+k*.53,h*1.3,j+k+r)}if(step>=2){w.box(x-.82,.15,z-.9,.03,.38,.03,'#9f9070');w.label([x-.82,.62,z-.9],names[idx],{size:11,pill:true,color:'#496844'})}}
 if(step>=1){const outline=[[-4.97,.2,z-1.02],[4.97,.2,z-1.02],[4.97,.2,z+1.02],[-4.97,.2,z+1.02],[-4.97,.2,z-1.02]];w.line(outline,['#7b9672','#96a271','#aea273'][r],2,{dash:[6,4]});w.label([5.35,.2,z],`区组 ${['I','II','III'][r]}`,{size:12,pill:true})}}
 w.arrow([-5.18,.2,-2.5],[-5.18,.2,2.8],'#81885f');w.label([-5.18,.2,-2.9],'肥力高',{dy:-20,size:12});w.label([-5.18,.2,3.0],'肥力低',{dy:20,size:12});
 if(step===0){for(let i=0;i<20;i++){let t=(w.time*.11+i/20)%1;w.dot([-4.8+t*9.6,.2+Math.sin(t*7)*.02,-2.1],.04,'#e3cb76',{alpha:.55})}}
 
}
function interactionWorld(w,s){w.ground(12.5,9.3);w.road(-5.55,0,.6,9);w.road(0,3.9,12.2,.55);w.tree(-5,-3.3,1.2);w.tree(-5,3.3,1.3);const gamma=s.values.effect,values=[20,40,35,55+gamma],locations=[[-3,-1.7],[-.5,-1.7],[-3,1.35],[-.5,1.35]],labels=['N₀P₀','N₁P₀','N₀P₁','N₁P₁'];
 locations.forEach(([x,z],i)=>{w.box(x,.03,z,2,.16,2.15,'#c3b17c');for(let j=0;j<3;j++)for(let k=0;k<3;k++)w.plant(x-.65+j*.65,.19,z-.7+k*.65,.45+values[i]/65,j+k,{color:i<2?'#9caa62':'#7eaa68'});w.label([x,.25,z-1.1],labels[i],{dy:-8,size:12,pill:true,color:i<2?'#9c7e3f':'#467e8a'});if(s.step>=1)w.label([x,1.7,z],Math.round(values[i]).toString(),{dy:-20,size:17,color:i<2?'#9b7940':'#467a87',pill:true});if(s.step>=2&&i===3){w.stream([[x-1.1,.2,z],[x-.8,.5,z],[x,.8,z]],palette.N,{count:5,speed:.13});w.stream([[x+1.1,.2,z],[x+.8,.5,z],[x,.8,z]],palette.P,{count:5,speed:.13,phase:.3})}});
 // The response graph occupies a separate spatial plane beside the crop plots.
 const gx=2.0,gz=.6,X=v=>gx+v*2.4,Y=v=>.4+v*.043;w.box(3.2,.03,.6,3.2,.15,3.6,'#d5ddc6');w.arrow([gx,.3,gz],[gx,4.15,gz]);w.arrow([gx,.3,gz],[gx+2.9,.3,gz]);for(let val=20;val<=80;val+=20){w.line([[gx,Y(val),gz],[gx+2.4,Y(val),gz]],'#c5d2bd',.7);w.label([gx-.2,Y(val),gz],val.toString(),{size:9})}
 [[0,1,'#c29a45'],[2,3,'#609bad']].forEach(([a,b,c])=>{let pa=[X(0),Y(values[a]),gz],pb=[X(1),Y(values[b]),gz];w.line([pa,pb],c,3);w.dot(pa,.055,c);w.dot(pb,.055,c);w.stream([pa,pb],c,{count:4,speed:.12,size:.035,trail:false})});w.label([gx,-.05,gz],'N₀',{size:12});w.label([gx+2.4,-.05,gz],'N₁',{size:12});w.label([gx+1.2,4.5,gz],'响应值 · 模拟',{size:11,pill:true});w.label([gx+2.35,3.9,gz],'P₁',{color:'#609bad',size:12});w.label([gx+.4,1.45,gz],'P₀',{color:'#a5833c',size:12});if(s.step===3)w.label([gx+1.2,.3,-1.4],`交互对比 = ${Math.round(gamma)}`,{dy:24,size:13,pill:true});
}
window.TeachingWorlds={uptake:rootWorld,minimum:barrelWorld,nitrogen:nitrogenWorld,blocks:blocksWorld,interaction:interactionWorld};
window.TeachingModels={minimum(v){const values=[v.n,v.p,v.k,90,85,95];return {value:Math.min(...values),limiter:['N','P','K','Ca','Mg','S'][values.indexOf(Math.min(...values))]}},interaction(effect){return {means:[20,40,35,55+effect],contrast:effect}},shuffle(values,random=Math.random){const a=[...values];for(let i=a.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}};
})();




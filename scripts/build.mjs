import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist'),read=p=>fs.readFileSync(path.join(dist,p),'utf8');
const asset=p=>p+'?v='+createHash('sha256').update(read(p)).digest('hex').slice(0,10);
const catalog=JSON.parse(read('catalog.json'));
const write=(p,s)=>{const dest=path.join(dist,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,s)};
write('assets/catalog.js',`window.CATALOG=${JSON.stringify(catalog)};\n`);
const ctx={};vm.createContext(ctx);vm.runInContext(read('assets/scenes.js'),ctx);
for(const c of catalog){
  if(c.cover.endsWith('.svg'))write(c.cover,ctx.PlantScenes[c.id](c.id==='interaction'?{effect:20}:{},3,true));
  else if(!fs.existsSync(path.join(dist,c.cover)))throw new Error(`Missing course artwork: ${c.cover}`);
  if(c.id==='normal')continue;
  const scripts=c.id==='splitplot'?['assets/catalog.js','assets/world-engine.js','assets/splitplot-model.js','assets/splitplot-world.js','assets/splitplot.js']:['assets/catalog.js','assets/world-engine.js','assets/world-scenes.js','assets/lesson.js'];
  write(c.path,`<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${c.description}"><title>${c.title} · 植知</title><link rel="icon" href="../assets/leaf.svg"><link rel="stylesheet" href="../${asset('assets/lesson.css')}">${c.id==='splitplot'?`<link rel="stylesheet" href="../${asset('assets/splitplot.css')}">`:''}</head><body data-lesson="${c.id}">
<header class="top"><a class="home" href="../index.html">⌂ <span>目录</span></a><h1 id="title">${c.title}</h1><span class="identity">黄利东 · 互动教学</span><div class="tools"><a class="download" href="../downloads/${c.id}.html" download="${c.title}.html">下载 ↓</a><button id="front">正视</button><button id="reset">复位</button><button id="fullscreen">全屏 ↗</button></div></header>
<nav id="steps" class="steps" aria-label="知识路径"></nav><main class="stage"><canvas id="scene" tabindex="0" role="img" aria-label="${c.title}三维互动场景，拖动旋转、滚轮缩放。"></canvas><div class="stage-corner"><span class="dot"></span><span id="stage-keyword">${c.chapter}</span></div><div id="readout" class="readout" aria-live="polite"></div><div class="stage-tools"><button id="motion" aria-pressed="true">Ⅱ 动画</button><button id="rotate" aria-pressed="false">↻ 旋转</button></div><p class="caption" id="caption" aria-live="polite"></p><div class="view-hint">拖动旋转 · 滚轮缩放 · 教学示意</div><button id="tilt" class="view-toggle" aria-label="切换俯视与立体视角">俯视 ◇</button></main><footer class="bottom"><button id="prev" class="navbutton" aria-label="上一步">←</button><div id="controls" class="controls"></div><div class="playback"><button id="play" aria-label="自动演示" aria-pressed="false">▶</button><span id="progress">1 / 4</span></div><button id="next" class="navbutton next" aria-label="下一步">→</button></footer><div class="screenreader" id="description" aria-live="polite"></div>${scripts.map(p=>`<script src="../${asset(p)}"></script>`).join('')}</body></html>`);
}
// Package each lesson into a self-contained HTML file for offline/projector use.
for(const c of catalog){
  let html=read(c.path).replace(/<link rel="stylesheet" href="\.\.\/([^\"]+)">/g,(_,p)=>`<style>${read(p.split('?')[0])}</style>`).replace(/<script src="\.\.\/([^\"]+)"><\/script>/g,(_,p)=>`<script>${read(p.split('?')[0]).replace(/<\/script/gi,'<\\/script')}</script>`).replace(/<link rel="icon"[^>]*>/g,'<link rel="icon" href="data:,">');
  html=html.replace(/<a href="\.\.\/downloads\/[^\"]+"[^>]*>[^<]*<\/a>/g,'');
  html=html.replaceAll('../index.html#library','https://lidong-huang.github.io/plant-nutrition-lab/#library').replaceAll('../index.html','https://lidong-huang.github.io/plant-nutrition-lab/');
  write(`downloads/${c.id}.html`,html);
}
write('.nojekyll','');
console.log(`Built ${catalog.length} covers, ${catalog.length} lessons and ${catalog.length} offline files.`);



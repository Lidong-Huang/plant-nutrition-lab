import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist'),read=p=>fs.readFileSync(path.join(dist,p),'utf8');
const catalog=JSON.parse(read('catalog.json'));
const write=(p,s)=>{const dest=path.join(dist,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,s)};
write('assets/catalog.js',`window.CATALOG=${JSON.stringify(catalog)};\n`);
const ctx={};vm.createContext(ctx);vm.runInContext(read('assets/scenes.js'),ctx);
for(const c of catalog){
  write(c.cover,ctx.PlantScenes[c.id](c.id==='interaction'?{effect:20}:{},3,true));
  if(c.id==='normal')continue;
  write(c.path,`<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${c.description}"><title>${c.title} · 植知</title><link rel="icon" href="../assets/leaf.svg"><link rel="stylesheet" href="../assets/lesson.css"></head><body data-lesson="${c.id}">
<header class="top"><a class="back" href="../index.html">← 目录</a><h1>${c.title}</h1><span class="category">${c.category}</span><div class="tools"><button id="reset">复位</button><button id="fullscreen">全屏 ↗</button></div></header>
<main class="lesson"><div class="question"><p>${c.question}</p><span>OBSERVE · EXPLORE · UNDERSTAND</span></div><nav class="steps" aria-label="知识路径"></nav><section class="stage" aria-label="教学演示"><span class="stage-label">${c.chapter}</span><span class="model-note">教学示意</span><div class="scene"></div><p class="caption" aria-live="polite"></p></section><div class="bottom"><div class="param-controls"></div><div class="playback"><button id="prev" aria-label="上一步">←</button><button id="play" aria-pressed="false">▶ 演示</button><span id="progress">1 / 4</span><button id="next" aria-label="下一步">→</button></div></div><footer class="lesson-foot"><span>黄利东 · 内蒙古农业大学</span><a href="../downloads/${c.id}.html" download="${c.title}.html">↓ 下载独立课件</a><a href="../index.html#library">更多课件 ↗</a></footer></main><script src="../assets/catalog.js"></script><script src="../assets/scenes.js"></script><script src="../assets/lesson.js"></script></body></html>`);
}
// Package each lesson into a self-contained HTML file for offline/projector use.
for(const c of catalog){
  let html=read(c.path).replace(/<link rel="stylesheet" href="\.\.\/([^\"]+)">/g,(_,p)=>`<style>${read(p)}</style>`).replace(/<script src="\.\.\/([^\"]+)"><\/script>/g,(_,p)=>`<script>${read(p).replace(/<\/script/gi,'<\\/script')}</script>`).replace(/<link rel="icon"[^>]*>/g,'<link rel="icon" href="data:,">');
  html=html.replace(/<a href="\.\.\/downloads\/[^\"]+"[^>]*>[^<]*<\/a>/g,'');
  html=html.replaceAll('../index.html#library','https://lidong-huang.github.io/plant-nutrition-lab/#library').replaceAll('../index.html','https://lidong-huang.github.io/plant-nutrition-lab/');
  write(`downloads/${c.id}.html`,html);
}
write('.nojekyll','');
console.log(`Built ${catalog.length} covers, ${catalog.length} lessons and ${catalog.length} offline files.`);

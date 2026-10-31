import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const cat=JSON.parse(read('catalog.json'));
assert.equal(new Set(cat.map(c=>c.id)).size,cat.length);
for(const c of cat){for(const p of [c.path,c.cover,`downloads/${c.id}.html`])assert(fs.existsSync(path.join(root,p)),`Missing ${p}`);assert(!/src="\.\.\/assets|href="\.\.\/assets/.test(read(`downloads/${c.id}.html`)),`Offline dependencies: ${c.id}`)}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
for(const file of walk(root).filter(p=>p.endsWith('.html'))){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[#?][^"]*)?"/g)){const url=m[1];if(/^(https?:|data:|mailto:)/.test(url))continue;assert(fs.existsSync(path.resolve(path.dirname(file),url)),`${path.relative(root,file)} -> ${url}`)}for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:file})}
const ctx={};vm.createContext(ctx);vm.runInContext(read('assets/scenes.js'),ctx);
for(const c of cat){for(let s=0;s<c.steps.length;s++){const svg=ctx.PlantScenes[c.id]({},s);assert(svg.startsWith('<svg'));assert(!/NaN|undefined/.test(svg))}}
// Check the two important model invariants rather than snapshotting markup.
const minimum=ctx.PlantScenes.minimum({n:100,p:35,k:70},2);assert(minimum.includes('35%'));assert(minimum.includes('限制养分：P'));
const interaction=ctx.PlantScenes.interaction({effect:20},3);assert(interaction.includes('(75 − 35) − (40 − 20) = 20'));
console.log(`PASS: ${cat.length} lessons; local links, offline scripts, SVG scenes and model invariants.`);

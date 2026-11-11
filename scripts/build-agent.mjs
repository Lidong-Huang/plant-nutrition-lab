import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function buildAgent(){
 const dist=path.join(root,'dist'),config=JSON.parse(fs.readFileSync(path.join(root,'agent/knowledge.json'),'utf8')),catalog=JSON.parse(fs.readFileSync(path.join(dist,'catalog.json'),'utf8'));
 const rows=config.map(k=>{const c=catalog.find(c=>c.id===k.id);if(!c)throw Error('Unknown agent resource '+k.id);return {...k,title:c.title,category:c.category,path:c.path,cover:c.cover,description:c.description,steps:c.steps,document:fs.readFileSync(path.join(root,'docs',k.notes),'utf8').slice(0,16000)};});
 if(new Set(rows.map(x=>x.id)).size!==catalog.length)throw Error('Agent knowledge must cover each released resource');
 fs.writeFileSync(path.join(dist,'assets/agent-knowledge.js'),'window.AGENT_KNOWLEDGE='+JSON.stringify(rows).replaceAll('<','\\u003c')+';\n');
 const hash=p=>createHash('sha256').update(fs.readFileSync(path.join(dist,p))).digest('hex').slice(0,10),page=path.join(dist,'agent.html');
 let html=fs.readFileSync(page,'utf8').replace(/((?:href|src)=")(assets\/[^"?]+)(?:\?[^"]*)?"/g,(_,pre,p)=>pre+p+'?v='+hash(p)+'"');fs.writeFileSync(page,html);
 const offline=html.replace(/<link rel="stylesheet" href="([^"?]+)(?:\?[^"]*)?">/g,(_,p)=>'<style>'+fs.readFileSync(path.join(dist,p),'utf8')+'</style>').replace(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g,(_,p)=>'<script>'+fs.readFileSync(path.join(dist,p),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>').replace(/<link rel="icon"[^>]+>/g,'<link rel="icon" href="data:,">').replaceAll('href="index.html"','href="https://lidong-huang.github.io/plant-nutrition-lab/"');
 const ready=offline.replace(/src="assets\/leaf\.svg(?:\?[^"]*)?"/g,'src="data:image/svg+xml;base64,'+fs.readFileSync(path.join(dist,'assets/leaf.svg')).toString('base64')+'"').replaceAll('href="index.html#library"','href="https://lidong-huang.github.io/plant-nutrition-lab/#library"');
 fs.writeFileSync(path.join(dist,'downloads/agent.html'),ready);
 return rows.length;
}

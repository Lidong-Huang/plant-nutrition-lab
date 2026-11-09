import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site='https://lidong-huang.github.io/plant-nutrition-lab/';
const notes={'trial-story':'玉米产量互动闯关.md',uptake:'玉米根系模型.md',minimum:'最小养分律说明.md',nitrogen:'氮素转化机理.md',blocks:'内容依据.md',splitplot:'裂区试验说明.md',normal:'正态分布标准化与积分.md','t-normal':'t分布与标准正态.md',interaction:'内容依据.md','soil-culture':'磷效应培养试验.md','sand-culture':'磷效应培养试验.md','hydro-culture':'霍格兰配液与pH操作.md','measurement-error':'误差与测量.md'};
const topics={'trial-story':'四个小区 → 均值抽样 → 标准化与t → 尾部概率 → 判断',uptake:'土壤 → 根表 → 吸收 → 运输',minimum:'植株生长 → 木桶短板 → 限制转移',nitrogen:'矿化与硝化 → 吸收 → 三类氮损失',blocks:'肥力梯度 → 区组 → 随机与重复',splitplot:'灌水主区 → 施肥副区 → 两层误差',normal:'X 与 X̄ → 抽样分布 → 两者标准化 → 累积概率与积分','t-normal':'形状 → 自由度 → 双尾 0.05 → 临界值',interaction:'两个因素 → 交互作用 → 对比','soil-culture':'装盆与磷处理 → 养护 → 收获评价','sand-culture':'洗砂与配液 → 自动浇灌 → 收获评价','hydro-culture':'霍格兰配液 → pH 与通气 → 供磷评价','measurement-error':'农业测量 → 打靶 → 两类误差 → 分布'};
const order=['植物营养','培养试验','田间试验','试验统计'];
export function syncResourceDocs(){
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'dist/catalog.json'),'utf8'));
 const groups=order.map(category=>({category,items:catalog.filter(c=>c.category===category)}));
 if(groups.reduce((n,g)=>n+g.items.length,0)!==catalog.length)throw Error('Unmapped course category');
 const write=(p,text)=>{const dest=path.join(root,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text)};
 for(const c of catalog){
  if(!/^[a-z0-9-]+$/.test(c.id)||!notes[c.id]||!topics[c.id])throw Error('Missing resource metadata: '+c.id);
  for(const p of ['dist/'+c.path,'dist/'+c.cover,'dist/downloads/'+c.id+'.html','docs/'+notes[c.id]])if(!fs.existsSync(path.join(root,p)))throw Error('Missing release file: '+p);
  write(`courses/${c.id}/README.md`,`# ${c.title}\n\n**[在线演示](${site+c.path})** · [独立 HTML](../../dist/downloads/${c.id}.html) · [课程目录](../README.md)\n\n<img src="../../dist/${c.cover}" width="720" alt="${c.title}">\n\n${c.description}\n\n步骤：${c.steps.join(' → ')}。\n\n[内容与模型说明](../../docs/${notes[c.id]}) · [课件源码](../../dist/${c.path})\n`);
 }
 const rows=catalog.map(c=>`| <img src="dist/${c.cover}" width="190" alt="${c.title}"> | [${c.title}](${site+c.path}) | ${topics[c.id]} | [独立 HTML](dist/downloads/${c.id}.html) · [说明](courses/${c.id}/README.md) |`).join('\n');
 const section=`## 教学资源\n\n已整理 **${catalog.length} 项定稿资源**：${groups.map(g=>g.category+' '+g.items.length+' 项').join('、')}。\n\n[按分类查看目录](courses/README.md) · [完整文件清单](docs/资源目录.md) · [下载整个资源库 ZIP](https://github.com/Lidong-Huang/plant-nutrition-lab/archive/refs/heads/main.zip)\n\n| 封面 | 课件（在线演示） | 知识路径 | 文件与说明 |\n| --- | --- | --- | --- |\n${rows}\n`;
 const readmePath=path.join(root,'README.md');let readme=fs.readFileSync(readmePath,'utf8');const start=readme.indexOf('## 教学资源'),end=readme.indexOf('\n## 使用',start);if(start<0||end<0)throw Error('README resource section not found');readme=readme.slice(0,start)+section+'\n'+readme.slice(end);readme=readme.replace(/\n新增资源：\[误差[^\n]+\n/g,'\n').replace(/\n{3,}/g,'\n\n');if(!readme.includes('courses/             #'))readme=readme.replace('```text\ndist/','```text\ncourses/             # 各资源独立目录与 README\ndist/');fs.writeFileSync(readmePath,readme);
 const index=`# 教学资源目录\n\n共 **${catalog.length} 项**，均提供在线演示、封面和可独立运行的 HTML。\n\n**[进入教学网站](${site})** · [完整文件清单](../docs/资源目录.md)\n\n`+groups.map(g=>`## ${g.category}（${g.items.length}）\n\n| 资源 | 在线 | 离线 |\n| --- | --- | --- |\n${g.items.map(c=>`| [${c.title}](${c.id}/README.md) | [打开](${site+c.path}) | [独立 HTML](../dist/downloads/${c.id}.html) |`).join('\n')}\n`).join('\n')+'\n下载离线文件时，在 GitHub 文件页面点击下载按钮；下载后可直接用浏览器打开。\n';
 write('courses/README.md',index);
 write('docs/资源目录.md',`# 定稿资源文件清单\n\n当前共 **${catalog.length} 项**。每项均包含在线课件、离线 HTML、封面和独立 README。\n\n[在线教学网站](${site}) · [课程目录](../courses/README.md) · [数据目录](../dist/catalog.json)\n\n`+groups.map(g=>`## ${g.category}\n\n| 资源说明 | 在线 | 课件源码 | 离线 HTML | 封面 |\n| --- | --- | --- | --- | --- |\n${g.items.map(c=>`| [${c.title}](../courses/${c.id}/README.md) | [打开](${site+c.path}) | [HTML](../dist/${c.path}) | [下载](../dist/downloads/${c.id}.html) | [预览](../dist/${c.cover}) |`).join('\n')}\n`).join('\n')+'\n目录与各项 README 根据 `dist/catalog.json` 同步；新增或更新课件后运行 `npm run build`。\n');
 return catalog.length;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(`Synced ${syncResourceDocs()} resource folders, README entries and file inventory.`);

/* Teaching designs grounded in the supplied textbook. Example observations are
   explicitly synthetic; dosing and nutrient-balance calculations are exact. */
(()=>{'use strict';
const P=30.973762,K=39.0983,KH=136.08554,KCL=74.5513;
const types=['soil','sand','hydro'],treatments=['P₀','P₁','P₂'],colors=['#ad8d6c','#69a9a8','#588451'];
const soilP=[0,25,75],solutionP=[0,.05,.5];
function dose(type,treatment,volume=5){if(!types.includes(type)||![0,1,2].includes(treatment)||!Number.isFinite(volume)||volume<=0)throw Error('Invalid culture dose');if(type==='soil'){const p=soilP[treatment]*volume,phosphate=p/P,backgroundK=150*volume;return {pMg:p,rate:soilP[treatment],kh2po4Mg:phosphate*KH,kclMg:(backgroundK/K-phosphate)*KCL,kMg:backgroundK,soilKg:volume}}
const phosphate=solutionP[treatment],kcl=.5-phosphate;return {pMmol:phosphate,pMgL:phosphate*P,pMg:phosphate*P*volume,volumeL:volume,kh2po4Mg:phosphate*volume*KH,kclMg:kcl*volume*KCL,kMmol:3,nMmol:7.5,caMmol:2.5,mgMmol:1,sMmol:1,kclMmol:kcl,kno3Mmol:2.5,calciumNitrateMmol:2.5}}
function layout(seed=73){let a=seed>>>0;const rnd=()=>{a=(1664525*a+1013904223)>>>0;return a/4294967296};return Array.from({length:4},(_,block)=>{const row=[0,1,2];for(let i=2;i>0;i--){const j=Math.floor(rnd()*(i+1));[row[i],row[j]]=[row[j],row[i]]}return row.map((t,column)=>({block,column,treatment:t,id:`B${block+1}-${treatments[t]}`}))})}
const dry={soil:[[4.8,5.2,5,4.9],[7.5,7.9,8.1,7.7],[8.8,9.1,8.9,9.2]],sand:[[3.8,4.2,4,3.9],[6.4,6.8,6.6,6.7],[8.6,9,8.8,8.7]],hydro:[[3.1,3.5,3.3,3.2],[6.1,6.5,6.3,6.4],[8.5,8.9,8.7,8.8]]};
const concentration=[[1.1,1.2,1.15,1.1],[2.1,2.2,2.15,2.2],[3.1,3.2,3.15,3.2]];
function records(type){if(!types.includes(type))throw Error('Unknown culture');return dry[type].flatMap((row,t)=>row.map((dm,r)=>({treatment:t,rep:r+1,dryG:dm,pGkg:concentration[t][r],uptakeMg:dm*concentration[t][r]})))}
function means(type){const r=records(type);return [0,1,2].map(t=>{const a=r.filter(x=>x.treatment===t),mean=k=>a.reduce((s,x)=>s+x[k],0)/a.length;return {treatment:t,dryG:mean('dryG'),pGkg:mean('pGkg'),uptakeMg:mean('uptakeMg'),n:4}})}
// Idealized, closed-loop water-volume bookkeeping. Air pressure drives only the
// delivery phase; vented gravity refill and drainage overlap in phase 2.
function irrigation(phase,f=0){if(![0,1,2,3].includes(phase)||!Number.isFinite(f))throw Error('Invalid irrigation phase');f=Math.max(0,Math.min(1,f));let reservoir=6,bottle=2,sand=2;if(phase===1){reservoir=6+.5*f;bottle=2-2*f;sand=2+1.5*f}else if(phase===2){reservoir=6.5+.5*f;bottle=f;sand=3.5-1.5*f}else if(phase===3){reservoir=7-f;bottle=1+f;sand=2}return {reservoir,bottle,sand,total:reservoir+bottle+sand,pressure:phase===1,checkOpen:phase!==1,spray:phase===1,drain:phase===2||phase===1&&f>.25,refill:phase===2||phase===3,vent:phase!==1}}
const phaseNames=['补液待机','加压喷灌','卸压回流','补满复位'];
const commonDesign=['同一玉米品种、同龄整齐幼苗，每盆或每套独立培养系统留 1 株。','3 个磷水平 × 4 个区组，每区组各 1 个处理；随机排位，保持管理一致。','土培 P₀ 是不额外施磷；砂培与水培 P₀ 是不添加磷盐，种子与残留仍可能带磷。'];
const steps={
soil:[
['问题与对照','在低磷土壤中，加磷能否提高玉米生长与吸磷？','选低磷土 → 设置磷梯度 → 比较响应',['只改变计划中的磷水平，N、K 等保持适宜且一致。','P₀ 不额外施磷，不代表土壤或玉米体内没有磷。','本课观察幼苗期响应，不直接推算田间籽粒产量。']],
['取土与测定','先知道土壤能供多少磷','代表性耕层土 → 风干、去杂、过筛、混匀',['测定 pH、有效磷与基础肥力，确认供试土壤适合研究磷响应。','教材采用 3 mm 过筛；大土块捣碎过筛，不随意丢弃。','测含水率，以烘干土当量统一每盆装土 5 kg。']],
['磷处理与配平','同一土壤，三个磷水平','KH₂PO₄ 溶于水 → 喷到盆内土壤 → 全层混匀',['这里统一按元素 P 计量，不把 P₂O₅ 与 P 混用。','将定量 KH₂PO₄ 完全溶于水，用喷壶分次均匀喷到盆内全部供试土，再充分混匀。','KCl 补钾量按磷盐带入的钾扣减；N 等背景一致，P₀ 补等量水。']],
['装盆与定苗','装土量、紧实度和苗龄一致','施肥混匀完成 → 催芽播种 → 出苗 → 每盆留 1 株',['播种前核对盆内土壤已按处理充分混肥，再催芽播种、统一定苗。','同规格盆、同一装土高度与紧实度；保留浇水空间和规定排水结构。','采用整齐催芽种子，出苗后每盆保留 1 株，记录处理起点。']],
['随机与重复','每个区组都能作完整的磷比较','4 区组 × 3 处理 = 12 个独立盆',['每区组内 3 个处理独立随机，区组对应温室中的主要位置梯度。','定期按预定规则调盆，不能把同一处理始终放在同一侧。','一盆是一个实验单位；同盆多片叶不是独立重复。']],
['称重与补水','水分一致，才看得清磷效应','目标盆重 − 当前盆重 = 补水量',['统一以干土基准含水率控制水分，称重后补足差额。','目标盆重包含盆、干土、目标水量及附属物，并随植株增重校正。','防止盆间串水、异常渗漏；记录光温与生长，不用叶色单独判定缺磷。']],
['生长与收获','同一处理时长，分别测每一盆','观察 → 分根冠 → 洗根 → 烘干 → 测磷',['按预定幼苗期终点收获；本示意用处理后 28 天作为比较终点。','记录株高、叶片和根系，分别测根、地上部干物质与磷浓度。','模型植株是示意；真实效应需由每盆测定值与试验误差判断。']],
['计算与解释','把长势差异接到吸磷证据上','吸磷量 = 干物质 × 磷浓度',['表中是可核算的教学模拟数据，绝非该土壤的实测结果。','按独立盆汇总，区组设计分析需考虑区组与误差，不只看柱高。','不施磷对照用于估计背景吸磷；肥料回收率的差减法也不是同位素证明。']]
],
sand:[
['问题与处理','用砂固定根系，用营养液控制磷','洗净石英砂 + 磷水平不同的营养液',['研究可溶性供磷水平对玉米幼苗的效应，不能据此直接评价土壤中难溶磷肥。','采用改良半量霍格兰背景，P 为 0 / 0.05 / 0.50 mmol·L⁻¹。','每盆、每个重复各用独立贮液槽、输液瓶与回液管，空气源可以共用。']],
['洗砂与装盆','先排除砂子带来的磷和杂质','水洗 → 酸浸 → 漂洗检验 → 营养液平衡 → 装砂',['统一粒径的石英砂，经规范清洗，检验背景磷、洗液与 pH 后使用。','教材描述预处理后以营养液平衡；清洗操作按实验室规程完成。','盆底粗砂、挡砂层和排液口畅通，砂面低于盆沿；同龄玉米每盆 1 株。']],
['配液与配平','不能降磷时也把钾降下来','KH₂PO₄ + KCl = 0.50 mmol·L⁻¹',['保持 KNO₃、Ca(NO₃)₂、MgSO₄、微量元素及铁源相同。','用 KCl 补齐磷盐减少带走的 K；Cl⁻ 随之改变，必须记录这一配平边界。','各系统以相同体积和管理规则运行，浓度与总供磷量分别记录。']],
['辨认液路','看清气路、供液路和回液路','贮液槽 → 输液瓶 → 砂面 → 盆底 → 贮液槽',['贮液槽液面高于输液瓶补液水位，盆底又高于贮液槽，形成补液和回液的重力条件。','输液管伸入瓶内液体；压缩空气进入瓶上方气室，气路与液路分开。','止回阀防止加压时液体倒流；喷管在砂面上方，属于砂面浇灌。']],
['加压喷灌','先关闭回路，再把液体压到砂面','定时开气 → 止回阀关闭 → 输液瓶排液',['压缩空气提高输液瓶内压力，营养液沿出液管上升。','砂面环形喷管均匀给液，液体自上而下进入根区。','一次供液量受输液瓶有效液量控制；动画循环不代表真实灌溉频率。']],
['卸压与补液','喷灌结束后，液体怎样回到起点？','停气卸压 → 重力排液 → 止回阀开放补液',['多余营养液由盆底排液管回到本盆贮液槽，砂孔隙恢复通气。','输液瓶卸压后，贮液槽中的营养液经止回阀重新流入瓶中。','排液与补液可以重叠；瓶满后待机，等待下一次定时供气。']],
['随机与养护','自动循环，也要防止处理被混掉','12 套独立系统 · 记录补水、pH 与换液',['按 4 个区组随机摆放三个磷处理，整套液路随实验单位管理。','同源压缩空气不等于共用营养液；回液绝不跨处理、跨重复。','补充蒸发用水、监测 pH 与浓度，按共同规则换液，防止砂面盐分累积。']],
['玉米与收获','观察供磷后，根冠如何响应','固定处理时长 → 分盆收获 → 测干物质与磷',['示意终点为处理后 28 天，各处理同时取样。','根系完整洗出，分别测根、地上部干重和磷浓度，再汇总全株吸磷量。','砂粒吸附和循环消耗会改变根际浓度，贮液槽标称浓度不等于始终恒定。']],
['比较与结论','植物响应要与供液记录一起解释','比较干物质、吸磷量与系统运行记录',['表中为教学模拟观测值，可按重复逐项核算。','换液次数、体积、初末磷浓度需记录；不能把起始槽内磷量当作全程施磷量。','砂培揭示受控供磷响应，不替代土培或田间肥效试验。']]
],
hydro:[
['问题与对照','根系直接接触营养液，单独看供磷水平','改良半量霍格兰（一） → 3 个磷水平',['采用教材表 1-9 的霍格兰营养液（一）为大量元素背景，明确使用半量。','P₀ / P₁ / P₂ 分别为 0 / 0.05 / 0.50 mmol P·L⁻¹。','同龄玉米、相同液量与管理；一套独立培养容器才是一个重复。']],
['配制霍格兰液','先配共同背景，再改变磷盐','KNO₃ 2.5 · Ca(NO₃)₂ 2.5 · MgSO₄ 1 mmol·L⁻¹',['微量元素与螯合铁相同，配方详表可展开查看。','先加入大部分去离子水，分别加入各贮备液并混匀，再定容。','浓钙液与浓磷液不直接混合，减少沉淀；检查 pH 与实际配液记录。']],
['磷与钾配平','用 KCl 补足低磷处理的钾，使总钾一致，比较磷的效应','KH₂PO₄ 同时供磷和钾 → 低磷处理补钾 → 总钾一致',['三个处理的总 K 均为 3.0 mmol·L⁻¹，N、Ca、Mg、S 背景相同。','这是以 Cl⁻ 替代部分磷酸根的改良配方；Cl⁻ 并不相同，应记录并评估其影响。','所有浓度按元素 P 表示，P₀ 不保证种子或器材中的磷绝对为零。']],
['育苗与定植','先让幼苗整齐，再开始处理计时','催芽 → 选同龄苗 → 过渡培养 → 固定定植',['采用相同育苗与过渡条件，记录起始苗龄、大小及种子携带的磷。','每独立容器 1 株，用柔软泡沫固定，避免夹伤根颈。','根系接触溶液，根颈留在液面之上；容器遮光，避免藻类干扰。']],
['随机与重复','共用一槽的植株，不能算多个独立重复','4 区组 × 3 独立容器 = 12 个单位',['每区组包含三个磷处理，容器独立配液，不共用回液槽。','同容器多次取样是技术或重复测量，不能增加独立样本数。','按预先规则换位管理，保持每个容器身份和记录连续。']],
['通气与换液','根要氧气，溶液也会变化','通气 → 补水 → 测 pH / EC → 定期换液',['气泵经气石供气，不是把所有根颈都淹在水里。','各处理按共同规则补回初始液位、记录 pH 和 EC；EC 不能替代磷浓度。','按预定规则及时换液与测磷；本课以 3 天换液为教学计划，实际间隔由预试验确定。']],
['生长与取样','既看玉米，也测液体与植株','处理后 28 天 → 根冠干重 → 植株磷浓度',['植株与根的长势变化仅为示意，叶色不能单独证明缺磷。','分容器收获，统一清洗、分根冠、烘干和测定流程。','液体磷收支还需考虑换液、补液、取样、沉淀和器壁吸附。']],
['吸磷量与解释','浓度高不等于吸收总量一定大','g 干物质 × g P·kg⁻¹ = mg P',['下方示例值为独立容器的教学模拟数据，可按公式核算。','先逐单位计算吸磷量，再求处理均值，不能只比较株高或浓度。','结论限定于此培养体系和试验条件，不把它直接换算成田间施磷量。']]
]};
window.CultureModels={types,treatments,colors,soilP,solutionP,dose,layout,records,means,irrigation,phaseNames,steps,commonDesign};
})();



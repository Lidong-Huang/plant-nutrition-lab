# 植知 · 植物营养与试验统计互动教学

黄利东 · 内蒙古农业大学

把一个知识点，做成可以旋转、操作、分步播放的立体演示。

**在线体验：[https://lidong-huang.github.io/plant-nutrition-lab/](https://lidong-huang.github.io/plant-nutrition-lab/)**

## 教学资源

| 封面 | 课件 | 知识路径 | 文件 |
| --- | --- | --- | --- |
| <img src="dist/covers/uptake-v4.webp" width="190" alt="根系吸收"> | [根系如何吸收养分](https://lidong-huang.github.io/plant-nutrition-lab/lessons/uptake.html) | 土壤溶液 → 根表 → 吸收 → 运输 | [独立 HTML](dist/downloads/uptake.html) |
| <img src="dist/covers/minimum-v3.webp" width="190" alt="最小养分律"> | [最小养分律](https://lidong-huang.github.io/plant-nutrition-lab/lessons/minimum.html) | 植株 → 短板 → 只补氮 → 补磷 → 协调供给 | [独立 HTML](dist/downloads/minimum.html) |
| <img src="dist/covers/nitrogen-v2.webp" width="190" alt="氮素转化"> | [土壤中的氮素转化](https://lidong-huang.github.io/plant-nutrition-lab/lessons/nitrogen.html) | 矿化 / 水解 → 硝化 → 吸收 → 挥发 / 淋洗 / 反硝化 | [独立 HTML](dist/downloads/nitrogen.html) |
| <img src="dist/covers/blocks-v2.webp" width="190" alt="区组田间试验"> | [随机区组设计](https://lidong-huang.github.io/plant-nutrition-lab/lessons/blocks.html) | 梯度 → 区组 → 随机 → 重复 | [独立 HTML](dist/downloads/blocks.html) |
| <img src="dist/covers/splitplot-v2.webp" width="190" alt="裂区试验设计"> | [裂区试验设计](https://lidong-huang.github.io/plant-nutrition-lab/lessons/splitplot.html) | 灌水主区 → 施肥副区 → 两级随机 → 两层误差 | [独立 HTML](dist/downloads/splitplot.html) |
| <img src="dist/covers/normal-v2.webp" width="190" alt="正态分布"> | [正态分布](https://lidong-huang.github.io/plant-nutrition-lab/lessons/normal.html) | 形状 → 对称 → 均值 → 标准差 → 拐点 → 概率 → 标准化 → 累积概率 → 积分 | [独立 HTML](dist/downloads/normal.html) |
| <img src="dist/covers/interaction-v2.webp" width="190" alt="交互作用"> | [氮 × 磷的交互作用](https://lidong-huang.github.io/plant-nutrition-lab/lessons/interaction.html) | 因素 → 无交互 → 正交互 → 对比 | [独立 HTML](dist/downloads/interaction.html) |
| <img src="dist/covers/soil-culture-v1.jpg" width="190" alt="土培 · 玉米磷肥效应"> | [土培 · 玉米磷肥效应](https://lidong-huang.github.io/plant-nutrition-lab/lessons/soil-culture.html) | 问题与对照 → 取土与测定 → 磷处理与配平 → 装盆与定苗 → 随机与重复 → 称重与补水 → 成熟收获与千粒重 → 计算与解释 | [独立 HTML](dist/downloads/soil-culture.html) |
| <img src="dist/covers/sand-culture-v1.jpg" width="190" alt="砂培 · 自动砂面浇灌"> | [砂培 · 自动砂面浇灌](https://lidong-huang.github.io/plant-nutrition-lab/lessons/sand-culture.html) | 问题与处理 → 洗砂与装盆 → 配液与配平 → 辨认液路 → 加压喷灌 → 卸压与补液 → 随机与养护 → 成熟收获与千粒重 → 比较与结论 | [独立 HTML](dist/downloads/sand-culture.html) |
| <img src="dist/covers/hydro-culture-v1.jpg" width="190" alt="水培 · 霍格兰供磷试验"> | [水培 · 霍格兰供磷试验](https://lidong-huang.github.io/plant-nutrition-lab/lessons/hydro-culture.html) | 问题与对照 → 配制霍格兰液 → 磷与钾配平 → 育苗与定植 → 随机与重复 → 通气与换液 → 成熟收获与千粒重 → 吸磷量与解释 | [独立 HTML](dist/downloads/hydro-culture.html) |

三个培养资源的教材对应、试验步骤、磷钾配平与霍格兰配方见 [磷效应培养试验](docs/磷效应培养试验.md)。

正态分布的换元、概率面积与小矩形积分见 [标准化与积分说明](docs/正态分布标准化与积分.md)。

## 使用

- **在线**：首页选择课件，按步骤播放或调整参数。
- **旋转**：拖动观察立体场景，滚轮缩放；触屏单指旋转、双指缩放。支持正视、俯视、复位和自动环绕。
- **动画**：观察养分流动、木桶水位、作物响应和区组随机移动；田间场景包含日照、道路、树木与作物。
- **离线**：下载 `dist/downloads/` 内任意 HTML，在 Chrome 或 Edge 中直接打开。
- **本地**：双击 `dist/index.html`；或执行 `npm start`，访问 `http://127.0.0.1:4173`。
- **投影**：右上角进入全屏。画布外左右方向键翻步，空格自动演示；画布聚焦时方向键旋转，+ / - 缩放，0 复位视角。

## 目录

```text
dist/
  index.html          # 资源首页
  catalog.json        # 课程目录
  covers/             # 课程封面（WebP / SVG）
  lessons/            # 在线课程
  downloads/          # 可独立运行的离线 HTML
  assets/             # 样式、动画与模型
scripts/              # 生成、校验、本地预览
docs/                 # 发布、内容依据与维护说明
.github/workflows/    # GitHub Pages 自动部署
```

修改后运行 `npm run build` 与 `npm run check`。添加课件见 [维护说明](docs/维护说明.md)，首次上线见 [GitHub 发布](docs/GitHub发布.md)。

## 模型与来源

新课件采用独立编写的 Canvas 立体几何和粒子动画，首页采用原创生成的立体科学封面；正态分布沿用本地已有课程。数值、植物高度与环境均为教学设定，非真实试验结果。最小养分律将植物生长与木桶联动，模型和情景见 [最小养分律说明](docs/最小养分律说明.md)；交互作用采用可调的四格均值模型，不据此判断统计显著性。裂区试验的过程与统计结构见 [裂区试验说明](docs/裂区试验说明.md)。氮素各过程、损失出口与演示边界见 [氮素转化机理](docs/氮素转化机理.md)。详见 [内容依据](docs/内容依据.md) 与 [封面设计](docs/封面设计.md)。

资源组织方式参考 [Tongjiang Lab](https://github.com/smithjohn78390/tongjiang-lab)，未复制其代码、封面或课程素材。当前项目未额外授予开源许可；公开使用与再分发方式由作者确定。





新增资源：[误差 · 准确度与精确度](https://lidong-huang.github.io/plant-nutrition-lab/lessons/measurement-error.html)：农业测量 → 观测值与真值 → 打靶与逐次记录 → 两类误差 → 准确与精确 → 分布平移 → 随机波动与重复 → 试验控制。详见[知识路径与模型说明](docs/误差与测量.md)。

有合作需要可以联系我：[ldhuangnz@163.com](mailto:ldhuangnz@163.com)。

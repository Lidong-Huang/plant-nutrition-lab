# 植知 · 智能导学

**[打开页面](https://lidong-huang.github.io/plant-nutrition-lab/agent.html)** · [部署与接通DeepSeek](../docs/DeepSeek智能导学部署.md) · [页面源码](../dist/agent.html) · [独立HTML](../dist/downloads/agent.html)

植物营养与试验统计交互式导学智能体：查找原创动画、分析独立重复数据、进行巩固练习，并通过服务端接入DeepSeek多轮答疑与工具调用。

资源检索、统计与练习可直接使用；DeepSeek答疑需要教师配置服务端API密钥并部署服务。页面会显示实际连接状态。

`knowledge.json`维护审核后的核心知识、关键词、题目和提示；构建时读取已有课程目录和模型说明，前后端使用同一份数据与计算程序。

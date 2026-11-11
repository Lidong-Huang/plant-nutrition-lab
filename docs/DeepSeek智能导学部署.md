# 植知智能导学：部署与接通DeepSeek

页面入口：[植知智能导学](https://lidong-huang.github.io/plant-nutrition-lab/agent.html)。网站首页有“智能导学”和“向植知提问”入口。

## 当前功能与边界

| 功能 | 实现方式 | 是否需要DeepSeek |
| --- | --- | --- |
| 查找13项原创课程、阅读核心原理、打开动画 | 根据课程目录与教师说明检索 | 否 |
| 单样本t检验：均值、s、SE、t、p、双侧置信区间 | 共享数值程序，支持右尾、左尾、双尾 | 否 |
| 13个知识点的练习、错误提示、正确解释 | 教师审核题库与确定性判题 | 否 |
| 自由提问、上下文追问、按问题调用课程工具 | DeepSeek Tool Calls，由服务端执行检索、计算、出题与判题 | 是 |
| 学习记录导出 | 浏览器中实际发生的操作及对话 | 否 |

GitHub Pages和现有Sites镜像提供静态页面，不能直接运行Node服务。自由答疑需要单独运行下述服务。没有密钥时页面明确显示“待连接”，不把固定答案或模拟回答冒充DeepSeek。离线HTML可运行检索、计算和练习；答疑仍需网络。

本版未配置真实API密钥。接口测试使用隔离的模拟DeepSeek响应验证调用链，不代表已完成真实模型联网验证。接通后应再进行真实问答验收。

## 在教师电脑试用

需要Node.js 22及以上；程序使用内置模块，无需安装SDK或其他依赖。在仓库目录执行：

```powershell
Copy-Item -LiteralPath .env.example -Destination .env.local
notepad .env.local
```

在本机文件中填写`DEEPSEEK_API_KEY`，保存后执行：

```powershell
npm.cmd run build
npm.cmd run agent
```

打开`http://127.0.0.1:4180/agent.html`。同源页面会检查服务状态。只有完成一次真实回答，才能确认密钥、余额和网络均可用；“已配置”只说明服务端检测到了密钥。

`.env.local`已被Git忽略。不要将真实密钥填写到网页、GitHub、作品说明或聊天记录中。网页“课堂口令”是教师自定义的访问口令，与DeepSeek API密钥不同。

## 校内正式部署

1. 将仓库部署到能访问DeepSeek API的校内服务器，运行构建。
2. 在服务器设置`DEEPSEEK_API_KEY`。默认模型为`deepseek-flash`，可通过`DEEPSEEK_MODEL`调整为账户支持的模型。
3. 通过进程管理器持续运行`npm run agent`，保持服务监听`127.0.0.1:4180`；使用学校提供的HTTPS反向代理对外访问。
4. 对外部署建议设置独立的`AGENT_CLASS_CODE`，并向本课堂学生提供口令。程序按连接IP限制请求频率、输入长度与工具调用轮数。
5. 学生可直接打开服务器上的`/agent.html`。如果继续从GitHub网站打开页面，点击右上角“连接”，填写教师提供的HTTPS服务根地址和课堂口令。

例如Caddy反向代理配置，其中域名需要替换成学校实际域名：

```caddy
guide.example.edu.cn {
    reverse_proxy 127.0.0.1:4180
}
```

跨域服务只允许`AGENT_ALLOWED_ORIGINS`中列出的来源。GitHub网站的来源为`https://lidong-huang.github.io`；来源不含仓库路径。多个来源用英文逗号分隔。浏览器不保存DeepSeek密钥，课堂口令仅保留在当前浏览器会话。

## 接口与智能体执行过程

- `GET /api/status`：只返回是否配置、模型名称、是否需要课堂口令，不返回任何密钥。
- `POST /api/chat`：接收`message`、`history`、可选`courseId`及匿名`sessionId`。客户端只能提交user/assistant历史，不能提交system或伪造工具消息。
- 服务端先检索课程资料，向DeepSeek提供教师知识片段，再处理模型发出的`search_resources`、`calculate_trial`、`get_practice`、`check_answer`调用，将真实结果返回模型组织回答。
- 仅允许以上四个工具，不执行模型返回的代码、Shell命令或任意网络地址。最多四轮模型请求，最后一轮关闭工具调用。每次请求有超时与输出限制。
- 结果包含回答、真实检索到的课程链接、计算结果、练习和实际执行的工具记录。模型不负责替代数值计算程序。

统计工具假定各数来自独立正态实验单位，与固定基准作单样本t检验。置信区间明确为`1−α`的双侧均值区间；检验可单侧或双侧。与历史基准的差异不能单独证明处理因果。两个示例按钮会明确标注教学数据，用户录入数据单独标识。

## 教学使用记录

浏览器记录真实发生的资源检索、打开课件、计算、答题与成功答疑。点击“下载学习记录”导出匿名JSON；手机顶部也有下载按钮。记录包含导出时间、随机会话编号、答题正误、计算摘要及本机对话，可以由用户编辑，不能作为独立认证成绩。

服务端将真实完成的AI请求和工具用量记录到`.agent-data/events.jsonl`，不记录提问正文、密钥或IP。静态工具的浏览器记录不会自动集中到服务器。`POST /api/events`预留给经明确告知的校内采集系统，当前前端未自动调用。

如需导出服务端记录，可设置独立`AGENT_ADMIN_TOKEN`，向`GET /api/metrics`发送`Authorization: Bearer <教师管理令牌>`，取得最近10000条记录。管理令牌不写入网页。`.agent-data/`被Git忽略。

参赛说明中应区分已上线页面、已实现工具、已接通模型与实际课堂试用。不能把自动测试或教学示例当成真实学生成效。赛事平台的知识库、HTTP工具与页面接入，以赛事平台实际支持能力为准。

## 文件与验证

`agent/knowledge.json`维护教师核心知识和题库；构建时合并13项课件目录与相应公开模型说明，生成`dist/assets/agent-knowledge.js`。前后端共用`agent-domain.js`，计算调用既有`StudentTMath`。

- 页面：`dist/agent.html`、`dist/assets/agent.css`、`dist/assets/agent.js`。
- 智能体：`server/agent-core.mjs`；HTTP与静态服务：`server/agent-server.mjs`。
- 离线页：构建生成的`dist/downloads/agent.html`。
- `npm run check:agent`验证课程检索、独立t尾公式、工具循环、未配置状态、错误处理、密钥隔离、跨域与访问控制。
- `npm run check`同时运行原13项课程和智能体检查。

接口依据：[DeepSeek首次调用](https://api-docs.deepseek.com/)、[DeepSeek工具调用](https://api-docs.deepseek.com/guides/tool_calls/)。默认采用官方文档中的非思考模式工具调用方式，模型名称由环境变量配置。

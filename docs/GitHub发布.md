# GitHub 发布

目标仓库：`Lidong-Huang/plant-nutrition-lab`。

1. 在 GitHub 新建公开仓库 `plant-nutrition-lab`。
2. 上传本目录的完整内容，包含 `.github/workflows/pages.yml`、`scripts/` 和 `dist/`；主分支使用 `main`。`.openai/hosting.json` 仅供 Sites 托管识别，GitHub Pages 不依赖它。
3. 在仓库 Settings → Pages → Build and deployment，把 Source 设为 **GitHub Actions**。
4. 在 Actions 中运行 `Deploy teaching resources to GitHub Pages`，或推送一次新提交触发部署。
5. 成功后，Actions 的 github-pages 环境会显示正式网址。预期入口为 `https://lidong-huang.github.io/plant-nutrition-lab/`。

README 中的课程链接以此预期地址编写；部署成功前不能作为已上线的证明。以后只需更新并推送，Actions 会生成课件、校验链接并发布 `dist/`。

若用命令行，先完成 GitHub 登录，再在本目录执行：

```powershell
git init -b main
git add .
git commit -m "Add plant nutrition interactive teaching resources"
git remote add origin https://github.com/Lidong-Huang/plant-nutrition-lab.git
git push -u origin main
```

若本目录已有 Git 仓库或 origin，请先检查 `git status` 与 `git remote -v`，不要重复初始化或覆盖现有远程。

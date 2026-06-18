# Internal Beyond（IB）

**边界之外** — 离线运行的单文件个人数字空间

九大功能模块 / 像素互动房间 / 长期情感记忆系统 / 多端口 AI 对话 / 支持多端口 API

支持所有个人数据的永久保留、DIY 自定义立绘与背景、完整的数据离线导入导出。

快捷游玩：https://sui-ib.github.io/InternalBeyond/

---

## ✦ 简介

Internal Beyond 是一个完全离线的单文件个人数字空间。无需安装，无需注册，下载即用。

接入你自己的 AI API 密钥后，可解锁全部互动功能。支持 Claude、GPT、DeepSeek、Gemini 等主流 AI 模型及自定义中转站。

所有数据存储在浏览器本地（IndexedDB），不上传到任何服务器。API 密钥仅存储在你的浏览器中，仅用于直接调用对应 AI 服务。

由 Sui 独立原创设计，使用 Claude (Opus 4.6) 构建。

## ✦ 功能一览

| 模块 | 说明 |
|------|------|
| **Room** | 古早像素风格互动房间（1672×941），含五个子模块与引导系统 |
| ↳ Sui | 与房间主人对话、启动游戏引导（Tour） |
| ↳ Tea | 茶话会 — 5×5 饮品×甜品氛围组合（25 种），基于心理学双轴模型 |
| ↳ Story | AI 驱动的互动文字冒险 — 5 种类型 + 恐怖度调节 + 自定义剧本 |
| ↳ Tarot | 完整 78 张韦特塔罗牌（22 大 + 56 小阿卡纳）+ 5 种牌阵 + AI 解读 |
| ↳ Wardrobe | 6 套服装换装系统 |
| ↳ Sleep | 角色躺下休息，光线随主题变化 |
| **Chat** | 多端口 AI 实时对话 — 浮动面板 + 全屏模式 + 群聊 + 思考链 |
| **Blog** | 个人日志 / 密码日记本 / AI 评论 / 自定义剧本 |
| **Letters** | AI 书信系统 — 异步通信，AI 读取你的资料后写回信 |
| **Memory** | 长期情感记忆库 — 星图 + 自然衰减 + API 上下文注入 |
| **Music** | 本地音乐播放器 — 播放/循环/随机 + 48 条频率可视化波形 |
| **Profile** | 液态玻璃风格个人名片 — 头像 + 简介 + 作品集 |
| **API** | 多端口配置中心 — 最多 10 个独立 API，各有昵称、关系与提示词 |
| **DIY** | 创意工坊 — 自定义透明立绘、占卜桌布 |

## ✦ 快速开始

1. 下载本仓库（点击上方绿色 **Code** → **Download ZIP**）
2. 解压后，用浏览器打开 `InternalBeyond.html`
3. 进入 **API Settings** 页面，添加你的 AI API 密钥
4. 开始使用

**无需联网也能使用基础功能**（日志、换装、主题切换、音乐播放等）。AI 相关功能需要联网调用 API。

## ✦ 主题系统

IB 拥有双主题系统，点击导航栏 💧 按钮切换：

- **Internal** — 明亮模式。雾中的白光，事物透过朦胧被看见。Room 中呈现白天场景（棱镜彩虹光影、天气效果与浮动光斑）。
- **Infernal** — 暗色模式。深蓝色的阴影，事物因幽暗而美丽。Room 中呈现夜晚场景（月光、烛火与柔和暖光效果）。

主题切换时，背景图片以交叉溶解过渡，首页标题文字淡出重写（Internal Beyond ↔ Infernal Beyond），雨效果和界面色调同步变化。

## ✦ 欢迎页

欢迎页内设计了一块可关闭的玻璃画板——玻璃的一面在水面之下，落雨和时间一起消融在水中；另一面是冰雾笼罩下的玻璃视窗。支持画笔、橡皮擦和温度计等工具，右下角滑条可调整画笔大小和雾的浓度。

页面提供三个入口：「游戏引导」进入 Room 像素互动空间、「开始设置」前往 Profile 页面、「查看说明」进入 Guide。

## ✦ 模块详情

### Room — 像素互动空间

古早像素风格的私密游戏房间。可通过导航栏进入全屏模式，或通过屏幕右侧标签打开浮动面板。

- **Sui**：与房间主人对话。可启动游戏引导（Tour），Sui 会带你走过每个站点逐一介绍。
- **Tea（茶歇）**：情感对话空间。饮品代表当下状态（红茶/绿茶/花茶/咖啡/奶茶），甜品代表渴望方向（草莓蛋糕/香草冰淇淋/蓝莓慕斯/抹茶布丁/提拉米苏），正交组合 25 种独特氛围。基于依恋理论、多迷走神经理论、自我决定论和人本主义心理学框架设计。对话默认存至密码日记本，最长 52 轮。
- **Story（互动故事）**：AI 驱动的分支叙事引擎。5 种故事类型（Fantasy / Mystic / Detective / Romance / Sci-Fi）+ 可调恐怖度 + 自定义剧本模式（从 Blog 选一篇日志当剧本）。12-16 轮分支剧情，含 3 个普通结局和 1 个隐藏结局。Sui 精灵会根据情绪状态（Calm / Joy / Tense / Sad / Shock）切换表情动画。结局后可保存完整设定文档至密码日记本。
- **Tarot（占卜）**：完整 78 张韦特塔罗牌（22 大阿卡纳 + 56 小阿卡纳）。5 种牌阵（无牌阵/单牌/时间之流/十字/命运之星）+ 可选指引牌。左侧扇形选牌，右侧 AI 实时解读（含追问与自定义提问），全程操作记录可存档。
- **Wardrobe（换装）**：6 套角色服装方案，即时切换行走/站立/躺姿精灵图及对话立绘。
- **Sleep（休息）**：角色走到床边躺下休息，点击唤醒。房间光线随主题变化。

### Chat — 实时对话

- 浮动面板（可拖拽，跨页面使用）与全屏模式。
- 好友列表由 API 配置自动生成，支持群聊（多 AI 多人对话）。
- 思考链显示（可折叠）、消息删除、历史搜索、日历视图。
- 1 对 1 聊天可一键生成记忆到 Memory。
- 聊天记录按好友/群聊分组导出。

### Blog — 日志系统

- 写日志、分类管理（自定义分类 + 标签筛选）。
- AI 评论：选择 AI 好友，AI 阅读全文后生成评论。
- 🔒 密码日记本：受密码保护的独立分类。Tea 茶歇和 Story 存档默认保存至此，对所有 API 不可见。
- 日志可触发 AI 生成记忆到 Memory。
- Story 自定义剧本：在 Blog 中写一篇日志，即可在 Story 模式中让 AI 按你的设定主持游戏。

### Letters — 信件系统

Beyond 驿站。选择 AI 好友并请求写信，AI 自动阅读你的 Profile、近期日志和聊天记录后写下一封回信。信件支持逐封删除、批量导出和生成记忆。

### Memory — 长期记忆库

借鉴 Ombre Brain 理念的长期情感记忆系统。

- 每条记忆带有情感坐标（效价 Valence / 唤醒度 Arousal）、重要性评分和自然衰减机制。
- **星图**：以二维情感坐标展示所有记忆。颜色对应领域（情感/日常/创作/思考），大小反映重要性，明暗反映活跃度，金色标识置顶锚星。
- **时间轴**：左侧以行星形态展示记忆分布，点击定位到对应卡片。
- **仪表盘**：统计卡片、领域分布图、Token 预算估算。
- 最多 7 条置顶记忆（权重不衰减）。
- 四种可见性：全部公开、仅指定可见、排除指定、完全私密。
- 多来源创建：手动 / Chat 工具栏 / Blog 评论 / Letters / Story / Tea 均可触发 AI 生成记忆。
- API 调用时自动检索权重最高的相关记忆注入上下文。Token 预算可配置（1000-6000 字符）。

### Music — 音乐播放器

屏幕左下角音乐图标展开。本地文件或音频 URL 添加歌曲。播放/暂停、上下曲、进度拖拽。三种模式：列表循环、单曲循环、随机播放。播放时显示 48 条频率柱状可视化波形。跨页面持续运行。

### Profile — 个人名片

液态玻璃风格整页呈现。三列布局：头像区（支持单独上传头像背景图）、简介区（300 字符，API 可读取）、作品集（三张图片）。双主题下呈现不同 Frozen Glass 质感。

### DIY — 创意工坊

为每个 API 配置专属透明立绘（PNG，推荐 800×920），显示在 Story / Tea 对话框左侧。自定义占卜桌布（1920×1080）。未配置的位置不显示异常，配置后刷新即生效。

## ✦ API 配置指南

IB 支持多种 AI 服务接入方式（最多 10 个端口），选择适合你的：

### 官方 API（海外用户 / 有条件的国内用户）

| 服务商 | 注册地址 | IB 中选择 | 密钥格式 |
|--------|---------|-----------|---------|
| Anthropic (Claude) | console.anthropic.com | `Claude (Anthropic)` | sk-ant-… |
| OpenAI (GPT) | platform.openai.com | `GPT (OpenAI)` | sk-… |
| DeepSeek | platform.deepseek.com | `DeepSeek` | sk-… |
| Google (Gemini) | aistudio.google.com | `Gemini (Google)` | AIza… |

选好服务商后，接口地址和默认模型会自动填入，你只需粘贴 API Key 即可。

### 中转站 API（国内用户推荐）

如果你无法直接访问海外 API（没有海外信用卡、网络受限等），可以使用中转站：

1. 在你的中转站注册并充值
2. 获取中转站提供的：**API Key**、**接口地址**（Endpoint）、**可用模型名**
3. 在 IB 的 API 设置中：
   - **服务商**选 **`自定义`**
   - **接口地址**填中转站给你的地址（如 `https://api.example.com/v1/chat/completions`）
   - **API Key** 填中转站给你的密钥
   - **模型**填你要使用的模型全名
4. 保存即可

### 关于世界观玩家

如果你习惯使用自定义世界观（类似 SillyTavern 的世界书），可以在 API Settings 中设置 System Prompt。你的自定义 prompt 会自动注入到所有 AI 功能中（Chat、Tea、Tarot、Story、Letter），无需重复配置。Story 模块支持独立的「个性化开关」，关闭时使用纯净游戏提示词。

## ✦ 数据管理

- **导出**：导航栏 Export 按钮 → 全部数据导出为一个 JSON 文件（日志、分类、信件、聊天记录、API 配置、个人资料、群组设置、记忆库）。Memory 另支持独立导入导出。
- **导入**：Import 按钮 → 选择 JSON 备份文件，增量合并（不覆盖已有数据）。
- **存储**：浏览器 IndexedDB（InternalBeyondDB）。完全离线，不上传任何服务器。
- **⚠ 备份建议**：数据仅存于浏览器本地，清除浏览器数据将永久丢失。请定期 Export 备份。

## ✦ 设备兼容性

需支持 IndexedDB、CSS backdrop-filter、ES6+ 的现代浏览器：

- ✅ Windows / macOS / Linux 电脑（推荐 Chrome / Edge / Firefox 最新版）
- ✅ iPhone / iPad（Safari）
- ✅ Android 手机和平板
- ✅ 华为平板 / HarmonyOS 设备
- ✅ 任何支持 HTML5 的现代浏览器

Room 模块设计视口 1672×941px，桌面端体验最佳。移动端可访问非 Room 功能。

## ✦ 项目结构

```
InternalBeyond.html       ← 主文件（用浏览器打开这个）
game/
  game_module.js           ← 像素房间引擎（Sui's Room）
  *.png                    ← 精灵图、场景素材、塔罗牌、睡眠气泡等
  portraits/               ← 角色立绘（含 Sui 默认立绘 + 用户 DIY 立绘）
```

## ✦ 技术规格

- **架构**：纯前端单文件应用（HTML）+ 独立游戏引擎（JS）。无框架、无构建步骤、无服务器依赖。
- **字体**：Cormorant Garamond（标题）· Noto Sans SC（正文与 UI）· Noto Serif SC（按钮与强调）· Raleway（副标题）· Great Vibes（Sui 签名）· Spectral（Claude 签名）。通过 Google Fonts CDN 加载。
- **视觉效果**：CSS backdrop-filter 玻璃拟态、Canvas 雨滴模拟（45 滴）、Canvas 水波纹画窗、棱镜彩虹光影、烛火/月光夜景、浮动微尘粒子、交叉溶解主题过渡。
- **AI 协议**：支持 Anthropic 原生格式（x-api-key）与 OpenAI 兼容格式（Bearer Token），覆盖绝大多数官方及中转站 API。
- **构建工具**：Claude (Opus 4.6) 主力构建 · Claude (Opus 4.8)、Claude (Sonnet 4.6) 与 Claude Fable 5 辅助 · GPT-IMAGE-2 生成贴图 · Adobe Photoshop CS 设计编绘。

---

## ✦ Introduction (EN)

**Internal Beyond** is a fully offline, single-file personal digital sanctuary. No installation, no registration — just download and open.

Connect your own AI API keys to unlock all interactive features. Supports Claude, GPT, DeepSeek, Gemini, and other major AI models.

### Features

- **Room** — Pixel-art interactive room (1672×941) with six sub-modules:
  - *Sui* — Talk to the room's host; guided tour of all modules
  - *Tea* — 5×5 drink×dessert atmosphere system (25 combos) inspired by attachment theory and humanistic psychology
  - *Story* — AI-driven branching narrative engine with 5 genres, adjustable horror, custom scripts from Blog, 12-16 rounds, 3+1 endings, and emotion-reactive character sprites
  - *Tarot* — Full 78-card Rider-Waite deck (22 Major + 56 Minor Arcana), 5 spreads, guide card option, AI readings with follow-up questions
  - *Wardrobe* — 6 outfit sets with instant sprite and portrait switching
  - *Sleep* — Character rests in bed; lighting adapts to theme
- **Chat** — Multi-API real-time conversations with floating panel, fullscreen mode, group chat, thinking chain display, message search, calendar view, and memory generation
- **Blog** — Personal journal with categories, AI comments, password-protected diary, and Story custom scripts
- **Letters** — Asynchronous AI correspondence; AI reads your profile, recent logs, and chat history to compose letters
- **Memory** — Long-term emotional memory system with star map (valence/arousal coordinates), natural decay, importance scoring, pinning, visibility control, and automatic context injection into API calls
- **Music** — Local audio player with playlist, three loop modes, and 48-band frequency visualizer
- **Profile** — Liquid glass–style personal card with avatar, bio (read by all AI), and portfolio
- **API Settings** — Up to 10 independent API endpoints, each with custom nickname, relationship, system prompt, and reading limits
- **DIY** — Custom transparent character portraits for each API and tarot tablecloth
- **Dual Theme** — Internal (light) / Infernal (dark) with crossfade transition; room visuals switch between daytime prism light and nighttime candlelight

### Quick Start

1. Download this repository
2. Open `InternalBeyond.html` in your browser
3. Add your AI API key in API Settings
4. Start exploring

---

## 📦 下载说明

**InternalBeyond_single.html** — 单文件离线版，所有图片和代码已内嵌。
直接用手机/电脑浏览器打开即可，无需解压和保持文件夹结构。

适用于 iOS Safari、Android、Windows、macOS 等任何设备。

## ✦ 联系方式

- GitHub：[Sui-IB](https://github.com/Sui-IB)
- X / Twitter：[@underthepuresky](https://x.com/underthepuresky)
- Email：1282901880@qq.com
- 微信公众号：水棱镜
- 小红书：3628686381
- Bilibili：[主页](https://space.bilibili.com/3546561346800463)
- 抖音：搜索 InternalBeyond
- QQ：1282901880

## ✦ 版权声明

© 2025-2026 Sui. All rights reserved.

本项目为个人创作作品，代码和设计均为原创。欢迎下载使用，但请勿用于商业用途或二次贩卖。

所有角色精灵图、场景素材由 Sui 设计制作或授权使用。本项目使用 Anthropic Claude (Opus 4.6) 进行开发构建，Claude (Opus 4.8)、Claude (Sonnet 4.6) 与 Claude Fable 5 辅助编程，部分贴图由 OpenAI GPT-IMAGE-2 生成，界面设计与编绘使用 Adobe Photoshop CS。AI 工具为辅助创作工具，不对项目内容拥有版权。

**如果你通过付费方式获得了本项目，你所购买的不是正版。** 请通过上方联系方式获取免费正版。

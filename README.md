# Internal Beyond（IB）

一个离线运行的单文件个人网站项目，旨于维系情感的连续性。

该项目包含十大功能模块与两套视觉主题，支持同时对接多个AI模型。

所有数据储存在本地，不依赖任何网络服务器。个人资料、角色立绘、系统提示词等均可自定义。

**本项目永久免费开源。**

> **作者留言**
>
> IB压缩版.html 的数据可以与电脑端共享，支持导入/导出电脑端的用户数据。压缩版用于手机运行与聊天，砍掉了 Room、Music 和 Profile 的视觉效果。
> 完整版为InternalBeyond.html。下载压缩包后→解压打开即可游玩。

---

## ✦ 开始游戏

1. 下载本仓库（点击上方绿色 **Code** → **Download ZIP**）
2. 解压后，用浏览器打开 `InternalBeyond.html`
3. 进入 **API Settings** 页面，添加你的 AI API 密钥
4. 开始使用

无需联网也能使用基础功能（日志、换装、主题切换、音乐播放等）。AI 相关功能需要联网调用 API。

## ✦ 功能一览

| 模块 | 说明 |
|------|------|
| **Room** | 像素互动房间（1672×941），含 Sui 对话、茶歇、互动故事、塔罗占卜、换装、休息六个子模块 |
| **Chat** | 多端口 AI 实时对话 — 浮动面板 + 全屏 + 群聊 + 思考链 + 小窗陪伴模式 |
| **Blog** | 日志 / 密码日记本 / AI 评论 / 自定义剧本 |
| **Letters** | AI 书信 — 异步通信，AI 读取你的资料后写回信 |
| **Memory** | 长期情感记忆库 — 星图可视化 + 自然衰减 + API 上下文自动注入 |
| **Music** | 本地音乐播放器 + 48 条频率可视化波形 |
| **Profile** | 液态玻璃风格个人名片 — 头像 + 简介 + 作品集 |
| **API** | 多端口配置中心 — 最多 10 个独立 API，各有昵称、关系与提示词 |
| **ICode** | AI 代码工作区 — 文件管理 + 预览 + 内联编辑 + 搜索定位 + 脚本沙箱运行 |
| **DIY** | 自定义透明立绘、MCP服务器、沙箱扩展、外部工具调用 |

## ✦ 主题系统

点击导航栏水滴按钮切换：

- **Internal** — 明亮模式。Room 中呈现白天场景（棱镜彩虹光影、天气效果与浮动光斑）。
- **Infernal** — 暗色模式。Room 中呈现夜晚场景（月光、烛火与柔和暖光效果）。

背景图片以交叉溶解过渡，首页标题淡出重写，雨效果和界面色调同步变化。

## ✦ 模块详情

### Room — 像素互动空间

可通过导航栏进入全屏模式，或通过屏幕右侧标签打开浮动面板（支持缩放与拖拽）。浮动面板支持 Mini 小窗模式——缩成可拖拽的小窗悬浮于屏幕角落，适合在浏览其他页面时让 Sui 挂在一旁陪伴。

- **Sui**：与房间主人对话，可启动游戏引导（Tour）。
- **Tea**：情感对话空间。饮品 × 甜品正交组合 25 种独特氛围，基于依恋理论、多迷走神经理论、自我决定论设计。对话默认存至密码日记本，最长 52 轮。
- **Story**：AI 分支叙事引擎。5 种类型 + 可调恐怖度 + 自定义剧本。12-16 轮剧情，含 3 个普通结局和 1 个隐藏结局。
- **Tarot**：78 张韦特塔罗牌，5 种牌阵 + 可选指引牌 + AI 实时解读。全程操作记录可存档。
- **Wardrobe**：6 套服装即时切换。
- **Sleep**：角色躺下休息，点击唤醒。

### Chat — 实时对话

浮动面板与全屏模式。好友列表由 API 配置自动生成，支持群聊。思考链显示、消息删除、历史搜索、日历视图。可一键生成记忆到 Memory。

### Blog — 日志系统

写日志、分类管理、AI 评论。密码日记本受密码保护，Tea 和 Story 存档默认保存至此，对所有 API 不可见。日志可触发 AI 生成记忆。

### Letters — 信件系统

选择 AI 好友请求写信，AI 自动阅读你的 Profile、近期日志和聊天记录后写下回信。

### Memory — 长期记忆库

借鉴GitHub Ombre Brain理念的AI长期记忆系统。每条记忆带有情感坐标（效价 / 唤醒度）、重要性评分和自然衰减。星图以二维情感坐标可视化所有记忆，时间轴以行星形态展示分布。最多 7 条置顶记忆，四种可见性级别。多来源创建（手动 / Chat / Blog / Letters / Story / Tea）。API 调用时自动检索相关记忆注入上下文，Token 预算可配置。

### ICode — AI 代码工作区

对话中 AI 生成、编辑或运行文件时，通过工作区指令完成操作，每一步在聊天中渲染为对应的操作卡片。生成的文件统一存放在 ICode 工作区，点击顶部工具栏的 ICode 按钮即可打开悬浮窗查看和管理。支持文件预览（代码高亮）、内联编辑、文本搜索定位、HTML 渲染预览、脚本沙箱运行（支持超时控制）、项目管理与文件导出。

### DIY — 创意工坊

为每个 API 配置专属透明立绘（PNG，推荐 800×920），显示在 Story / Tea 对话框左侧。自定义占卜桌布（1920×1080）。外部工具功能允许配置 HTTP 接口（如 Home Assistant 的 REST API），启用后 AI 可在对话中调用。游戏文件夹内置一张测试用立绘 `portrait_[Cluade].png`，将 API 昵称改为括号内名称即可测试。

## ✦ API 配置指南

IB 支持多种 AI 服务（最多 10 个端口）：

### 官方 API

| 服务商 | 注册地址 | IB 中选择 | 密钥格式 |
|--------|---------|-----------|---------|
| Anthropic (Claude) | console.anthropic.com | `Claude (Anthropic)` | sk-ant-… |
| OpenAI (GPT) | platform.openai.com | `GPT (OpenAI)` | sk-… |
| DeepSeek | platform.deepseek.com | `DeepSeek` | sk-… |
| Google (Gemini) | aistudio.google.com | `Gemini (Google)` | AIza… |

选好服务商后，接口地址和默认模型会自动填入，粘贴 API Key 即可。

### 中转站 API（国内用户推荐）

无法直接访问海外 API 时，可使用中转站：

1. 在中转站注册并充值
2. 获取 API Key、接口地址（Endpoint）、可用模型名
3. IB 的 API 设置中：服务商选 **自定义**，填入上述信息
4. 保存即可

### 关于世界观玩家

在 API Settings 的 System Prompt 中设置自定义世界观，会自动注入到所有 AI 功能中。Story 模块支持独立的个性化开关。

## ✦ 数据管理

- **导出**：导航栏 Export → 全部数据导出为 JSON 文件。Memory 另支持独立导入导出。
- **导入**：Import → 选择 JSON 备份文件，增量合并不覆盖。
- **存储**：浏览器 IndexedDB，完全离线。
- **⚠ 备份建议**：数据仅存于浏览器本地，清除浏览器数据将永久丢失。请定期备份。

## ✦ 设备兼容性

需支持 IndexedDB、CSS backdrop-filter、ES6+ 的现代浏览器。

- ✅ Windows / macOS / Linux（推荐 Chrome / Edge / Firefox）
- ✅ iPhone / iPad（Safari）
- ✅ Android / 华为 / HarmonyOS
- Room 模块设计视口 1672×941px，桌面端体验最佳。移动端可访问非 Room 功能。

## ✦ 项目结构

```
InternalBeyond.html       ← 主文件（浏览器打开这个）
IB压缩版.html              ← 手机版（与电脑端共享数据）
game/
  game_module.js           ← 像素房间引擎
  *.png                    ← 精灵图、场景素材
  portraits/               ← 角色立绘（含默认 + 用户 DIY）
```

## ✦ 技术规格

- **架构**：纯前端单文件 HTML + 独立游戏引擎 JS。无框架、无构建、无服务器。
- **字体**：Cormorant Garamond · Noto Sans SC · Noto Serif SC · Raleway · Great Vibes · Spectral（Google Fonts CDN）。
- **视觉**：CSS 玻璃拟态、Canvas 雨滴（45 滴）与水波纹、棱镜光影、烛火月光、浮动微尘、交叉溶解过渡。
- **AI 协议**：Anthropic 原生格式 + OpenAI 兼容格式，覆盖官方及中转站 API。
- **构建**：Claude (Opus 4.6) 构建 · Opus 4.8 / Sonnet 4.6 / Fable 5 参与辅助构建 · GPT-IMAGE-2 贴图 · Adobe Photoshop CS 设计编绘。

---

## ✦ Introduction (EN)

**Internal Beyond** is a fully offline, single-file personal website with multi-AI support. Ten modules, two visual themes, all data stored locally. Free and open source.

Connect your own AI API keys to unlock all interactive features. Supports Claude, GPT, DeepSeek, Gemini, and custom relay endpoints.

### Features

- **Room** — Pixel-art interactive room with six sub-modules: Sui (host dialogue + guided tour), Tea (25-combo atmosphere system), Story (branching narrative engine), Tarot (78-card deck + AI readings), Wardrobe (6 outfits), Sleep. Includes Mini pet window mode.
- **Chat** — Multi-API conversations with floating panel, fullscreen, group chat, thinking chain, and memory generation.
- **Blog** — Journal with categories, AI comments, password diary, and Story custom scripts.
- **Letters** — Asynchronous AI correspondence.
- **Memory** — Long-term emotional memory with star map, natural decay, and automatic context injection.
- **Music** — Local audio player with 48-band frequency visualizer.
- **Profile** — Liquid glass personal card.
- **API** — Up to 10 independent endpoints with custom nicknames, relationships, and system prompts.
- **ICode** — AI code workspace with file management, inline editing, search, HTML preview, and sandboxed script execution.
- **DIY** — Custom character portraits, tarot tablecloth, and external tool integration (HTTP webhooks).
- **Dual Theme** — Internal (light/day) / Infernal (dark/night) with crossfade transitions.

### Quick start

1. Download this repository
2. Open `InternalBeyond.html` in your browser
3. Add your AI API key in API Settings
4. Start exploring

---

## ✦ 联系方式

- GitHub：[Sui-IB](https://github.com/Sui-IB)
- X / Twitter：[@underthepuresky](https://x.com/underthepuresky)
- Email：1282901880@qq.com
- 小红书：3628686381
- Bilibili：[主页](https://space.bilibili.com/3546561346800463)

## ✦ 版权声明

© 2025-2026 Sui. All rights reserved.

本项目为个人创作作品，代码和设计均为原创。欢迎下载使用，请勿用于商业用途或二次贩卖。

所有角色精灵图、场景素材由 Sui 设计制作。本项目使用 Anthropic Claude (Opus 4.6) 进行开发构建，Claude (Opus 4.8)、Claude (Sonnet 4.6) 与 Claude Fable 5 辅助编程，部分贴图由 OpenAI GPT-IMAGE-2 生成，界面设计与编绘使用 Adobe Photoshop CS。AI 工具为辅助创作工具，不对项目内容拥有版权。本声明适用于项目的所有版本与衍生形式。

**如果你通过付费方式获得了本项目，你所购买的不是正版。** 请通过上方联系方式获取免费正版。

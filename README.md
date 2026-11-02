# InkFlow CMS · 说明文档

> 个人博客内容管理平台 —— 基于 Vue 3 + Vite 的纯前端演示项目（数据由 Mock.js 在浏览器内模拟，无需后端）。

---

## 1. 项目简介

InkFlow CMS 是一个**面向个人博主**的内容管理后台（CMS）。它围绕「文章、分类、标签、评论、系统设置」五大核心对象，提供完整的增删改查（CRUD）与可视化数据看板，适合作为课程设计、前端架构学习或后台模板二次开发的起点。

项目最大特点是**零后端依赖**：通过 [Mock.js](https://github.com/nuysoft/Mock) 拦截全部 `/api/*` 请求，并内置一个可持久化到 `localStorage` 的内存数据库（`mock/db.js`），因此数据在刷新页面后依然保留，实现了「可交互、可改、可存」的演示效果。

---

## 2. 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Vue 3（`<script setup>` 语法 + Composition API） |
| 构建工具 | Vite 5 |
| UI 组件库 | Element Plus 2.8 + `@element-plus/icons-vue` |
| 路由 | Vue Router 4（history / hash 模式自适应） |
| 状态管理 | Vuex 4（模块化 `user` store） |
| 图表 | ECharts 5（封装为 `VChart` 通用组件） |
| 数据模拟 | Mock.js 1.1 + 自研内存数据库 |
| 工具库 | axios（请求）、dayjs（日期格式化）、sass（样式） |
| 部署 | Vercel（`vercel.json`）+ 可选 GitHub Pages 子路径部署 |

---

## 3. 功能模块

| 模块 | 路由 | 主要功能 |
| --- | --- | --- |
| 登录 | `/login` | 账号密码登录（任意非空账号密码均可登录，演示账号 `admin / 123456`），登录态持久化，路由守卫拦截未授权访问 |
| 仪表盘 | `/dashboard` | 欢迎横幅、统计卡片、近 6 个月文章发布趋势（折线）、分类占比（饼图）、热门文章 Top5（条形）、最近评论 |
| 文章管理 | `/article` | 文章列表（分页 + 关键词/分类筛选）、新增/编辑（抽屉或弹窗表单）、删除、发布/草稿状态切换 |
| 分类管理 | `/category` | 分类的增删改查 |
| 标签管理 | `/tag` | 标签的增删改查（含颜色标记） |
| 评论管理 | `/comment` | 评论列表、审核通过/拒绝、删除（按 待审核/已通过/已拒绝 状态流转） |
| 系统设置 | `/settings` | 站点名称/描述、博主昵称/简介、评论与注册开关等 |

所有模块均接入统一的请求层与 Mock 接口，交互行为（加载态、消息提示、确认弹窗）一致。

---

## 4. 目录结构

```
lin-cms-vue/
├── public/                      # 静态资源（favicon 等）
├── src/
│   ├── api/                     # 接口封装层（axios 实例 + 各模块接口）
│   │   ├── index.js             # axios 实例、请求/响应拦截器
│   │   ├── article.js           # 文章   GET/POST/PUT/DELETE/PATCH
│   │   ├── category.js          # 分类
│   │   ├── tag.js               # 标签
│   │   ├── comment.js           # 评论
│   │   ├── dashboard.js         # 看板统计
│   │   ├── settings.js          # 系统设置
│   │   └── user.js              # 登录、用户信息
│   ├── components/              # 全局通用组件
│   │   ├── VChart.vue           # ECharts 通用封装（自适应、销毁）
│   │   └── PageHeader.vue       # 页面标题栏
│   ├── layout/                  # 整体布局
│   │   ├── index.vue            # 侧边栏 + 顶栏 + 路由出口（带切换动画）
│   │   └── components/
│   │       ├── Sidebar.vue      # 侧边菜单（从路由表自动生成）
│   │       ├── AppHeader.vue    # 面包屑 + 刷新 + 用户下拉（退出登录）
│   │       └── Logo.vue         # 品牌 Logo
│   ├── mock/                    # 数据模拟层
│   │   ├── index.js             # 统一注册所有 mock 模块
│   │   ├── db.js                # 内存数据库 + localStorage 持久化
│   │   ├── util.js              # 解析请求、响应封装、分页、自增 ID
│   │   ├── data.js              # 种子数据（分类/标签/昵称/评论/正文模板）
│   │   └── *.js                 # 各业务模块 mock 接口
│   ├── router/
│   │   └── index.js            # 路由表、守卫、动态标题
│   ├── store/
│   │   ├── index.js            # Vuex 根 store
│   │   └── modules/user.js     # 用户状态（token / userInfo，localStorage 持久化）
│   ├── styles/
│   │   └── index.scss          # 全局样式 + Element Plus 主题变量覆盖 + 设计令牌
│   ├── utils/
│   │   └── format.js           # 日期格式化、文本截断、头像文字
│   ├── views/                   # 页面级组件（均懒加载）
│   │   ├── login/
│   │   ├── dashboard/           # index.vue + components/（5 个图表子组件）
│   │   ├── article/             # index.vue + ArticleFormDialog.vue
│   │   ├── category/
│   │   ├── tag/
│   │   ├── comment/
│   │   └── settings/
│   ├── App.vue                  # 根组件（仅路由出口）
│   └── main.js                  # 入口：挂载插件、注册图标、引入 mock 与样式、移除首屏加载屏
├── index.html                   # 首屏品牌化加载动画（splash）
├── vite.config.js               # Vite 配置（@ 别名、base 自适应、端口 3000）
├── vercel.json                  # SPA 重写（所有路径回退 index.html）
└── package.json
```

---

## 5. 快速开始

### 环境要求
- Node.js ≥ 18
- 包管理器：npm（或 yarn / pnpm）

### 安装依赖
```bash
cd lin-cms-vue
npm install
```

### 本地开发
```bash
npm run dev        # 启动开发服务器，默认 http://localhost:3000，自动打开浏览器
```

### 构建与预览
```bash
npm run build      # 生成 dist/ 生产包
npm run preview    # 本地预览构建产物
```

> 登录提示：演示账号 `admin / 123456`，任意非空用户名+密码也可登录。

---

## 6. 架构说明

### 6.1 请求与响应约定
- 所有请求统一走 `src/api/index.js` 中的 axios 实例，`baseURL` 为 `/api`。
- **请求拦截器**：自动携带 `Authorization: Bearer <token>`。
- **响应拦截器**：约定后端返回 `{ code, message, data }`，`code === 200` 时解包返回 `data`，否则用 `ElMessage` 统一报错。
- 各业务接口在 `src/api/*.js` 中以语义化函数导出（如 `getArticles`、`createArticle`）。

### 6.2 模拟数据与持久化（核心）
- `src/mock/index.js` 在 `main.js` 中被引入后全局生效，拦截所有 `/api/*` 请求。
- `src/mock/db.js` 维护统一数据源 `db`，并提供 `persistDb()` 将整个库写入 `localStorage`（键名 `inkflow_mock_db_v1`）。
- 首次加载时若无存档，则调用 `seedDb()` 生成种子数据：
  - 8 个分类 / 20 个标签 / 128 篇文章（约 72% 为已发布）/ 50 条评论 / 默认系统设置。
- CRUD 操作直接作用于内存数组并调用 `persistDb()`，因此**增删改在刷新后仍生效**。
- `src/mock/util.js` 提供 `parseBody`、`ok`、`fail`、`paginate`、`nextId`、`matchResourceId` 等工具函数，统一请求解析与响应封装。

> 若要「重置演示数据」，在浏览器控制台执行 `localStorage.removeItem('inkflow_mock_db_v1')` 后刷新即可。

### 6.3 登录与鉴权
- `store/modules/user.js` 管理 `token` 与 `userInfo`，二者均同步写入 `localStorage`（键名 `inkflow_token` / `inkflow_user`），实现刷新不掉线。
- `router/index.js` 的 `beforeEach` 守卫：未登录访问受保护路由时跳转 `/login`（并携带 `redirect` 回跳地址）；已登录访问 `/login` 则跳首页。
- 退出登录由 `AppHeader.vue` 下拉菜单触发，二次确认后 `dispatch('user/logout')` 清除状态并跳转登录页。

### 6.4 布局与路由
- 布局由 `layout/index.vue` 承载：左侧 `Sidebar` 根据路由表 `meta` 自动生成菜单，右侧 `AppHeader` 提供面包屑、刷新、用户信息。
- 路由采用**懒加载**（`() => import(...)`），子路由均挂在 `/` 布局下；`meta.title` 用于面包屑与文档标题，`meta.icon` 对应侧边栏图标。
- 视图切换使用 `fade-slide` 过渡；顶栏「刷新」按钮通过递增 `viewKey` 强制重渲染当前页。

### 6.5 图表封装
- `components/VChart.vue` 对 ECharts 做通用封装：接收 `option` prop，`onMounted` 初始化、`watch` 深度监听 option 变化、`resize` 自适应、`onUnmounted` 销毁实例，避免内存泄漏。
- 仪表盘各图表拆为独立子组件（`StatCards`、`TrendChart`、`CategoryPieChart`、`TopArticlesChart`、`RecentComments`），职责清晰。

### 6.6 主题与样式
- `styles/index.scss` 集中定义 **Element Plus 主题变量**（主色 `#1a73e8` 深蓝）与 **InkFlow 设计令牌**（如 `--ink-bg`、`--ink-card-bg`、`--ink-shadow` 等），全局复用。
- 通用类 `.ink-card`、`.page-container` 与滚动条、表格、弹窗的细节样式在此统一处理。

---

## 7. 部署

### 7.1 路径策略（关键）
`vite.config.js` 根据环境变量 `DEPLOY_TARGET` 切换 `base`：
- 本地开发与 **Vercel**：`base = '/'`（history 模式，URL 美观）。
- GitHub Pages（部署在 `/ink_flow/` 子路径）：`base = '/ink_flow/'`，同时路由自动切换为 **hash 模式**避免子页面刷新 404。

```bash
# GitHub Pages 构建（子路径）
DEPLOY_TARGET=github-pages npm run build

# 默认构建（根路径，Vercel / 自有服务器）
npm run build
```

### 7.2 Vercel
项目根目录已提供 `vercel.json`，将所有未匹配路径重写到 `index.html`（SPA 回退），直接导入仓库即可部署，零额外配置。

---

## 8. 二次开发指引

- **新增页面**：在 `views/` 下创建页面组件 → 在 `router/index.js` 的布局 `children` 中登记（带 `meta.title` / `meta.icon`）→ 侧边栏与面包屑会自动出现。
- **对接真实后端**：删除 `main.js` 中的 `import './mock'`，将 `api/index.js` 的 `baseURL` 改为真实接口地址，并视后端返回结构调整响应拦截器即可。
- **更换主题色**：修改 `styles/index.scss` 中的 `--el-color-primary` 系列与 `--ink-*` 设计令牌。
- **扩展数据模型**：在 `mock/data.js` 添加种子，在 `mock/db.js` 的 `seedDb()` 中初始化，再编写对应 `mock/*.js` 接口与 `api/*.js` 调用。

---

## 9. 常见问题

| 现象 | 原因 / 解决 |
| --- | --- |
| 页面长时间白屏 | 首屏 `index.html` 内置加载屏；若 15 秒未挂载会提示刷新。多为资源加载慢，刷新即可 |
| 改了代码数据没变 | 演示数据已持久化到 `localStorage`，重置请删除键 `inkflow_mock_db_v1` |
| 刷新子页面 404 | 部署在子路径（如 GitHub Pages）需以 `DEPLOY_TARGET=github-pages` 构建，路由会切 hash 模式 |
| 登录态丢失 | 清除浏览器 `localStorage` 中的 `inkflow_token` / `inkflow_user` 后重新登录 |

---

*文档基于仓库当前代码结构生成，覆盖入口、路由、状态、Mock 数据层、布局与部署策略。*

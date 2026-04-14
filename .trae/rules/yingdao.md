# 影刀社区反馈数据看板 - Vue 版项目开发规则

> **项目目标**：基于影刀社区帖子 MySQL 数据库，构建一个前后端分离、交互美观的数据看板。包含核心指标卡、多维度图表分析、原始数据表格展示。前端使用 Vue 3，后端对接本地 MySQL。

---

## 1. 技术栈与环境规范

### 前端
- **框架**：Vue 3 (Composition API 优先) + TypeScript + Vite。
- **UI 组件库**：Element Plus (优先) 或 Ant Design Vue。需保持与报告 `yingdao_community_analysis_report.html` 相似的简约专业风格（背景色 #ffffff，边框 #e9e9e7）。
- **CSS 方案**：Tailwind CSS (必须使用) 配合组件库的 CSS 变量进行微调。
- **图表库**：ECharts 5+ (必须使用，支持响应式)。
- **状态管理**：Pinia (用于全局筛选条件、用户偏好)。
- **HTTP 客户端**：Axios。

### 后端
- **框架**：Node.js + Express.js (TypeScript) 或 Python FastAPI。*推荐使用 Node.js 以便前端开发者快速上手。*
- **数据库驱动**：
  - Node.js: `mysql2` 或 `knex.js`
  - Python: `pymysql` 或 `sqlalchemy`
- **数据库连接信息**：
  - Host: `localhost`
  - Port: `3306`
  - User: `root`
  - Password: `1234`
  - Database: `yingdao_project`

### 开发端口
- 前端：`5173`
- 后端：`3001`

---

## 2. 数据库与数据模型规范

### 2.1 MySQL 表结构 (依据提供的图片)
表名建议：`community_posts`

| 字段名 | 数据类型 | 描述 |
| :--- | :--- | :--- |
| `title` | VARCHAR(64) | 帖子标题 |
| `link` | VARCHAR(128) | 帖子链接 |
| `post_id` | BIGINT | 帖子ID (主键) |
| `author` | VARCHAR(50) | 作者名 |
| `author_link` | VARCHAR(128) | 作者个人页链接 |
| `content` | VARCHAR(4096) | 帖子内容（纯文本） |
| `publish_time` | VARCHAR(50) | 发布时间 (建议后端转为 DATETIME 处理) |
| `views` | VARCHAR(50) | 浏览量 (建议解析为 INT) |
| `question_type` | VARCHAR(50) | 问题类型 |
| `attitude` | VARCHAR(50) | 作者态度 (积极/中性/消极) |

### 2.2 后端数据清洗要求
- `publish_time` 字段需转换为标准 ISO 字符串格式输出。
- `views` 字段需提取数字部分（如 “16浏览” -> 16）。
- 必须提供分页查询接口，默认每页 20 条。

---

## 3. 后端 API 设计规范

必须实现以下 RESTful 端点：

| 端点 | 方法 | 描述 | 返回示例 |
| :--- | :--- | :--- | :--- |
| `/api/posts` | GET | 分页查询帖子，支持 `?type=xxx&attitude=xxx&page=1&limit=20` | `{ list: [], total: 100 }` |
| `/api/stats/overview` | GET | 返回 KPI 数据 | `{ total: 100, negativeRate: 38, topType: '界面/窗口操作', topViews: 241 }` |
| `/api/stats/distribution` | GET | 返回问题类型分布及情绪交叉数据 | `{ types: [...], crossData: [...] }` |
| `/api/stats/wordcloud` | GET | 返回高频词及权重 (需后端使用 `node-segment` 或简单分词) | `[ { name: '循环', value: 34 } ]` |
| `/api/stats/top10` | GET | 返回浏览量最高的10条帖子 | `[ { title, views, link } ]` |

**注意**：所有统计接口应直接从 MySQL 计算得出，不可在前端遍历全量数据。

---

## 4. 前端页面与组件规范

### 4.1 布局结构
- 采用 **顶部导航栏 + 侧边栏菜单（可折叠） + 内容区** 的经典后台布局。
- 移动端侧边栏自动隐藏，通过顶部汉堡按钮呼出。
- 内容区最大宽度 `1400px`，居中显示。

### 4.2 必须包含的可视化模块

| 模块 | 图表类型 | 数据源 | 交互要求 |
| :--- | :--- | :--- | :--- |
| **KPI 指标卡** | 4 个卡片组件 | `/api/stats/overview` | 悬停显示详细说明 |
| **问题类型分布** | 饼图 / 南丁格尔玫瑰图 | `/api/stats/distribution` | 点击扇区可筛选下方表格 |
| **情绪-类型交叉分析** | 堆叠柱状图 | `/api/stats/distribution` | 支持图例切换显示 |
| **高频词云** | ECharts WordCloud | `/api/stats/wordcloud` | 点击词汇高亮相关帖子 |
| **浏览量 Top 10** | 表格 / 横向柱状图 | `/api/stats/top10` | 支持点击标题跳转原帖 |
| **原始帖子表格** | Element Plus Table | `/api/posts` | 支持排序、筛选、分页、导出 CSV |

### 4.3 样式规范
- **KPI 卡片**：沿用报告中的 `kpi-card` 类，背景色区分：蓝(`#e7f0fb`)、绿(`#e9f5e6`)、琥珀(`#fff4e8`)、紫(`#f3ecff`)。
- **态度标签**：
  - 消极：红色背景 `#fbe2e0`，文字 `#c4291c`
  - 中性：灰色背景 `#f1f1ef`，文字 `#787774`
  - 积极：绿色背景 `#e9f5e6`，文字 `#438730`
- **表格行悬停**：背景色 `#f7f6f3`。

---

## 5. 交互与用户体验要求

- **全局加载**：页面初始化时显示骨架屏 (Skeleton)。
- **图表联动**：点击饼图某一类型，自动将下方表格筛选为该类型数据，并更新 URL 参数 (`?type=xxx`)。
- **响应式适配**：
  - 小于 768px 时，KPI 卡片由 4 列变为 2 列或 1 列。
  - 图表容器宽度自适应，ECharts 需监听 `resize` 事件。
- **错误处理**：接口请求失败时，使用 `ElMessage` 提示具体错误，并提供“重试”按钮。

---

## 6. 项目结构与命名规范
project/
├── frontend/ # Vue 3 项目
│ ├── src/
│ │ ├── api/ # Axios 封装及接口定义
│ │ ├── assets/ # 静态资源
│ │ ├── components/ # 通用组件
│ │ │ ├── charts/ # ECharts 封装组件
│ │ │ ├── KpiCards.vue
│ │ │ └── PostTable.vue
│ │ ├── views/ # 主页面 Dashboard.vue
│ │ ├── stores/ # Pinia 状态
│ │ ├── types/ # TypeScript 类型定义
│ │ └── utils/ # 工具函数 (如数字格式化)
│ ├── .env.example # 环境变量模板
│ └── vite.config.ts
│
├── backend/ # Node.js 项目
│ ├── src/
│ │ ├── routes/ # 路由定义
│ │ ├── services/ # 数据库查询服务
│ │ ├── utils/ # 分词工具、日期处理
│ │ └── app.ts # Express 入口
│ ├── .env # 数据库配置 (不提交)
│ └── package.json
│
└── README.md # 启动说明

---

## 7. 环境变量配置

### 前端 `.env.example`
VITE_API_BASE_URL=http://localhost:3001/api
### 后端 `.env.example`
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=yingdao_project
PORT=3001
---

## 8. 交付与验收标准

1. **一键启动**：提供 `npm run dev` (前端) 和 `npm run start` (后端) 命令，无报错运行。
2. **数据真实性**：看板展示的数据必须来自本地 MySQL 数据库中的真实帖子记录（至少包含 50 条以上测试数据）。
3. **风格一致性**：界面整体观感需与参考报告 `yingdao_community_analysis_report.html` 保持高度一致（配色、卡片圆角、字体）。
4. **功能完整性**：
   - 指标卡数字正确。
   - 图表可交互。
   - 表格支持翻页、排序。
   - 响应式布局不崩坏。

---

## 9. 禁止事项 (约束)

- ❌ 禁止在前端直接写死 SQL 语句或数据库连接信息。
- ❌ 禁止使用 `any` 类型逃避 TypeScript 检查（必要时需注释说明）。
- ❌ 禁止在图表渲染时未做防抖导致频繁重绘。
- ❌ 禁止忽略移动端适配，必须保证手机模式下表格可横向滚动。

---
*规则版本：2.0.0 (Vue + MySQL 专版) | 制定日期：2026-04-13 | 适用于 Trae IDE*
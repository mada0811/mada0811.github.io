# 影刀社区反馈数据看板

## 项目简介
基于影刀社区帖子 MySQL 数据库，构建的前后端分离、交互美观的数据看板。包含核心指标卡、多维度图表分析、原始数据表格展示。

## 技术栈
- **前端**：Vue 3 + TypeScript + Vite + Element Plus + ECharts
- **后端**：Node.js + Express + TypeScript + MySQL

## 项目结构
```
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
│ │ └── utils/ # 工具函数
│ ├── .env.example # 环境变量模板
│ └── vite.config.ts
│
├── backend/ # Node.js 项目
│ ├── src/
│ │ ├── routes/ # 路由定义
│ │ ├── services/ # 数据库查询服务
│ │ ├── utils/ # 分词工具、日期处理
│ │ ├── app.ts # Express 入口
│ │ └── db.ts # 数据库连接
│ ├── .env # 数据库配置
│ └── package.json
│
└── README.md # 启动说明
```

## 环境要求
- Node.js 16+ 
- MySQL 5.7+

## 数据库配置
1. 确保 MySQL 服务已启动
2. 创建数据库 `yingdao_project`
3. 创建表 `community_posts`，结构如下：

```sql
CREATE TABLE `community_posts` (
  `post_id` BIGINT PRIMARY KEY,
  `title` VARCHAR(64) NOT NULL,
  `link` VARCHAR(128) NOT NULL,
  `author` VARCHAR(50) NOT NULL,
  `author_link` VARCHAR(128) NOT NULL,
  `content` VARCHAR(4096) NOT NULL,
  `publish_time` VARCHAR(50) NOT NULL,
  `views` INT NOT NULL,
  `question_type` VARCHAR(50) NOT NULL,
  `attitude` VARCHAR(50) NOT NULL
);
```

4. 导入测试数据（至少 50 条）

## 项目启动

### 后端启动
1. 进入后端目录
   ```bash
   cd backend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动服务
   ```bash
   npm run start
   ```
   服务将运行在 `http://localhost:3001`

### 前端启动
1. 进入前端目录
   ```bash
   cd frontend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```
   浏览器将自动打开 `http://localhost:5173`

## API 接口

### 帖子相关
- `GET /api/posts` - 分页查询帖子，支持 `?type=xxx&attitude=xxx&page=1&limit=20`

### 统计相关
- `GET /api/stats/overview` - 返回 KPI 数据
- `GET /api/stats/distribution` - 返回问题类型分布及情绪交叉数据
- `GET /api/stats/wordcloud` - 返回高频词及权重
- `GET /api/stats/top10` - 返回浏览量最高的10条帖子

## 功能说明
1. **KPI 指标卡**：显示问题总量、消极情绪占比、TOP1问题类型、最高浏览量
2. **问题类型分布**：饼图展示，点击扇区可筛选下方表格
3. **情绪-类型交叉分析**：堆叠柱状图展示
4. **高频词云**：展示帖子内容中的高频关键词
5. **浏览量 Top 10**：表格展示浏览量最高的10个帖子
6. **原始帖子表格**：支持排序、分页、导出 CSV

## 响应式设计
- 桌面端：4列 KPI 卡片，多列图表布局
- 平板端：2列 KPI 卡片，自适应图表布局
- 移动端：1列 KPI 卡片，图表可横向滚动，表格可横向滚动

## 注意事项
- 确保数据库连接信息正确配置在 `backend/.env` 文件中
- 确保 MySQL 服务已启动并可访问
- 前端默认访问后端 API 地址为 `http://localhost:3001/api`

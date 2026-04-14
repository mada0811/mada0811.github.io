import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './db';
import postsRouter from './routes/posts';
import statsRouter from './routes/stats';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/posts', postsRouter);
app.use('/api/stats', statsRouter);

// 启动服务器
async function startServer() {
  // 测试数据库连接
  const connected = await testConnection();
  if (!connected) {
    console.error('数据库连接失败，服务器无法启动');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
  });
}

startServer();
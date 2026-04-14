import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, attitude, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT * FROM community_posts WHERE 1=1';
    let params: any[] = [];

    // 筛选条件
    if (type) {
      query += ' AND question_type = ?';
      params.push(type);
    }
    if (attitude) {
      query += ' AND attitude = ?';
      params.push(attitude);
    }

    // 分页
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    // 执行查询
    const [posts] = await pool.query(query, params);

    // 转换字段名以匹配前端期望
    const formattedPosts = (posts as any[]).map(post => ({
      '帖子标题': post.title,
      '帖子链接': post.link,
      '帖子ID': post.post_id,
      '作者': post.author,
      '作者个人页链接': post.author_link,
      '帖子内容（文本）': post.content,
      '发布时间': post.publish_time,
      '浏览量': post.views,
      '问题类型': post.question_type,
      '作者态度': post.attitude
    }));

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM community_posts WHERE 1=1';
    let countParams: any[] = [];

    if (type) {
      countQuery += ' AND question_type = ?';
      countParams.push(type);
    }
    if (attitude) {
      countQuery += ' AND attitude = ?';
      countParams.push(attitude);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = (countResult as any)[0].total;

    res.json({ list: formattedPosts, total });
  } catch (error) {
    console.error('查询帖子失败:', error);
    res.status(500).json({ error: '查询失败' });
  }
});

export default router;
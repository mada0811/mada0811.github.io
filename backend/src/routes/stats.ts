import express from 'express';
import pool from '../db';

const router = express.Router();

// 停用词列表
const stopWords = new Set([
  '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '怎么', '为什么', '什么', '哪里', '时候', '如果', '但是', '因为', '所以', '然后', '而且'
]);

// 简单分词函数
function simpleSegment(text: string): string[] {
  // 移除非中文字符
  const chineseText = text.replace(/[^\u4e00-\u9fa5]/g, ' ');
  // 按空格分词
  const words = chineseText.split(/\s+/).filter(word => {
    // 过滤掉停用词和长度小于2的词
    return word.length >= 2 && !stopWords.has(word);
  });
  return words;
}

// 获取概览数据
router.get('/overview', async (req, res) => {
  try {
    // 总帖子数
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM community_posts');
    const total = (totalResult as any)[0].total;

    // 消极情绪占比
    const [negativeResult] = await pool.query('SELECT COUNT(*) as negative FROM community_posts WHERE attitude = ?', ['消极']);
    const negativeCount = (negativeResult as any)[0].negative;
    const negativeRate = total > 0 ? Math.round((negativeCount / total) * 100) : 0;

    // 最多的问题类型
    const [topTypeResult] = await pool.query('SELECT question_type, COUNT(*) as count FROM community_posts GROUP BY question_type ORDER BY count DESC LIMIT 1');
    const topType = (topTypeResult as any)[0]?.question_type || '无';

    // 最高浏览量
    const [topViewsResult] = await pool.query('SELECT MAX(CAST(views AS UNSIGNED)) as maxViews FROM community_posts');
    const topViews = (topViewsResult as any)[0].maxViews || 0;

    res.json({ total, negativeRate, topType, topViews });
  } catch (error) {
    console.error('获取概览数据失败:', error);
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取问题类型分布及情绪交叉数据
router.get('/distribution', async (req, res) => {
  try {
    // 问题类型分布
    const [typesResult] = await pool.query('SELECT question_type, COUNT(*) as count FROM community_posts GROUP BY question_type');
    const types = (typesResult as any[]).map(item => ({
      '问题类型': item.question_type,
      count: item.count
    }));

    // 情绪与类型交叉数据
    const [crossResult] = await pool.query(`
      SELECT question_type, attitude, COUNT(*) as count 
      FROM community_posts 
      GROUP BY question_type, attitude
    `);
    const crossData = (crossResult as any[]).map(item => ({
      '问题类型': item.question_type,
      '作者态度': item.attitude,
      count: item.count
    }));

    res.json({ types, crossData });
  } catch (error) {
    console.error('获取分布数据失败:', error);
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取词云数据
router.get('/wordcloud', async (req, res) => {
  try {
    // 获取所有帖子内容
    const [contentResult] = await pool.query('SELECT content FROM community_posts');
    const contents = (contentResult as any[]).map(item => item.content || '');

    // 分词并统计词频
    const wordCount: Record<string, number> = {};
    contents.forEach(content => {
      const words = simpleSegment(content);
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    });

    // 转换为词云格式并按词频排序
    const wordCloudData = Object.entries(wordCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 100); // 取前100个高频词

    res.json(wordCloudData);
  } catch (error) {
    console.error('获取词云数据失败:', error);
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取浏览量最高的10条帖子
router.get('/top10', async (req, res) => {
  try {
    const [top10Result] = await pool.query(`
      SELECT title, views, link 
      FROM community_posts 
      ORDER BY CAST(views AS UNSIGNED) DESC 
      LIMIT 10
    `);
    const top10 = (top10Result as any[]).map(item => ({
      '帖子标题': item.title,
      '浏览量': item.views,
      '帖子链接': item.link
    }));

    res.json(top10);
  } catch (error) {
    console.error('获取Top10数据失败:', error);
    res.status(500).json({ error: '获取数据失败' });
  }
});

export default router;
import api from './axios'

// 获取帖子列表
export const getPosts = (params: {
  page?: number
  limit?: number
  type?: string
  attitude?: string
}) => {
  return api.get('/posts', { params })
}

// 获取概览数据
export const getOverview = () => {
  return api.get('/stats/overview')
}

// 获取分布数据
export const getDistribution = () => {
  return api.get('/stats/distribution')
}

// 获取词云数据
export const getWordCloud = () => {
  return api.get('/stats/wordcloud')
}

// 获取Top10数据
export const getTop10 = () => {
  return api.get('/stats/top10')
}
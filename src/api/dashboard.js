import service from './index'

/** 顶部统计卡片数据 */
export function getStats() {
  return service.get('/dashboard/stats')
}

/** 文章发布趋势（近 6 个月） */
export function getPublishTrend() {
  return service.get('/dashboard/trend')
}

/** 分类占比 */
export function getCategoryRatio() {
  return service.get('/dashboard/category-ratio')
}

/** 热门文章浏览量 Top5 */
export function getTopArticles() {
  return service.get('/dashboard/top-articles')
}

/** 最近评论 */
export function getRecentComments() {
  return service.get('/dashboard/recent-comments')
}

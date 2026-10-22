import Mock from 'mockjs'
import dayjs from 'dayjs'
import { db } from './db'
import { parseRequest, ok, fail } from './util'

/**
 * 仪表盘 Mock 接口（同一路径按子路径分发，避免同方法同路径重复注册）
 * GET /api/dashboard/stats            顶部统计卡片
 * GET /api/dashboard/trend            近 6 个月文章发布趋势
 * GET /api/dashboard/category-ratio   分类占比
 * GET /api/dashboard/top-articles     热门文章浏览量 Top5
 * GET /api/dashboard/recent-comments  最近评论
 */

Mock.mock(/\/api\/dashboard/, 'get', options => {
  const { path } = parseRequest(options.url)

  // 统计卡片
  if (path === '/api/dashboard/stats') {
    return ok({
      articleCount: db.articles.length,
      categoryCount: db.categories.length,
      tagCount: db.tags.length,
      commentCount: db.comments.length,
    })
  }

  // 近 6 个月发布趋势
  if (path === '/api/dashboard/trend') {
    const months = []
    const counts = []
    for (let i = 5; i >= 0; i -= 1) {
      const month = dayjs().subtract(i, 'month')
      const label = month.format('YYYY-MM')
      months.push(`${month.month() + 1}月`)
      counts.push(
        db.articles.filter(article => dayjs(article.createdAt).format('YYYY-MM') === label).length,
      )
    }
    return ok({ months, counts })
  }

  // 分类占比
  if (path === '/api/dashboard/category-ratio') {
    const ratio = db.categories.map(category => ({
      name: category.name,
      value: db.articles.filter(article => article.categoryId === category.id).length,
    }))
    return ok(ratio)
  }

  // 热门文章 Top5
  if (path === '/api/dashboard/top-articles') {
    const top = [...db.articles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(article => ({ id: article.id, title: article.title, views: article.views }))
    return ok(top)
  }

  // 最近评论（最新 6 条）
  if (path === '/api/dashboard/recent-comments') {
    const recent = [...db.comments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map(comment => {
        const article = db.articles.find(item => item.id === comment.articleId)
        return {
          ...comment,
          articleTitle: article ? article.title : '文章已删除',
        }
      })
    return ok(recent)
  }

  return fail('仪表盘接口不存在')
})

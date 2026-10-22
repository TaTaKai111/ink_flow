import Mock from 'mockjs'
import { db, persistDb } from './db'
import { parseRequest, matchResourceId, parseBody, ok, fail, paginate } from './util'

/**
 * 评论管理 Mock 接口
 * GET    /api/comments            列表（状态筛选 + 昵称搜索 + 分页，含所属文章标题）
 * PUT    /api/comments/:id/audit  审核（通过 / 拒绝）
 * DELETE /api/comments/:id        删除
 */

// 列表
Mock.mock(/\/api\/comments/, 'get', options => {
  const { params } = parseRequest(options.url)
  let list = [...db.comments]
  if (params.status) {
    list = list.filter(item => item.status === params.status)
  }
  if (params.nickname) {
    list = list.filter(item => item.nickname.includes(params.nickname))
  }
  // 关联所属文章标题
  const enriched = list.map(comment => {
    const article = db.articles.find(item => item.id === comment.articleId)
    return { ...comment, articleTitle: article ? article.title : '文章已删除' }
  })
  enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return ok(paginate(enriched, params.page, params.pageSize))
})

// 审核
Mock.mock(/\/api\/comments/, 'put', options => {
  const { path } = parseRequest(options.url)
  const matched = path.match(/^\/api\/comments\/(\d+)\/audit$/)
  if (!matched) {
    return fail('请求路径不正确')
  }
  const comment = db.comments.find(item => item.id === Number(matched[1]))
  if (!comment) {
    return fail('评论不存在')
  }
  const { status } = parseBody(options.body)
  if (!['approved', 'rejected'].includes(status)) {
    return fail('审核状态不合法')
  }
  comment.status = status
  persistDb()
  return ok(comment, status === 'approved' ? '审核已通过' : '审核已拒绝')
})

// 删除
Mock.mock(/\/api\/comments/, 'delete', options => {
  const { path } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/comments')
  const index = db.comments.findIndex(item => item.id === id)
  if (index === -1) {
    return fail('评论不存在')
  }
  db.comments.splice(index, 1)
  persistDb()
  return ok(null, '评论删除成功')
})

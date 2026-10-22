import Mock from 'mockjs'
import { db, persistDb } from './db'
import { parseRequest, matchResourceId, parseBody, ok, fail, paginate, nextId } from './util'

/**
 * 文章管理 Mock 接口
 * GET    /api/articles          列表（标题搜索 + 分类/状态筛选 + 分页）
 * GET    /api/articles/:id      详情
 * POST   /api/articles          新增
 * PUT    /api/articles/:id      编辑
 * DELETE /api/articles/:id      删除
 * PATCH  /api/articles/:id/status  切换发布状态
 */

// 列表 / 详情
Mock.mock(/\/api\/articles/, 'get', options => {
  const { path, params } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/articles')
  if (id) {
    const article = db.articles.find(item => item.id === id)
    return article ? ok(article) : fail('文章不存在')
  }

  let list = [...db.articles]
  if (params.title) {
    list = list.filter(item => item.title.includes(params.title))
  }
  if (params.categoryId) {
    list = list.filter(item => item.categoryId === Number(params.categoryId))
  }
  if (params.status) {
    list = list.filter(item => item.status === params.status)
  }
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return ok(paginate(list, params.page, params.pageSize))
})

// 新增
Mock.mock(/\/api\/articles/, 'post', options => {
  const body = parseBody(options.body)
  if (!body.title || !body.title.trim()) {
    return fail('文章标题不能为空')
  }
  if (!body.categoryId) {
    return fail('请选择文章分类')
  }
  const now = new Date().toISOString()
  const content = body.content || ''
  const article = {
    id: nextId(db.articles),
    title: body.title.trim(),
    summary: content.replace(/\n/g, ' ').slice(0, 60) || '暂无摘要',
    content,
    categoryId: Number(body.categoryId),
    tagIds: body.tagIds || [],
    status: body.status || 'draft',
    views: 0,
    createdAt: now,
    updatedAt: now,
  }
  db.articles.unshift(article)
  persistDb()
  return ok(article, '新增文章成功')
})

// 编辑
Mock.mock(/\/api\/articles/, 'put', options => {
  const { path } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/articles')
  const article = db.articles.find(item => item.id === id)
  if (!article) {
    return fail('文章不存在')
  }
  const body = parseBody(options.body)
  const content = body.content ?? article.content
  Object.assign(article, {
    title: body.title?.trim() || article.title,
    content,
    summary: content.replace(/\n/g, ' ').slice(0, 60) || '暂无摘要',
    categoryId: body.categoryId ? Number(body.categoryId) : article.categoryId,
    tagIds: body.tagIds ?? article.tagIds,
    status: body.status ?? article.status,
    updatedAt: new Date().toISOString(),
  })
  persistDb()
  return ok(article, '文章更新成功')
})

// 删除
Mock.mock(/\/api\/articles/, 'delete', options => {
  const { path } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/articles')
  const index = db.articles.findIndex(item => item.id === id)
  if (index === -1) {
    return fail('文章不存在')
  }
  db.articles.splice(index, 1)
  persistDb()
  return ok(null, '文章删除成功')
})

// 切换发布状态
Mock.mock(/\/api\/articles/, 'patch', options => {
  const { path } = parseRequest(options.url)
  const matched = path.match(/^\/api\/articles\/(\d+)\/status$/)
  if (!matched) {
    return fail('请求路径不正确')
  }
  const article = db.articles.find(item => item.id === Number(matched[1]))
  if (!article) {
    return fail('文章不存在')
  }
  article.status = parseBody(options.body).status
  article.updatedAt = new Date().toISOString()
  persistDb()
  return ok(article, '文章状态已更新')
})

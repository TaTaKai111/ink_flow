import Mock from 'mockjs'
import { db, persistDb } from './db'
import { parseRequest, matchResourceId, parseBody, ok, fail, nextId } from './util'

/**
 * 标签管理 Mock 接口
 * GET    /api/tags      列表（含关联文章数）
 * POST   /api/tags      新增
 * PUT    /api/tags/:id  编辑
 * DELETE /api/tags/:id  删除
 */

// 列表：实时统计每个标签被多少篇文章引用
Mock.mock(/\/api\/tags/, 'get', () => {
  const list = db.tags.map(tag => ({
    ...tag,
    articleCount: db.articles.filter(article => article.tagIds.includes(tag.id)).length,
  }))
  return ok(list)
})

// 新增
Mock.mock(/\/api\/tags/, 'post', options => {
  const body = parseBody(options.body)
  if (!body.name || !body.name.trim()) {
    return fail('标签名称不能为空')
  }
  if (db.tags.some(item => item.name === body.name.trim())) {
    return fail('该标签名称已存在')
  }
  const tag = {
    id: nextId(db.tags),
    name: body.name.trim(),
    color: body.color || '#1a73e8',
    createdAt: new Date().toISOString(),
  }
  db.tags.push(tag)
  persistDb()
  return ok(tag, '新增标签成功')
})

// 编辑
Mock.mock(/\/api\/tags/, 'put', options => {
  const { path } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/tags')
  const tag = db.tags.find(item => item.id === id)
  if (!tag) {
    return fail('标签不存在')
  }
  const body = parseBody(options.body)
  const name = body.name?.trim()
  if (!name) {
    return fail('标签名称不能为空')
  }
  if (db.tags.some(item => item.name === name && item.id !== id)) {
    return fail('该标签名称已存在')
  }
  tag.name = name
  tag.color = body.color || tag.color
  persistDb()
  return ok(tag, '标签更新成功')
})

// 删除
Mock.mock(/\/api\/tags/, 'delete', options => {
  const { path } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/tags')
  const index = db.tags.findIndex(item => item.id === id)
  if (index === -1) {
    return fail('标签不存在')
  }
  db.tags.splice(index, 1)
  persistDb()
  return ok(null, '标签删除成功')
})

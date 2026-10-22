import Mock from 'mockjs'
import { db, persistDb } from './db'
import { parseRequest, matchResourceId, parseBody, ok, fail, nextId } from './util'

/**
 * 分类管理 Mock 接口
 * GET    /api/categories      列表（含文章数量）
 * POST   /api/categories      新增
 * PUT    /api/categories/:id  编辑
 * DELETE /api/categories/:id  删除（分类下存在文章时禁止删除）
 */

// 列表：实时统计每个分类下的文章数
Mock.mock(/\/api\/categories/, 'get', () => {
  const list = db.categories.map(category => ({
    ...category,
    articleCount: db.articles.filter(article => article.categoryId === category.id).length,
  }))
  return ok(list)
})

// 新增
Mock.mock(/\/api\/categories/, 'post', options => {
  const body = parseBody(options.body)
  if (!body.name || !body.name.trim()) {
    return fail('分类名称不能为空')
  }
  const duplicated = db.categories.some(item => item.name === body.name.trim())
  if (duplicated) {
    return fail('该分类名称已存在')
  }
  const category = {
    id: nextId(db.categories),
    name: body.name.trim(),
    createdAt: new Date().toISOString(),
  }
  db.categories.push(category)
  persistDb()
  return ok(category, '新增分类成功')
})

// 编辑
Mock.mock(/\/api\/categories/, 'put', options => {
  const { path } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/categories')
  const category = db.categories.find(item => item.id === id)
  if (!category) {
    return fail('分类不存在')
  }
  const body = parseBody(options.body)
  const name = body.name?.trim()
  if (!name) {
    return fail('分类名称不能为空')
  }
  if (db.categories.some(item => item.name === name && item.id !== id)) {
    return fail('该分类名称已存在')
  }
  category.name = name
  persistDb()
  return ok(category, '分类更新成功')
})

// 删除
Mock.mock(/\/api\/categories/, 'delete', options => {
  const { path } = parseRequest(options.url)
  const id = matchResourceId(path, '/api/categories')
  const index = db.categories.findIndex(item => item.id === id)
  if (index === -1) {
    return fail('分类不存在')
  }
  const count = db.articles.filter(article => article.categoryId === id).length
  if (count > 0) {
    return fail(`该分类下还有 ${count} 篇文章，无法删除`)
  }
  db.categories.splice(index, 1)
  persistDb()
  return ok(null, '分类删除成功')
})

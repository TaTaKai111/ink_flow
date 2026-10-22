import Mock from 'mockjs'
import { db, persistDb } from './db'
import { parseBody, ok } from './util'

/**
 * 系统设置 Mock 接口
 * GET /api/settings   读取设置
 * PUT /api/settings   保存设置
 */

// 读取
Mock.mock(/\/api\/settings/, 'get', () => {
  return ok({ ...db.settings })
})

// 保存（局部更新）
Mock.mock(/\/api\/settings/, 'put', options => {
  const body = parseBody(options.body)
  if (!body.siteName || !body.siteName.trim()) {
    return { code: 400, message: '站点名称不能为空', data: null }
  }
  Object.assign(db.settings, body)
  persistDb()
  return ok({ ...db.settings }, '设置保存成功')
})

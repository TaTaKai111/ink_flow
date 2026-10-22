/**
 * Mock 工具函数：请求解析、响应封装、分页等
 */

/** 解析请求 URL，返回路径与查询参数 */
export function parseRequest(url) {
  const [path, queryString] = url.split('?')
  const params = {}
  if (queryString) {
    new URLSearchParams(queryString).forEach((value, key) => {
      params[key] = value
    })
  }
  return { path, params }
}

/** 从路径中提取资源 ID，例如 /api/articles/12 -> 12 */
export function matchResourceId(path, base) {
  const matched = path.match(new RegExp(`^${base}/(\\d+)$`))
  return matched ? Number(matched[1]) : null
}

/** 解析请求体 JSON */
export function parseBody(body) {
  if (!body) return {}
  try {
    return JSON.parse(body)
  } catch (error) {
    console.error('Mock 请求体解析失败：', error)
    return {}
  }
}

/** 成功响应体 */
export function ok(data, message = 'success') {
  return { code: 200, message, data }
}

/** 失败响应体 */
export function fail(message = '操作失败', code = 400) {
  return { code, message, data: null }
}

/** 列表分页切片 */
export function paginate(list, page, pageSize) {
  const current = Math.max(Number(page) || 1, 1)
  const size = Math.max(Number(pageSize) || 10, 1)
  return {
    list: list.slice((current - 1) * size, current * size),
    total: list.length,
    page: current,
    pageSize: size,
  }
}

/** 生成列表下一个自增 ID */
export function nextId(list) {
  return list.length ? Math.max(...list.map(item => item.id)) + 1 : 1
}

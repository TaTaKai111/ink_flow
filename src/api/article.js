import service from './index'

/** 文章列表（分页 + 筛选） */
export function getArticles(params) {
  return service.get('/articles', { params })
}

/** 文章详情 */
export function getArticle(id) {
  return service.get(`/articles/${id}`)
}

/** 新增文章 */
export function createArticle(data) {
  return service.post('/articles', data)
}

/** 编辑文章 */
export function updateArticle(id, data) {
  return service.put(`/articles/${id}`, data)
}

/** 删除文章 */
export function deleteArticle(id) {
  return service.delete(`/articles/${id}`)
}

/** 切换文章发布状态 */
export function toggleArticleStatus(id, status) {
  return service.patch(`/articles/${id}/status`, { status })
}

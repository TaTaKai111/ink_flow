import service from './index'

/** 标签列表 */
export function getTags() {
  return service.get('/tags')
}

/** 新增标签 */
export function createTag(data) {
  return service.post('/tags', data)
}

/** 编辑标签 */
export function updateTag(id, data) {
  return service.put(`/tags/${id}`, data)
}

/** 删除标签 */
export function deleteTag(id) {
  return service.delete(`/tags/${id}`)
}

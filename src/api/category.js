import service from './index'

/** 分类列表 */
export function getCategories() {
  return service.get('/categories')
}

/** 新增分类 */
export function createCategory(data) {
  return service.post('/categories', data)
}

/** 编辑分类 */
export function updateCategory(id, data) {
  return service.put(`/categories/${id}`, data)
}

/** 删除分类 */
export function deleteCategory(id) {
  return service.delete(`/categories/${id}`)
}

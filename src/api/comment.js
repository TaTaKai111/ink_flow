import service from './index'

/** 评论列表（分页 + 状态筛选） */
export function getComments(params) {
  return service.get('/comments', { params })
}

/** 审核评论 */
export function auditComment(id, status) {
  return service.put(`/comments/${id}/audit`, { status })
}

/** 删除评论 */
export function deleteComment(id) {
  return service.delete(`/comments/${id}`)
}

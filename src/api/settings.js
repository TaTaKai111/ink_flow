import service from './index'

/** 获取系统设置 */
export function getSettings() {
  return service.get('/settings')
}

/** 保存系统设置 */
export function updateSettings(data) {
  return service.put('/settings', data)
}

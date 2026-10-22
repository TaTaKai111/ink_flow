import service from './index'

/** 登录 */
export function login(data) {
  return service.post('/login', data)
}

/** 获取当前登录用户信息 */
export function getInfo() {
  return service.get('/user/info')
}

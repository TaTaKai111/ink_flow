import Mock from 'mockjs'
import { parseBody, ok, fail } from './util'

/**
 * 用户 Mock 接口（演示用途，任意非空账号密码均可登录）
 * POST /api/user/login   登录
 * GET  /api/user/info    当前用户信息
 */

Mock.mock(/\/api\/login/, 'post', options => {
  const body = parseBody(options.body)
  if (!body.username || !body.password) {
    return fail('用户名和密码不能为空')
  }
  return ok({
    token: `mock-token-${Date.now()}`,
    userInfo: {
      id: 1,
      username: body.username,
      nickname: '墨流',
      avatar: '',
    },
  }, '登录成功')
})

Mock.mock(/\/api\/user\/info/, 'get', () => {
  return ok({
    id: 1,
    username: 'admin',
    nickname: '墨流',
    avatar: '',
  })
})

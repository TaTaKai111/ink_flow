import { login as loginApi } from '@/api/user'

const TOKEN_KEY = 'inkflow_token'
const USER_KEY = 'inkflow_user'

const state = {
  // 从 localStorage 恢复登录态，刷新页面不掉线
  token: localStorage.getItem(TOKEN_KEY) || '',
  userInfo: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem(TOKEN_KEY, token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
  },
  CLEAR_USER(state) {
    state.token = ''
    state.userInfo = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

const actions = {
  /** 登录 */
  async login({ commit }, payload) {
    const res = await loginApi(payload)
    commit('SET_TOKEN', res.data.token)
    commit('SET_USER_INFO', res.data.userInfo)
    return res.data
  },
  /** 退出登录 */
  logout({ commit }) {
    commit('CLEAR_USER')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

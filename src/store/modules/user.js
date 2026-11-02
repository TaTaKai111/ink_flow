import { login as loginApi } from '@/api/user'

const TOKEN_KEY = 'inkflow_token'
const USER_KEY = 'inkflow_user'

/**
 * 读取本地存储：隐私模式或存储被禁用时 localStorage 会直接抛错，
 * 若不兜底会导致整个 store 模块加载失败、应用无法启动（表现就是一直卡在加载屏）。
 */
function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function readJSON(key) {
  try {
    return JSON.parse(readStorage(key) || 'null')
  } catch {
    return null
  }
}

const state = {
  // 从 localStorage 恢复登录态，刷新页面不掉线
  token: readStorage(TOKEN_KEY) || '',
  userInfo: readJSON(USER_KEY),
}

const getters = {
  /** 已登录：token 与用户信息必须同时存在，避免残留脏 token 让人"跳过登录页" */
  isLogin: state => Boolean(state.token && state.userInfo),
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* 存储不可用时仅保留内存态 */
    }
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
    } catch {
      /* 存储不可用时仅保留内存态 */
    }
  },
  CLEAR_USER(state) {
    state.token = ''
    state.userInfo = null
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {
      /* 存储不可用时忽略 */
    }
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
  getters,
  mutations,
  actions,
}

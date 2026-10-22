import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'

// axios 实例：所有请求由 Mock.js 拦截（纯前端演示，无真实后端）
const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截：携带登录 token
service.interceptors.request.use(
  config => {
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求发送失败：', error)
    return Promise.reject(error)
  },
)

// 响应拦截：统一解包 { code, message, data }
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res && res.code === 200) {
      return res
    }
    ElMessage.error(res?.message || '请求失败')
    return Promise.reject(new Error(res?.message || '请求失败'))
  },
  error => {
    console.error('接口异常：', error)
    ElMessage.error(error.message || '网络异常，请稍后重试')
    return Promise.reject(error)
  },
)

export default service

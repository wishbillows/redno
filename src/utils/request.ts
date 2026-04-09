// src/utils/request.ts
import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
//   baseURL: '/api',
  baseURL: 'https://mock.mengxuegu.com/mock/69cde1a1d843fa7e70aef34f/rednote',
  timeout: 10000,
})

// 请求拦截：自动带上 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截：统一处理错误
request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status = err.response?.status
    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return
    }
    message.error(err.response?.data?.msg || '请求失败')
    return Promise.reject(err)
  }
)

export default request
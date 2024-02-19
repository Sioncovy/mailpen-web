import axios from 'axios'
import { AUTH_TOKEN_KEY, REACT_APP_API } from '@/config'

const request = axios.create({
  baseURL: REACT_APP_API,
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use((config) => {
  return config.data
}, (error) => {
  return Promise.reject(error)
})

export { request }

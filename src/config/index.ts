export const AUTH_TOKEN_KEY = 'AUTH_TOKEN'
// export const UPLOAD_TOKEN_KEY = 'UPLOAD_TOKEN'

export const ErrorCodeMap: {
  [key: string]: string
} = {
  1000: '用户不存在',
  1001: '用户已存在',
  1002: '密码错误',
  1003: '邮箱错误',
  1004: '昵称错误',
  1005: '注册失败',
  1006: '更新用户信息失败',
  1007: '注销失败',
  1008: '无权限',
}

export const { VITE_REACT_APP_API: REACT_APP_API } = import.meta.env

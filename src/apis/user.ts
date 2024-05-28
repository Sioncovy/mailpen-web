import { request } from '@/hooks'
import type { User, UserPublic } from '@/typings'

export async function queryProfile(): Promise<UserPublic> {
  return request.get('/users/profile')
}

export async function queryUserInfo(username: string): Promise<UserPublic> {
  return request.get(`/users/${username}`)
}

export async function login(
  data: Pick<User, 'username' | 'password'> & {
    code: string
    timestamp: number
  }
): Promise<{
  accessToken: string
  // uploadToken: string
  userInfo: UserPublic
}> {
  return request.post('/users/login', data)
}

export async function register(
  data: Pick<User, 'username' | 'password'>
): Promise<void> {
  return request.post('/users/register', data)
}

export async function getAuthSvg(timestamp: number): Promise<string> {
  return request.get(`/users/authCode?timestamp=${timestamp}`)
}

export async function sendEmailCode(data: { email: string }) {
  return request.post('/email/sendCode', data)
}

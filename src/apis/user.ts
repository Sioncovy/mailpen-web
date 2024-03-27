import { request } from '@/hooks'
import type { User, UserPublic } from '@/typings'

export async function queryProfile(): Promise<UserPublic> {
  return request.get('/users/profile')
}

export async function queryUserInfo(username: string): Promise<UserPublic> {
  return request.get(`/users/${username}`)
}

export async function login(data: Pick<User, 'username' | 'password'>): Promise<{
  access_token: string
  userInfo: UserPublic
}> {
  return request.post('/users/login', data)
}

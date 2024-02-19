import { request } from '@/hooks'
import type { User } from '@/typings'

export function querySelfInfo() {
  return request.get('/user')
}

export function login(data: Pick<User, 'username' | 'password'>) {
  return request.post('/users/login', data)
}

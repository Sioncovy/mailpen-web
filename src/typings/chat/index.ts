import type { Common } from '..'

export interface Chat extends Common {
  nickname: string
  note: string
  avatar: string
  message: string
  sender: string
  count: number
}

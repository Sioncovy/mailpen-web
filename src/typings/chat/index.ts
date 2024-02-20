import type { Common } from '..'

export interface Chat extends Common {
  avatar: string
  message: string
  sender: string
  count: number
}

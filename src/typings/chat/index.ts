import type { Common } from '..'

export enum ChatMessageType {
  Text,
  Image,
  Audio,
  Video,
  File,
}

export interface Chat extends Common {
  name: string
  avatar: string
  message: Message | null
  count: number
  pinned: boolean
}

export interface Message extends Common {
  content: string
  type: ChatMessageType
  sender: string
  receiver: string
  read: boolean
}

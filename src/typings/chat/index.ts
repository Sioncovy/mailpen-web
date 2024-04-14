import type { Common, Contact } from '..'

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
}

export interface Message extends Common {
  content: string
  type: ChatMessageType
  sender: Contact
  receiver: string
  read: boolean
}

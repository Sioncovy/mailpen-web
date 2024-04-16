import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Chat from '@/components/Chat'
import ChatSider from '@/components/Sider/ChatSider'
import MainLayout from '@/layouts/MainLayout'
import { mailpenDatabase } from '@/storages'
import type { Chat as ChatType, Message } from '@/typings'
import { socket, useAppStore, useTime } from '@/hooks'

function ChatPage() {
  const params = useParams()
  const username = params.username as string
  const [chatList, setChatList] = useState<ChatType[]>([])
  const time = useTime()
  const [contactMap] = useAppStore(state => [state.contactMap])

  useEffect(() => {
    mailpenDatabase.chats.find().$.subscribe((list) => {
      setChatList(list)
    })

    socket.on('receiveChatMessage', async (message: Message) => {
      const sender = contactMap.get(message.sender)
      const chat = await mailpenDatabase.chats
        .findOne({ selector: { _id: sender?.username } })
        .exec()
      const now = time().format('YYYY-MM-DD HH:mm:ss')

      if (!chat) {
        sender && await mailpenDatabase.chats.insert({
          _id: sender.username,
          name: sender.remark || sender.nickname || sender.username,
          avatar: sender.avatar || '',
          message,
          count: 1,
          createdAt: now,
          updatedAt: now,
        })
      }
      else {
        await mailpenDatabase.messages.insert(message)
        await chat.update({
          $set: {
            message,
            count: chat.count + 1,
            updatedAt: now,
          },
        })
      }
    })

    socket.on('callbackChatMessage', async (message: Message) => {
      await mailpenDatabase.messages.insert(message)
    })
  }, [])

  return (
    <MainLayout>
      <ChatSider chatList={chatList} />
      <Chat chat={chatList.find(chat => chat._id === username)} />
    </MainLayout>
  )
}

export default ChatPage

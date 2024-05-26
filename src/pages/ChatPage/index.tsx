import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Chat from '@/components/Chat'
import ChatSider from '@/components/Sider/ChatSider'
import MainLayout from '@/layouts/MainLayout'
import { mailpenDatabase } from '@/storages'
import type { Chat as ChatType, Message } from '@/typings'
import { socket, useAppStore, useTime } from '@/hooks'
import { useLatest } from 'ahooks'

function ChatPage() {
  const params = useParams()
  const username = params.username as string
  const [chatList, setChatList] = useState<ChatType[]>([])
  const time = useTime()
  const [contactMap] = useAppStore((state) => [state.contactMap])
  const contactMapRef = useLatest(contactMap)

  const readMessage = ({ id }: { id: string }) => {
    mailpenDatabase.messages
      .findOne({
        selector: { _id: id }
      })
      .update({
        $set: {
          read: true
        }
      })
  }

  const updateMessage = (message: Message) => {
    mailpenDatabase.messages
      .findOne({ selector: { _id: message._id } })
      .update({
        $set: message
      })
  }

  const receiveMessage = async (message: Message) => {
    console.log('✨  ~ receiveMessage ~ message:', message)
    const sender = contactMapRef.current.get(message.sender)
    const chat = await mailpenDatabase.chats
      .findOne({ selector: { _id: sender?.username } })
      .exec()
    const now = time().format('YYYY-MM-DD HH:mm:ss')

    if (!chat) {
      console.log('创建 chat', sender)

      sender &&
        (await mailpenDatabase.chats.insert({
          _id: sender.username,
          name: sender.remark || sender.nickname || sender.username,
          avatar: sender.avatar || '',
          message,
          count: 1,
          createdAt: now,
          updatedAt: now,
          pinned: false
        }))
    } else {
      await chat.update({
        $set: {
          message,
          count: chat.count + 1,
          updatedAt: now
        }
      })
    }
    await mailpenDatabase.messages.insert(message)
  }

  const callbackChatMessage = async (message: Message) => {
    await mailpenDatabase.messages.insert(message)
  }

  useEffect(() => {
    mailpenDatabase.chats.find().$.subscribe((list) => {
      console.log('更新了 chat')

      setChatList(list)
    })

    socket.on('receiveChatMessage', receiveMessage)
    socket.on('callbackChatMessage', callbackChatMessage)

    socket.on('onReadMessage', readMessage)
    socket.on('onUpdateMessage', updateMessage)

    return () => {
      socket.off('receiveChatMessage', receiveMessage)
      socket.off('callbackChatMessage', callbackChatMessage)
      socket.off('onReadMessage', readMessage)
      socket.off('onUpdateMessage', updateMessage)
    }
  }, [])

  return (
    <MainLayout>
      <ChatSider chatList={chatList} />
      <Chat chat={chatList.find((chat) => chat._id === username)} />
    </MainLayout>
  )
}

export default ChatPage

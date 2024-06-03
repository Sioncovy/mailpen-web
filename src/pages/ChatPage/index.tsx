import Chat from '@/components/Chat'
import ChatSider from '@/components/Sider/ChatSider'
import MainLayout from '@/layouts/MainLayout'
import { mailpenDatabase } from '@/storages'
import { type Chat as ChatType } from '@/typings'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ChatPage() {
  const params = useParams()
  const username = params.username as string
  const [chatList, setChatList] = useState<ChatType[]>([])

  useEffect(() => {
    const subscription = mailpenDatabase.chats.find().$.subscribe((list) => {
      console.log('更新了 chat')
      setChatList(list)
    })

    return () => {
      subscription.unsubscribe()
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

import { useParams } from 'react-router-dom'
import ChatSider from '@/components/Sider/ChatSider'
import MainLayout from '@/layouts/MainLayout'
import { useThemeToken } from '@/hooks'
import Chat from '@/components/Chat'

function ChatPage() {
  const params = useParams()
  const chatId = params.id
  const { token } = useThemeToken()

  return (
    <MainLayout>
      <ChatSider />
      <Chat />
    </MainLayout>
  )
}

export default ChatPage

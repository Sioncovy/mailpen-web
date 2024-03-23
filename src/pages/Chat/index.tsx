import { useParams } from 'react-router-dom'
import ChatSider from '@/components/Sider/ChatSider'
import MainLayout from '@/layouts/MainLayout'

function Chat() {
  const params = useParams()
  const chatId = params.id

  return (
    <MainLayout>
      <ChatSider />
      <div>哈哈</div>
    </MainLayout>
  )
}

export default Chat

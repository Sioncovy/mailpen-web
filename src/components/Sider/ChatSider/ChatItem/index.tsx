import { Badge, Flex, Typography } from 'antd'
import { useMeasure } from 'react-use'
import { useNavigate } from 'react-router-dom'
import { useThemeToken, useTime } from '@/hooks'
import type { Chat } from '@/typings'

interface ChatItemProps {
  chat: Chat
}

function ChatItem({ chat }: ChatItemProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { token } = useThemeToken()
  const time = useTime()
  const { updatedAt, avatar, sender, count, note, nickname, message } = chat
  const navigate = useNavigate()

  return (
    <Flex
      ref={ref}
      onClick={() => {
        navigate(`/chat/${chat.id}`)
      }}
      style={{ backgroundColor: token.colorPrimary, padding: 10 }}
      gap={10}
    >
      <div style={{ minWidth: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
        <img src={avatar} />
      </div>
      <Flex vertical style={{ width: width - 60 }} justify="space-between">
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis style={{ fontSize: token.fontSizeLG }}>{note || nickname}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM, flexShrink: 0 }}>{time(updatedAt).fromNow()}</Typography.Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis>
            {sender ? `${sender}：` : ''}
            {message}
          </Typography.Text>
          <Badge style={{ boxShadow: 'none' }} count={count} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ChatItem

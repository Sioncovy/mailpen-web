import { Badge, Flex, Typography } from 'antd'
import dayjs from 'dayjs'
import { useThemeToken, useTime } from '@/hooks'
import type { Chat } from '@/typings'

interface ChatItemProps {
  chat: Chat
}

function ChatItem({ chat }: ChatItemProps) {
  const { token } = useThemeToken()
  const time = useTime()
  const { updatedAt, avatar, sender, count } = chat

  return (
    <Flex style={{ backgroundColor: token.colorPrimary, padding: 10 }} gap={10}>
      <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
        <img src={avatar} />
      </div>
      <Flex vertical style={{ flex: 1 }} justify="space-between">
        <Flex justify="space-between" align="center">
          <Typography.Text style={{ fontSize: token.fontSizeLG }}>小太阳</Typography.Text>
          <Typography.Text type="secondary">{time(updatedAt).fromNow()}</Typography.Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text>
            {sender ? `${sender}：` : ''}
            我好想你
          </Typography.Text>
          <Badge style={{ boxShadow: 'none' }} count={count} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ChatItem

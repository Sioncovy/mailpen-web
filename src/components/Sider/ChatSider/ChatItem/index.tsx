import { Badge, Flex, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useMeasure } from 'react-use'
import styles from './index.module.less'
import type { Chat, Message } from '@/typings'
import { useThemeToken, useTime } from '@/hooks'

interface ChatItemProps {
  chat: Chat
}

function ChatItem({ chat }: ChatItemProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { token } = useThemeToken()
  const time = useTime()
  const { updatedAt, avatar, count, name, message } = chat
  const { content } = message || {} as Message
  const navigate = useNavigate()
  const { username } = useParams()
  const isActive = username === chat._id

  return (
    <Flex
      ref={ref}
      onClick={() => {
        navigate(`/chat/${chat._id}`)
      }}
      className={styles.chatItem}
      style={{ backgroundColor: isActive ? token.colorPrimaryActive : undefined, padding: 10 }}
      gap={10}
    >
      <div style={{ minWidth: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
        <img src={avatar} />
      </div>
      <Flex vertical style={{ width: width - 60 }} justify="space-between">
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis style={{ fontSize: token.fontSizeLG }}>{name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM, flexShrink: 0 }}>{time(updatedAt).fromNow()}</Typography.Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis>
            {content}
          </Typography.Text>
          <Badge style={{ boxShadow: 'none' }} count={count} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ChatItem

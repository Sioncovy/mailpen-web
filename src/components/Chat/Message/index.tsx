import { Card, Flex, Tooltip, Typography } from 'antd'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './index.module.less'
import { useTime } from '@/hooks'
import type { ChatMessageType } from '@/typings'

interface MessageProps {
  message: {
    name?: string
    avatar: string
    content: string
    createdAt: Date
    updatedAt: Date
    position: 'left' | 'right'
    type: ChatMessageType
    read: boolean
  }
}

function Message({ message: { name, avatar, content, createdAt, updatedAt, position = 'left', read } }: MessageProps) {
  const time = useTime()
  const isEdited = createdAt.getTime() !== updatedAt.getTime()
  const isLeft = position === 'left'
  const flexDirection = isLeft ? 'row' : 'row-reverse'

  return (
    <Flex gap={8} style={{ height: 'auto', flexDirection }} className={styles.message}>
      <div style={{ minWidth: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
        <img src={avatar} />
      </div>
      <Flex vertical>
        <div>{name}</div>
        <Card size="small" style={{ width: 'fit-content', alignSelf: isLeft ? 'flex-start' : 'flex-end' }}>
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </Card>
        <Flex gap={4} align="center" style={{ flexDirection }}>
          <Typography.Text style={{ fontSize: 12 }} type="secondary">{read ? '已读' : '未读'}</Typography.Text>
          <Flex gap={4} align="center" className={styles.extraInfo} style={{ flexDirection }}>
            {isEdited && <Typography.Text style={{ fontSize: 12 }} type="secondary">已编辑</Typography.Text>}
            <Tooltip placement="bottom" title={time(createdAt).format('YYYY-MM-DD HH:mm:ss')}>
              <Typography.Text style={{ fontSize: 12 }} type="secondary">{time(createdAt).fromNow()}</Typography.Text>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Message

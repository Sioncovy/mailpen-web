import { Button, Card, Flex, Image, Tooltip, Typography } from 'antd'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './index.module.less'
import { ChatMessageType } from '@/typings'
import { useTime } from '@/hooks'
import FileInfo from '@/components/FileInfo'
import { downloadFile } from '@/utils/file'

interface MessageProps {
  message: {
    name?: string
    avatar: string
    content: any
    createdAt: Date
    updatedAt: Date
    position: 'left' | 'right'
    type: ChatMessageType
    read: boolean
  }
}

function Message({
  message: {
    name,
    avatar,
    content,
    createdAt,
    updatedAt,
    position = 'left',
    read,
    type
  }
}: MessageProps) {
  const time = useTime()
  const isEdited = createdAt.getTime() !== updatedAt.getTime()
  const isLeft = position === 'left'
  const flexDirection = isLeft ? 'row' : 'row-reverse'

  const contentRender = () => {
    switch (Number(type)) {
      case ChatMessageType.Text: {
        return <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      }
      case ChatMessageType.Image: {
        return <Image src={content} />
      }
      case ChatMessageType.File: {
        return (
          <Flex gap={8} style={{ width: '100%' }}>
            <FileInfo name={content.filename} size={content.size} />
            <Button
              size="small"
              onClick={() => {
                downloadFile(content.url, content.filename)
              }}
            >
              下载
            </Button>
          </Flex>
        )
      }
      case ChatMessageType.Audio: {
        return (
          <audio controls>
            <source src={content.url} type="audio/wav" />
            您的浏览器不支持 audio 元素
          </audio>
        )
      }
      default: {
        return <Typography.Text type="danger">消息异常</Typography.Text>
      }
    }
  }

  return (
    <Flex
      gap={8}
      style={{ height: 'auto', flexDirection }}
      className={styles.message}
    >
      <div
        style={{
          minWidth: 40,
          height: 40,
          borderRadius: '50%',
          overflow: 'hidden'
        }}
      >
        <img style={{ height: '100%' }} src={avatar} />
      </div>
      <Flex vertical style={{ maxWidth: '70%' }}>
        <div>{name}</div>
        <Card
          size="small"
          style={{
            width: 'fit-content',
            maxWidth: '100%',
            alignSelf: isLeft ? 'flex-start' : 'flex-end'
          }}
          styles={{
            body: {
              padding: '8px 12px'
            }
          }}
        >
          {contentRender()}
        </Card>
        <Flex gap={4} align="center" style={{ flexDirection }}>
          <Typography.Text style={{ fontSize: 12 }} type="secondary">
            {read ? '已读' : '未读'}
          </Typography.Text>
          <Flex
            gap={4}
            align="center"
            className={styles.extraInfo}
            style={{ flexDirection }}
          >
            {isEdited && (
              <Typography.Text style={{ fontSize: 12 }} type="secondary">
                已编辑
              </Typography.Text>
            )}
            <Tooltip
              placement="bottom"
              title={time(createdAt).format('YYYY-MM-DD HH:mm:ss')}
            >
              <Typography.Text style={{ fontSize: 12 }} type="secondary">
                {time(createdAt).fromNow()}
              </Typography.Text>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Message

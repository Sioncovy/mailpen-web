import FileInfo from '@/components/FileInfo'
import { useTime } from '@/hooks'
import { mailpenDatabase } from '@/storages'
import { ChatMessageType, MessageSpecialType } from '@/typings'
import { downloadFile } from '@/utils/file'
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Image,
  Modal,
  Tooltip,
  Typography,
  message
} from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './index.module.less'

interface MessageProps {
  message: {
    _id: string
    name?: string
    avatar: string
    content: any
    createdAt: Date
    updatedAt: Date
    position: 'left' | 'right'
    type: ChatMessageType
    read: boolean
    special: MessageSpecialType
  }
  withdrawMessage: (id: string) => void
}

function Message({
  message: {
    _id,
    name,
    avatar,
    content,
    createdAt,
    updatedAt,
    position = 'left',
    read,
    type,
    special
  },
  withdrawMessage
}: MessageProps) {
  const time = useTime()
  const isEdited = createdAt.getTime() !== updatedAt.getTime()
  const isLeft = position === 'left'
  const flexDirection = isLeft ? 'row' : 'row-reverse'

  const [messageApi, messageContextHolder] = message.useMessage()
  const [modalApi, modalContextHolder] = Modal.useModal()

  useEffect(() => {
    if (special === MessageSpecialType.BurnAfterReading) {
      if (read) {
        const destroyTime = 5000 - (dayjs().valueOf() - updatedAt.valueOf())
        setTimeout(() => {
          mailpenDatabase.messages.findOne({ selector: { _id } }).remove()
        }, destroyTime)
      }
    } else if (special === MessageSpecialType.BurnAfterTime) {
      const destroyTime = 5000 - (dayjs().valueOf() - createdAt.valueOf())
      setTimeout(() => {
        mailpenDatabase.messages.findOne({ selector: { _id } }).remove()
      }, destroyTime)
    }
  }, [read])

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
      case ChatMessageType.Tip: {
        return <Typography.Text type="secondary">{content}</Typography.Text>
      }
      default: {
        return <Typography.Text type="danger">消息异常</Typography.Text>
      }
    }
  }

  const renderSpecialTips = () => {
    if (special === MessageSpecialType.BurnAfterReading) {
      return (
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          阅后即焚
        </Typography.Text>
      )
    } else if (special === MessageSpecialType.BurnAfterTime) {
      return (
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          限时消息
        </Typography.Text>
      )
    }
  }

  return (
    <Flex
      gap={8}
      style={{ height: 'auto', flexDirection }}
      className={styles.message}
    >
      {messageContextHolder}
      {modalContextHolder}
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
        <Dropdown
          disabled={position === 'left'}
          menu={{
            items: [
              {
                key: 'copy',
                label: '复制',
                onClick: () => {
                  navigator.clipboard
                    .writeText(content)
                    .then(() => {
                      messageApi.success('复制成功')
                    })
                    .catch(() => {
                      messageApi.error('复制失败')
                    })
                }
              },
              {
                key: 'delete',
                label: '删除',
                onClick: () => {
                  modalApi.confirm({
                    title: '删除消息',
                    content:
                      '确定删除该消息吗？此删除仅对您本地有效，对方仍可查看。',
                    onOk: async () => {
                      await mailpenDatabase.messages
                        .findOne({
                          selector: {
                            _id
                          }
                        })
                        .remove()
                    }
                  })
                }
              },
              {
                key: 'withdraw',
                label: '撤回',
                onClick: () => {
                  modalApi.confirm({
                    title: '撤回消息',
                    content: '确定撤回该消息吗？',
                    onOk: () => withdrawMessage(_id)
                  })
                }
              }
            ]
          }}
          trigger={['contextMenu']}
        >
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
        </Dropdown>
        <Flex gap={8} align="center" style={{ flexDirection }}>
          <Flex gap={4} align="center">
            <Typography.Text style={{ fontSize: 12 }} type="secondary">
              {read ? '已读' : '未读'}
            </Typography.Text>
            {renderSpecialTips()}
          </Flex>
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

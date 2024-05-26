import { Badge, Dropdown, Flex, Modal, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useMeasure } from 'react-use'
import styles from './index.module.less'
import {
  type Chat,
  ChatMessageType,
  type Message,
  MessageSpecialType
} from '@/typings'
import { useThemeToken, useTime } from '@/hooks'
import { mailpenDatabase } from '@/storages'

interface ChatItemProps {
  chat: Chat
}

function ChatItem({ chat }: ChatItemProps) {
  const [modalApi, modalContextHolder] = Modal.useModal()
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { token } = useThemeToken()
  const time = useTime()
  const { updatedAt, avatar, count, name, message, pinned } = chat
  const { content, type, special } = message || ({} as Message)
  const navigate = useNavigate()
  const { username } = useParams()
  const isActive = username === chat._id

  const contentRender = () => {
    switch (Number(special)) {
      case MessageSpecialType.BurnAfterReading: {
        mailpenDatabase.chats.findOne({ selector: { _id: chat._id } }).update({
          $set: {
            message: {
              ...message,
              content: '[阅后即焚]'
            }
          }
        })
        return '[阅后即焚]'
      }
    }
    switch (Number(type)) {
      case ChatMessageType.Text: {
        return content
      }
      case ChatMessageType.Image: {
        return '[图片]'
      }
      case ChatMessageType.File: {
        return '[文件]'
      }
    }
  }

  return (
    <>
      {modalContextHolder}
      <Dropdown
        menu={{
          items: [
            {
              key: 'pinned',
              label: pinned ? '取消置顶' : '置顶会话',
              onClick: () => {
                mailpenDatabase.chats
                  .findOne({
                    selector: {
                      _id: chat._id
                    }
                  })
                  .update({
                    $set: {
                      pinned: !pinned
                    }
                  })
              }
            },
            {
              key: 'delete',
              label: '删除会话',
              onClick: () => {
                modalApi.confirm({
                  title: '删除会话',
                  content: '确定删除该会话吗？',
                  onOk: async () => {
                    await mailpenDatabase.chats
                      .findOne({
                        selector: {
                          _id: chat._id
                        }
                      })
                      .remove()
                    navigate('/chat')
                  }
                })
              }
            }
          ]
        }}
        trigger={['contextMenu']}
      >
        <Flex
          ref={ref}
          onClick={() => {
            navigate(`/chat/${chat._id}`)
          }}
          className={styles.chatItem}
          style={{
            backgroundColor: isActive ? token.colorPrimaryBg : undefined,
            padding: 10
          }}
          gap={10}
        >
          <div
            style={{
              minWidth: 50,
              height: 50,
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <img style={{ height: '100%' }} src={avatar} />
          </div>
          <Flex vertical style={{ width: width - 60 }} justify="space-between">
            <Flex justify="space-between" align="center">
              <Typography.Text ellipsis style={{ fontSize: token.fontSizeLG }}>
                {name}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ fontSize: token.fontSizeSM, flexShrink: 0 }}
              >
                {time(updatedAt).fromNow()}
              </Typography.Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Typography.Text ellipsis>{contentRender()}</Typography.Text>
              <Badge style={{ boxShadow: 'none' }} count={count} />
            </Flex>
          </Flex>
        </Flex>
      </Dropdown>
    </>
  )
}

export default ChatItem

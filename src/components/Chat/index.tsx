import { Divider, Flex, Typography } from 'antd'
import { useLayoutEffect, useRef, useState } from 'react'
import InputArea from './InputArea'
import Message from './Message'
import type { Chat as ChatType, Message as MessageType } from '@/typings'
import { mailpenDatabase } from '@/storages'
import { socket, useAppStore, useThemeToken } from '@/hooks'

interface ChatProps {
  chat?: ChatType
}

function Chat({ chat }: ChatProps) {
  const { token } = useThemeToken()
  const [user, contactList] = useAppStore(state => [state.userInfo, state.contactList])
  const friend = contactList.find(contact => contact.username === chat?._id)
  const [messageList, setMessageList] = useState<MessageType[]>([])
  const messageBoxBottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messageBoxBottomRef && messageBoxBottomRef.current) {
      messageBoxBottomRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  }, [messageList])

  useLayoutEffect(() => {
    if (friend) {
      const messages = mailpenDatabase.messages.find({
        selector: {
          $or: [{ sender: friend._id, receiver: user._id }, { sender: user._id, receiver: friend._id }],
        },
      })
      const notReadMessageList = mailpenDatabase.messages.find({
        selector: { sender: friend._id, read: false },
      }).exec()
      notReadMessageList.then((res) => {
        res.forEach((message) => {
          socket.emit('readMessage', message._id)
        })
      })

      mailpenDatabase.chats.findOne({
        selector: { _id: friend.username },
      }).update({
        $set: { count: 0 },
      })
      messages.$.subscribe((list) => {
        setMessageList(list)
      })
    }
  }, [friend])

  if (!chat || !friend)
    return <div>请选择正确的好友</div>

  return (
    <Flex vertical style={{ height: '100%', maxHeight: '100vh' }}>
      <Flex style={{ padding: token.padding }}>
        <Flex align="center" gap={8}>
          <div style={{ minWidth: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
            <img style={{ height: '100%' }} src={chat.avatar} />
          </div>
          <Flex vertical gap={2}>
            <Typography.Text style={{ fontSize: token.fontSizeLG, fontWeight: 'bold' }}>{chat.name}</Typography.Text>
            <Typography.Text type="secondary">{friend?.bio}</Typography.Text>
          </Flex>
        </Flex>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <Flex flex={1} gap={8} vertical style={{ padding: token.padding, overflow: 'auto', display: 'flex' }}>
        {messageList.map((message) => {
          const isSelf = message.sender === user._id
          const info = isSelf ? user : friend
          return (
            <Message
              key={message._id}
              message={{
                avatar: info?.avatar || '',
                content: message.content,
                type: message.type,
                createdAt: new Date(message.createdAt),
                updatedAt: new Date(message.updatedAt),
                position: isSelf ? 'right' : 'left',
                read: message.read,
              }}
            />
          )
        })}
        <div ref={messageBoxBottomRef}></div>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <div style={{ padding: `0 ${token.padding}px` }}>
        <InputArea userId={user._id} friendId={friend._id} />
      </div>
    </Flex>
  )
}

export default Chat

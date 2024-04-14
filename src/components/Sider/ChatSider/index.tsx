import { PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import { useEffect, useState } from 'react'
import ChatItem from './ChatItem'
import styles from './index.module.less'
import { request, socket, useTime } from '@/hooks'
import type { Chat, Message } from '@/typings'
import { mailpenDatabase } from '@/storages'

function ChatSider() {
  const [chatList, setChatList] = useState<Chat[]>([])
  const time = useTime()

  useEffect(() => {
    // chatStorage.all().then(setChatList)
    mailpenDatabase.chats.find().exec().then((res) => {
      setChatList(res)
    })
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connect')
    })
    socket.on('receiveMessage', async (message: Message) => {
      // const chat = await chatStorage.get(message.sender._id)
      const chat = await mailpenDatabase.chats
        .findOne({ selector: { _id: message.sender._id } })
        .exec()
      const now = time().format('YYYY-MM-DD HH:mm:ss')

      if (!chat) {
        await mailpenDatabase.chats.insert({
          _id: message.sender._id,
          name: message.sender.remark || message.sender.nickname || message.sender.username,
          avatar: message.sender.avatar || '',
          message,
          count: 1,
          createdAt: now,
          updatedAt: now,
        })
      }
      else {
        await mailpenDatabase.messages.insert({
          ...chat,
          message,
          count: chat.count + 1,
          updatedAt: now,
        })
      }

      // let messageList = await messageStorage.get(message.sender._id)
      // if (!messageList)
      //   messageList = await messageStorage.set(message.sender._id, [])

      // messageList.unshift(message)
      // await messageStorage.set(message.sender._id, messageList)
    })
  }, [])

  const sendMessage = () => {
    // socket.emit('test', 'hello')
    request.get('message/test')
  }

  return (
    <div className={styles.sider}>
      <Flex className={styles.topBar} gap={8}>
        <Input style={{ flex: 1 }} placeholder="搜索" />
        <Button type="primary" icon={<PlusOutlined />} />
      </Flex>
      <Button onClick={sendMessage}>
        发送消息
      </Button>
      <div className={styles.list}>
        {chatList.map(chat => (
          <ChatItem
            key={chat._id}
            chat={chat}
          />
        ))}
      </div>
    </div>
  )
}

export default ChatSider

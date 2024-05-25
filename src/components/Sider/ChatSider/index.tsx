import { PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import ChatItem from './ChatItem'
import styles from './index.module.less'
import type { Chat } from '@/typings'
import { useEffect } from 'react'
import { socket } from '@/hooks'
import { mailpenDatabase } from '@/storages'

interface ChatSiderProps {
  chatList: Chat[]
}

function ChatSider({ chatList }: ChatSiderProps) {
  const readMessage = ({ id }: { id: string }) => {
    console.log('已读消息')

    mailpenDatabase.messages
      .findOne({
        selector: { _id: id }
      })
      .update({
        $set: {
          read: true
        }
      })
  }
  useEffect(() => {
    socket.on('onReadMessage', readMessage)
    return () => {
      socket.off('onReadMessage', readMessage)
    }
  }, [])
  return (
    <div className={styles.sider}>
      <Flex className={styles.topBar} gap={8}>
        <Input style={{ flex: 1 }} placeholder="搜索" />
        <Button type="primary" icon={<PlusOutlined />} />
      </Flex>
      <div className={styles.list}>
        {chatList.map((chat) => (
          <ChatItem key={chat._id} chat={chat} />
        ))}
      </div>
    </div>
  )
}

export default ChatSider

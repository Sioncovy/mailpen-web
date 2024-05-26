import type { Chat } from '@/typings'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import ChatItem from './ChatItem'
import styles from './index.module.less'

interface ChatSiderProps {
  chatList: Chat[]
}

function ChatSider({ chatList }: ChatSiderProps) {
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

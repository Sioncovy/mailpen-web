import { PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import styles from './index.module.less'
import ChatItem from './ChatItem'

function ChatSider() {
  const chats = [
    {
      _id: 'test-chat',
      avatar: 'https://avatars.githubusercontent.com/u/74760542?v=4',
      nickname: 'Test User',
      note: 'Test User',
      sender: '',
      count: 1,
      createdAt: '2020-03-04',
      updatedAt: '2024-02-24',
      message: 'A sentence of message',
    },
  ]
  return (
    <div className={styles.sider}>
      <Flex className={styles.topBar} gap={8}>
        <Input style={{ flex: 1 }} placeholder="搜索" />
        <Button type="primary" icon={<PlusOutlined />} />
      </Flex>
      <div className={styles.list}>
        {chats.map(chat => (
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

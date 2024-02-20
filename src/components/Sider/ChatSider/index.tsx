import { PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import styles from './index.module.less'
import ChatItem from './ChatItem'

function ChatSider() {
  return (
    <div className={styles.sider}>
      <Flex className={styles.topBar} gap={8}>
        <Input style={{ flex: 1 }} placeholder="搜索" />
        <Button type="primary" icon={<PlusOutlined />} />
      </Flex>
      <div className={styles.list}>
        <ChatItem chat={{
          id: '1',
          avatar: 'https://avatars.githubusercontent.com/u/74760542?v=4',
          sender: '',
          count: 1,
          createdAt: '2020-03-04',
          updatedAt: '2024-02-20',
          message: '我好想你',
        }}
        />
      </div>
    </div>
  )
}

export default ChatSider

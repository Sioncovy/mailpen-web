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
        <ChatItem />
      </div>
    </div>
  )
}

export default ChatSider

import { Typography } from 'antd'
import { useParams } from 'react-router-dom'
import styles from './index.module.less'
import type { Friend } from '@/typings'

function Chat() {
  const params = useParams()
  console.log('✨  ~ Chat ~ params:', params)

  return (
    <div>
      <div className={styles.header}>
        {/* <Typography.Text>{friend.note || friend.nickname}</Typography.Text> */}
      </div>
    </div>
  )
}

export default Chat

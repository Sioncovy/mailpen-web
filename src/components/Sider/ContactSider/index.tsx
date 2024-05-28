import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Input, Segmented, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactItem from './ContactItem'
import styles from './index.module.less'
import { useAppStore, useThemeToken } from '@/hooks'

function ContactSider() {
  const navigate = useNavigate()
  const [contactList] = useAppStore((state) => [state.contactList])
  const { token } = useThemeToken()
  const [type, setType] = useState<'contact' | 'group'>('contact')

  return (
    <Flex vertical className={styles.sider}>
      <Flex
        style={{ padding: `20px ${token.marginSM}px` }}
        className={styles.topBar}
        gap={8}
      >
        <Input style={{ flex: 1 }} placeholder="搜索" />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate('/contact/search')
          }}
        />
      </Flex>
      <Flex vertical>
        <Divider style={{ margin: 0 }} />
        <Flex
          className={styles.notifyItem}
          flex={1}
          justify="space-between"
          onClick={() => {
            navigate('/contact/request')
          }}
        >
          <Typography.Text>好友通知</Typography.Text>
          <RightOutlined />
        </Flex>
        {/* <Flex className={styles.notifyItem} flex={1} justify="space-between">
          <Typography.Text>群聊通知</Typography.Text>
          <RightOutlined />
        </Flex> */}
      </Flex>
      <Flex vertical gap={12}>
        <Divider style={{ margin: 0 }} />
        <Segmented
          style={{ margin: `0 ${token.marginSM}px` }}
          block
          value={type}
          onChange={(value) => {
            setType(value as 'contact' | 'group')
          }}
          options={[
            { label: '好友', value: 'contact' }
            // { label: '群聊', value: 'group' },
          ]}
        />
        <div className={styles.list}>
          {type === 'contact' &&
            contactList.map((contact) => (
              <ContactItem key={contact._id} contact={contact} />
            ))}
          {type === 'group' && <div>群组</div>}
        </div>
      </Flex>
    </Flex>
  )
}

export default ContactSider

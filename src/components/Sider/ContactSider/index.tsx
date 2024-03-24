import { PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import ContactItem from './ContactItem'
import styles from './index.module.less'
import type { Contact } from '@/typings'

function ContactSider() {
  const navigate = useNavigate()
  const contacts = [
    {
      _id: '1234',
    },
  ] as Contact[]

  return (
    <div className={styles.sider}>
      <Flex className={styles.topBar} gap={8}>
        <Input style={{ flex: 1 }} placeholder="搜索" />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate('/contact/search')
          }}
        />
      </Flex>
      <div className={styles.list}>
        {contacts.map(contact => (
          <ContactItem
            key={contact._id}
            contact={contact}
          />
        ))}
      </div>
    </div>
  )
}

export default ContactSider

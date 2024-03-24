import { Badge, Flex, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useMeasure } from 'react-use'
import styles from './index.module.less'
import type { Contact } from '@/typings'
import { useThemeToken, useTime } from '@/hooks'

interface ContactItemProps {
  contact: Contact
}

function ContactItem({ contact }: ContactItemProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { token } = useThemeToken()
  const time = useTime()
  const { updatedAt, avatar, sender, count, note, nickname, message } = contact
  const navigate = useNavigate()

  return (
    <Flex
      ref={ref}
      onClick={() => {
        navigate(`/contact/${contact.id}`)
      }}
      gap={10}
      className={styles.contactItem}
    >
      <div style={{ minWidth: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
        <img src={avatar} />
      </div>
      <Flex vertical style={{ width: width - 60 }} justify="space-between">
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis style={{ fontSize: token.fontSizeLG }}>{note || nickname}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: token.fontSizeSM, flexShrink: 0 }}>{time(updatedAt).fromNow()}</Typography.Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis>
            {sender ? `${sender}：` : ''}
            {message}
          </Typography.Text>
          <Badge style={{ boxShadow: 'none' }} count={count} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ContactItem

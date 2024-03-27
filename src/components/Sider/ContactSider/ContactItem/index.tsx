import { Flex, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useMeasure } from 'react-use'
import styles from './index.module.less'
import type { Contact } from '@/typings'
import { useThemeToken } from '@/hooks'

interface ContactItemProps {
  contact: Contact
}

function ContactItem({ contact }: ContactItemProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { token } = useThemeToken()
  const { remark } = contact
  const { avatar, bio, nickname, username } = contact.friend
  const navigate = useNavigate()

  return (
    <Flex
      ref={ref}
      onClick={() => {
        navigate(`/contact/${username}`)
      }}
      gap={10}
      className={styles.contactItem}
    >
      <div style={{ minWidth: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
        <img src={avatar} />
      </div>
      <Flex vertical style={{ width: width - 60 }} justify="space-between">
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis style={{ fontSize: token.fontSizeLG }}>
            {remark ? `${remark}（${nickname}）` : nickname}
          </Typography.Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text ellipsis>
            {bio}
          </Typography.Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ContactItem

import { Button, Card, Flex, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './index.module.less'
import type { UserPublic } from '@/typings'
import { useThemeToken } from '@/hooks'
import { createRequest } from '@/apis'

interface ContactInfoProps {
  contact: UserPublic
}

function ContactInfo(props: ContactInfoProps) {
  const { username } = useParams()
  const [contact, setContact] = useState<UserPublic | undefined>(props.contact)
  const { token } = useThemeToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (!props.contact)
      return
    setContact(props.contact)
  }, [props.contact])

  if (!contact)
    return null

  return (
    <Flex justify="center">
      <Flex gap={40} className={styles.container}>
        <Flex gap={8} vertical className={styles.left}>
          <img className={styles.avatar} src={contact.avatar} />
          <Flex vertical gap={0}>
            <Typography.Text style={{ fontSize: token.fontSizeHeading4, color: token.colorTextTertiary, marginBottom: -token.marginXS }}>
              {contact.username}
            </Typography.Text>
            <Typography.Text style={{ fontSize: token.fontSizeHeading3 }}>{contact.nickname}</Typography.Text>
          </Flex>
          <Flex vertical gap={0}>
            <div style={{ fontSize: token.fontSizeHeading5 }}>四川·乐山</div>
            <Typography.Text style={{ fontSize: token.fontSizeHeading5 }}>{contact.email}</Typography.Text>
          </Flex>
          <Flex>
            <Button
              block
              onClick={() => {
                navigate(`/chat/${username}`)
              }}
            >
              去聊天
            </Button>
          </Flex>
        </Flex>
        <Card className={styles.right}>
          <div style={{ color: token.colorTextSecondary, marginBottom: token.marginXS }}>个人简介</div>
          <Typography.Text style={{ fontSize: token.fontSizeHeading5 }}>{contact.bio}</Typography.Text>
        </Card>
      </Flex>
    </Flex>
  )
}

export default ContactInfo

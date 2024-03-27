import { Button, Card, Flex, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './index.module.less'
import type { UserPublic } from '@/typings'
import { useAppStore, useThemeToken } from '@/hooks'
import { createRequest } from '@/apis'

interface UserInfoProps {
  user: UserPublic
}

function UserInfo(props: UserInfoProps) {
  const navigate = useNavigate()
  const { username } = useParams()
  const [contactList, userInfo] = useAppStore(state => [state.contactList, state.userInfo])
  const [user, setUser] = useState<UserPublic | undefined>(props.user)
  const { token } = useThemeToken()
  const isFriend = contactList.some(contact => contact._id === userInfo._id)
  const [messageApi, messageContextHolder] = message.useMessage()

  useEffect(() => {
    if (!props.user)
      return
    setUser(props.user)
  }, [props.user])

  if (!user)
    return null

  return (
    <Flex justify="center">
      {messageContextHolder}
      <Flex gap={40} className={styles.container}>
        <Flex gap={8} vertical className={styles.left}>
          <img className={styles.avatar} src={user.avatar} />
          <Flex vertical gap={0}>
            <Typography.Text style={{ fontSize: token.fontSizeHeading4, color: token.colorTextTertiary, marginBottom: -token.marginXS }}>{user.username}</Typography.Text>
            <Typography.Text style={{ fontSize: token.fontSizeHeading3 }}>{user.nickname}</Typography.Text>
          </Flex>
          <Flex vertical gap={0}>
            <div style={{ fontSize: token.fontSizeHeading5 }}>四川·乐山</div>
            <Typography.Text style={{ fontSize: token.fontSizeHeading5 }}>{user.email}</Typography.Text>
          </Flex>
          <Flex>
            <Button
              block
              onClick={() => {
                if (isFriend) {
                  navigate(`/chat/${username}`)
                }
                else {
                  createRequest({
                    friendId: username || user._id,
                  }).then(() => {
                    messageApi.success('好友申请成功')
                  })
                }
              }}
            >
              {isFriend ? '去聊天' : '添加好友'}
            </Button>
          </Flex>
        </Flex>
        <Card className={styles.right}>
          <div style={{ color: token.colorTextSecondary, marginBottom: token.marginXS }}>个人简介</div>
          <Typography.Text style={{ fontSize: token.fontSizeHeading5 }}>{user.bio}</Typography.Text>
        </Card>
      </Flex>
    </Flex>
  )
}

export default UserInfo

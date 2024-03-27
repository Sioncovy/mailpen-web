import { Card, Flex, message } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { queryUserInfo } from '@/apis'
import ContactInfo from '@/components/ContactInfo'
import { ErrorCodeMap } from '@/config'
import { useThemeToken } from '@/hooks'
import type { UserPublic } from '@/typings'

function ContactDetail() {
  const { username } = useParams()
  const [userInfo, setUserInfo] = useState<UserPublic>()
  const { token } = useThemeToken()
  const [messageApi, messageContextHolder] = message.useMessage()

  useEffect(() => {
    if (!username)
      return
    queryUserInfo(username).then((res) => {
      setUserInfo(res)
    }).catch((error) => {
      const errorCode = error.message as string
      messageApi.error(ErrorCodeMap[errorCode])
    })
  }, [username])

  if (!userInfo)
    return null

  return (
    <Flex style={{ height: '100%' }} align="center" justify="center">
      {messageContextHolder}
      <Card style={{ margin: token.marginLG, width: '100%' }}>
        <ContactInfo contact={userInfo} />
      </Card>
    </Flex>
  )
}

export default ContactDetail

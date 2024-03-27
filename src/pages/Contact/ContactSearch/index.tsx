import { Card, Flex, Input } from 'antd'
import { useState } from 'react'
import { queryUserInfo } from '@/apis'
import UserInfo from '@/components/UserInfo'
import { useThemeToken } from '@/hooks'
import type { UserPublic } from '@/typings'

function ContactSearch() {
  const { token } = useThemeToken()
  const [userInfo, setUserInfo] = useState<UserPublic | null>(null)

  return (
    <Flex vertical gap={token.paddingLG} style={{ padding: token.paddingLG }}>
      <Card style={{ width: '100%' }}>
        <Input.Search
          placeholder="搜索用户"
          onSearch={(value) => {
            queryUserInfo(value).then((res) => {
              setUserInfo(res)
            })
          }}
        />
      </Card>
      {userInfo && (
        <Card style={{ width: '100%' }}>
          <UserInfo user={userInfo} />
        </Card>
      )}
    </Flex>
  )
}

export default ContactSearch

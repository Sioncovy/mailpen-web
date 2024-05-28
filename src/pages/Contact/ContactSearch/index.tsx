import { Card, Flex, Input, Typography } from 'antd'
import { useState } from 'react'
import { queryUserInfo } from '@/apis'
import UserInfo from '@/components/UserInfo'
import { useThemeToken } from '@/hooks'
import type { UserPublic } from '@/typings'

function ContactSearch() {
  const { token } = useThemeToken()
  const [userInfo, setUserInfo] = useState<UserPublic | null>(null)
  const [username, setUsername] = useState('')

  return (
    <Flex
      vertical
      gap={token.paddingLG}
      style={{
        padding: token.paddingLG,
        background: token.colorBgLayout,
        height: '100%'
      }}
    >
      <Typography.Title level={3}>搜索用户</Typography.Title>
      <Card style={{ width: '100%', flex: 1 }}>
        <Flex vertical gap={24}>
          <Input.Search
            placeholder="搜索用户"
            onSearch={(value) => {
              setUsername(value)
              queryUserInfo(value).then((res) => {
                setUserInfo(res)
              })
            }}
          />
          {userInfo ? (
            <Card style={{ width: '100%' }}>
              <UserInfo user={userInfo} />
            </Card>
          ) : (
            <Flex justify="center">
              <Typography.Title
                level={5}
                style={{
                  color: token.colorTextSecondary,
                  fontWeight: 'normal'
                }}
              >
                {username ? `> 未查询到用户 <` : '请输入用户名进行搜索'}
              </Typography.Title>
            </Flex>
          )}
        </Flex>
      </Card>
    </Flex>
  )
}

export default ContactSearch

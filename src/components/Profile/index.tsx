import { Card, Flex } from 'antd'
import UserInfo from '../UserInfo'
import { useAppStore, useThemeToken } from '@/hooks'

function Profile() {
  const [userInfo] = useAppStore(state => [state.userInfo])
  const { token } = useThemeToken()
  return (
    <Flex style={{ background: token.colorBgContainer, width: '100%' }} justify="center" align="center">
      <Card style={{ width: '80%' }}>
        <UserInfo user={userInfo} />
      </Card>
    </Flex>
  )
}

export default Profile

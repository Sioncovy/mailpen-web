import { Flex } from 'antd'
import { useThemeToken } from '@/hooks'

function Home() {
  const { token } = useThemeToken()
  return (
    <Flex justify="center" align="center" style={{ height: '100%', width: '100%' }}>
      <span style={{ fontSize: token.fontSizeHeading4 }}>对你思念的人诉说吧~</span>
    </Flex>
  )
}

export default Home

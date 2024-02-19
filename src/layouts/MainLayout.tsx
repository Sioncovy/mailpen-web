import { ConfigProvider, Layout } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import { useSplitPane, useThemeToken } from '@/hooks'
import { AUTH_TOKEN_KEY } from '@/config'
import Loading from '@/components/Loading'
import Sider from '@/components/Sider'

function MainLayout(props: any) {
  const { token } = useThemeToken()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token)
      navigate('/login', { replace: true })
    setLoading(false)
  }, [])

  const { props: splitPaneProps } = useSplitPane({
    color: token.colorBorder,
    minSize: 160,
    dragMinSize: 160,
    defaultSize: 200,
    maxSize: 360,
    key: 'main',
  })

  if (loading) {
    return (
      <Loading height="100vh" />
    )
  }

  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
    >
      <Layout>
        <Layout.Sider />
        <Layout>
          <SplitPane {...splitPaneProps}>
            <div>
              <div>侧边</div>
            </div>
            {props.children}
          </SplitPane>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default MainLayout

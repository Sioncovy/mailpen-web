import { ConfigProvider, Layout, Menu } from 'antd'
import { MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import { useAppStore, useSplitPane, useThemeToken } from '@/hooks'
import { AUTH_TOKEN_KEY } from '@/config'
import Loading from '@/components/Loading'
import Sider from '@/components/Sider'

function MainLayout(props: any) {
  const { token } = useThemeToken()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [theme] = useAppStore(state => [state.theme])
  const [loading, setLoading] = useState(true)

  const selectedKey = pathname.split('/')[1]

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
    defaultSize: 300,
    maxSize: 500,
    key: 'main',
  })

  if (loading)
    return <Loading height="100vh" />

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
        },
      }}
    >
      <Layout>
        <Layout.Sider theme={theme} collapsible>
          <Menu
            selectedKeys={[selectedKey]}
            style={{ height: '100%' }}
            items={[
              {
                key: 'chat',
                title: '聊天',
                label: '聊天',
                icon: <MessageOutlined />,
                onClick: () => navigate('/chat'),
              },
              {
                key: 'contact',
                title: '联系人',
                label: '联系人',
                icon: <UserOutlined />,
                onClick: () => navigate('/contact'),
              },
              {
                key: 'setting',
                title: '设置',
                label: '设置',
                icon: <SettingOutlined />,
                onClick: () => navigate('/setting'),
              },
            ]}
          />
        </Layout.Sider>
        <Layout style={{ position: 'relative', height: '100vh', backgroundColor: token.colorBgContainer }}>
          <SplitPane {...splitPaneProps}>
            <Sider />
            {props.children}
          </SplitPane>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default MainLayout

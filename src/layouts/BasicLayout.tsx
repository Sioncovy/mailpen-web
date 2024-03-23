import { MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { ConfigProvider, Layout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/hooks'
import { AUTH_TOKEN_KEY } from '@/config'
import Loading from '@/components/Loading'

function BasicLayout(props: any) {
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

  if (loading)
    return <Loading height="100vh" />

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8090f0',
        },
      }}
    >
      <Layout style={{ height: '100vh' }}>
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
        {props.children}
      </Layout>
    </ConfigProvider>
  )
}

export default BasicLayout

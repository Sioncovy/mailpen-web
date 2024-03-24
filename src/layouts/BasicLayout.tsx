import { MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import type { GlobalToken } from 'antd'
import { ConfigProvider, Layout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore, useThemeToken } from '@/hooks'
import { AUTH_TOKEN_KEY } from '@/config'
import Loading from '@/components/Loading'

function AddThemeToVars() {
  const { token: realToken } = useThemeToken()

  useEffect(() => {
    realToken.fontSizeSM = 12
    const usefulToken = Object.keys(realToken).filter(_ => !/-[0-9]/.test(_))
    usefulToken.forEach((key) => {
      const needUnit = ['borderRadius', 'fontSize', 'size']
      document.documentElement.style.setProperty(
        `--${key}`,
        needUnit.some(item => key.startsWith(item))
          ? `${realToken[key as (keyof GlobalToken)]}px` as string
          : realToken[key as (keyof GlobalToken)] as string,
      )
    })
  }, [realToken])

  return null
}

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
      <AddThemeToVars />
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

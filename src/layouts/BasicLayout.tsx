import {
  MessageOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { GlobalToken } from 'antd'
import {
  Avatar,
  ConfigProvider,
  Flex,
  Layout,
  Menu,
  theme as themeAntd
} from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { socket, useAppStore, useThemeToken } from '@/hooks'
import { AUTH_TOKEN_KEY } from '@/config'
import Loading from '@/components/Loading'
import { queryContactList, queryProfile } from '@/apis'
import { Theme } from '@/typings'
import zh from 'antd/es/locale/zh_CN'

function AddThemeToVars() {
  const { token: realToken } = useThemeToken()

  useEffect(() => {
    realToken.fontSizeSM = 12
    const usefulToken = Object.keys(realToken).filter((_) => !/-[0-9]/.test(_))
    usefulToken.forEach((key) => {
      const needUnit = ['borderRadius', 'fontSize', 'size']
      document.documentElement.style.setProperty(
        `--${key}`,
        needUnit.some((item) => key.startsWith(item))
          ? (`${realToken[key as keyof GlobalToken]}px` as string)
          : (realToken[key as keyof GlobalToken] as string)
      )
    })
  }, [realToken])

  return null
}

function BasicLayout(props: any) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [
    theme,
    userInfo,
    setUserInfo,
    setContactList,
    primaryColor,
    layoutColor
  ] = useAppStore((state) => [
    state.theme,
    state.userInfo,
    state.setUserInfo,
    state.setContactList,
    state.primaryColor,
    state.layoutColor
  ])
  const [loading, setLoading] = useState(true)

  const selectedKey = pathname.split('/')[1]

  const getContactList = () => {
    queryContactList().then((res) => {
      if (res) setContactList(res)
    })
  }

  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      navigate('/login', { replace: true })
      setLoading(false)
    }

    queryProfile()
      .then((res) => {
        setUserInfo(res)
        socket.emit('login', {
          id: res._id
        })
      })
      .catch(() => {
        navigate('/login', { replace: true })
      })
      .finally(() => {
        setLoading(false)
      })

    getContactList()
  }, [])

  if (loading) return <Loading height="100vh" />

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor
          // colorBgContainer: layoutColor
        },
        algorithm:
          theme === Theme.Light
            ? themeAntd.defaultAlgorithm
            : themeAntd.darkAlgorithm
      }}
      locale={zh}
    >
      <AddThemeToVars />
      <Layout style={{ height: '100vh' }}>
        <Layout.Sider
          theme={theme}
          collapsed
          style={{
            background: 'var(--colorBgContainer)',
            borderRight: '1px solid var(--colorBorderSecondary)'
          }}
        >
          <Flex
            justify="center"
            style={{ margin: '20px 0' }}
            onClick={() => {
              navigate('/profile')
            }}
          >
            <Avatar style={{ height: 40, width: 40 }} src={userInfo.avatar} />
          </Flex>
          <Menu
            selectedKeys={[selectedKey]}
            style={{
              height: 'calc(100vh-40px)',
              borderInlineEnd: 'none'
            }}
            items={[
              {
                key: 'chat',
                title: '聊天',
                label: '聊天',
                icon: <MessageOutlined />,
                onClick: () => navigate('/chat')
              },
              {
                key: 'contact',
                title: '联系人',
                label: '联系人',
                icon: <UserOutlined />,
                onClick: () => navigate('/contact')
              },
              {
                key: 'setting',
                title: '设置',
                label: '设置',
                icon: <SettingOutlined />,
                onClick: () => navigate('/setting')
              }
            ]}
          />
        </Layout.Sider>
        {props.children}
      </Layout>
    </ConfigProvider>
  )
}

export default BasicLayout

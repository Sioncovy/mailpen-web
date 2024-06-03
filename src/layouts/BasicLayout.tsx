import { queryContactList, queryProfile } from '@/apis'
import Loading from '@/components/Loading'
import { AUTH_TOKEN_KEY } from '@/config'
import { socket, useAppStore, useThemeToken, useTime } from '@/hooks'
import { mailpenDatabase } from '@/storages'
import { ChatMessageType, Message, MessageSpecialType, Theme } from '@/typings'
import {
  decryptMessage,
  decryptRSAEncryptedAESKey,
  generateRSAKeyPair
} from '@/utils/crypto'
import {
  MessageOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useLatest } from 'ahooks'
import type { GlobalToken } from 'antd'
import {
  Avatar,
  ConfigProvider,
  Flex,
  Layout,
  Menu,
  theme as themeAntd
} from 'antd'
import zh from 'antd/es/locale/zh_CN'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

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
  const params = useParams()
  const username = params.username as string
  const [
    theme,
    userInfo,
    setUserInfo,
    setContactList,
    primaryColor
    // layoutColor
  ] = useAppStore((state) => [
    state.theme,
    state.userInfo,
    state.setUserInfo,
    state.setContactList,
    state.primaryColor
    // state.layoutColor
  ])
  const [loading, setLoading] = useState(true)

  const time = useTime()
  const [contactMap] = useAppStore((state) => [state.contactMap])
  const contactMapRef = useLatest(contactMap)

  const readMessage = ({ id }: { id: string }) => {
    mailpenDatabase.messages
      .findOne({
        selector: { _id: id }
      })
      .update({
        $set: {
          read: true
        }
      })
  }

  const updateMessage = (message: Message) => {
    mailpenDatabase.messages
      .findOne({ selector: { _id: message._id } })
      .update({
        $set: message
      })
  }

  const receiveMessage = async (message: Message) => {
    const sender = contactMapRef.current.get(message.sender)
    const chat = await mailpenDatabase.chats
      .findOne({ selector: { _id: sender?.username } })
      .exec()
    if (message.type === ChatMessageType.Text) {
      message.content = decryptMessage(message.content)
    }

    if (!chat) {
      sender &&
        (await mailpenDatabase.chats.insert({
          _id: sender.username,
          name: sender.remark || sender.nickname || sender.username,
          avatar: sender.avatar || '',
          message,
          count: 1,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          pinned: false
        }))
    } else {
      await chat.update({
        $set: {
          message,
          count: chat.count + 1,
          updatedAt: message.updatedAt
        }
      })
    }
    await mailpenDatabase.messages.insert(message)
  }

  const callbackChatMessage = async (message: Message) => {
    const target = contactMapRef.current.get(message.receiver)

    const chat = await mailpenDatabase.chats
      .findOne({ selector: { _id: target?.username } })
      .exec()
    if (message.type === ChatMessageType.Text) {
      message.content = decryptMessage(message.content)
    }
    if (!chat) return
    await chat.update({
      $set: {
        message,
        count: chat.count + 1,
        updatedAt: message.updatedAt
      }
    })
    await mailpenDatabase.messages.insert(message)
  }

  const withdrawMessage = async ({ id }: { id: string }) => {
    await mailpenDatabase.messages.findOne({ selector: { _id: id } }).update({
      $set: {
        content: '消息已撤回',
        type: ChatMessageType.Tip,
        special: MessageSpecialType.Normal
      }
    })
    await mailpenDatabase.chats
      .findOne({ selector: { _id: username } })
      .update({
        $set: {
          message: {
            content: '消息已撤回',
            type: ChatMessageType.Tip,
            special: MessageSpecialType.Normal
          }
        }
      })
  }

  useEffect(() => {
    socket.on('receiveChatMessage', receiveMessage)
    socket.on('callbackChatMessage', callbackChatMessage)

    socket.on('onReadMessage', readMessage)
    socket.on('onUpdateMessage', updateMessage)

    socket.on('onWithdrawMessage', withdrawMessage)

    return () => {
      socket.off('receiveChatMessage', receiveMessage)
      socket.off('callbackChatMessage', callbackChatMessage)
      socket.off('onReadMessage', readMessage)
      socket.off('onUpdateMessage', updateMessage)
      socket.off('onWithdrawMessage', withdrawMessage)
    }
  }, [])

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
      .then(async (res) => {
        setUserInfo(res)
        const { privateKeyPem, publicKeyPem } = generateRSAKeyPair()
        localStorage.setItem('privateKey', privateKeyPem)
        socket.emit('login', {
          id: res._id,
          key: publicKeyPem
        })
      })
      .catch(() => {
        navigate('/login', { replace: true })
      })
      .finally(() => {
        setLoading(false)
      })

    getContactList()

    socket.on('onAesKey', (data: { key: string }) => {
      const key = decryptRSAEncryptedAESKey(data.key)
      localStorage.setItem('aesKey', key)
    })

    return () => {
      socket.off('onAesKey')
    }
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

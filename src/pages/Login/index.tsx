import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Form, Input, Space, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import type { User } from '@/typings'
import { useAppStore, useThemeToken } from '@/hooks'
import { AUTH_TOKEN_KEY } from '@/config'
import { login, getAuthSvg } from '@/apis'
import dayjs from 'dayjs'

function Login() {
  const [loading, setLoading] = useState(false)
  const [messageApi, messageContext] = message.useMessage()
  const { token } = useThemeToken()
  const [setUserInfo] = useAppStore((res) => [res.setUserInfo])
  const navigate = useNavigate()
  const [codeImg, setCodeImg] = useState('')
  const [timestamp, setTimestamp] = useState(0)

  const getAuthCode = async () => {
    const time = dayjs().valueOf()
    setTimestamp(time)
    const res = await getAuthSvg(time)
    setCodeImg(res)
  }
  useEffect(() => {
    getAuthCode()
  }, [])
  return (
    <Flex vertical justify="center" align="center" style={{ height: '100vh' }}>
      {messageContext}
      <Card
        style={{ width: 400, boxShadow: token.boxShadow }}
        styles={{
          body: {
            padding: `${token.padding}px ${token.paddingXL}px`,
            paddingBottom: 0
          }
        }}
      >
        <Space size={8} style={{ margin: '20px 0' }}>
          <div className={styles.bar} />
          <div style={{ fontSize: 22 }}>登录 Mailpen</div>
        </Space>
        <Form<Pick<User, 'username' | 'password'> & { code: string }>
          onFinish={(values) => {
            setLoading(true)
            login({ ...values, timestamp })
              .then((res) => {
                messageApi.success('登录成功')
                if (res) {
                  localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken)
                  // localStorage.setItem(UPLOAD_TOKEN_KEY, res.uploadToken)
                  setUserInfo(res.userInfo)
                  navigate('/')
                }
                setLoading(false)
              })
              .catch((err) => {
                messageApi.error(err.message)
                getAuthCode()
                setLoading(false)
              })
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[{ required: true, message: '验证码不能为空' }]}
          >
            <Flex gap={8} align="center">
              <Input placeholder="验证码" />
              <div
                dangerouslySetInnerHTML={{ __html: codeImg }}
                onClick={getAuthCode}
              ></div>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Flex vertical justify="center">
              <Button block type="primary" htmlType="submit" loading={loading}>
                登录
              </Button>
              <Button type="link" href="/register">
                还没有账号？去注册一个
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}

export default Login

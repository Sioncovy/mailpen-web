import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Form, Input, Space, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { login } from '@/apis'
import { AUTH_TOKEN_KEY } from '@/config'
import { useAppStore, useThemeToken } from '@/hooks'
import type { User } from '@/typings'

function Login() {
  const [loading, setLoading] = useState(false)
  const [messageApi, messageContext] = message.useMessage()
  const { token } = useThemeToken()
  const [setUserInfo] = useAppStore(res => [res.setUserInfo])
  const navigate = useNavigate()

  return (
    <Flex vertical justify="center" align="center" style={{ height: '100vh' }}>
      {messageContext}
      <Card style={{ width: 400, boxShadow: token.boxShadow }}>
        <Space size={8} style={{ margin: '20px 0' }}>
          <div className={styles.bar} />
          <div style={{ fontSize: 22 }}>
            登录 Mailpen
          </div>
        </Space>
        <Form<Pick<User, 'username' | 'password'>> onFinish={(values) => {
          setLoading(true)
          login(values).then((res) => {
            messageApi.success('登录成功')
            if (res) {
              localStorage.setItem(AUTH_TOKEN_KEY, res.access_token)
              setUserInfo(res.userInfo)
              navigate('/')
            }
            setLoading(false)
          }).catch((err) => {
            messageApi.error(err.message)
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
          <Form.Item>
            <Button
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}

export default Login

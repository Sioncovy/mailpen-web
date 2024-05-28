import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Form, Input, Space, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import type { User } from '@/typings'
import { useThemeToken } from '@/hooks'
import { register, sendEmailCode } from '@/apis'

function Register() {
  const [loading, setLoading] = useState(false)
  const [messageApi, messageContext] = message.useMessage()
  const { token } = useThemeToken()
  const navigate = useNavigate()
  const [form] = Form.useForm()

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
          <div style={{ fontSize: 22 }}>注册 Mailpen</div>
        </Space>
        <Form<Pick<User, 'username' | 'password'> & { code: string }>
          form={form}
          onFinish={(values) => {
            setLoading(true)
            register(values)
              .then(() => {
                messageApi.success('注册成功，3秒后跳转到登录页')
                setTimeout(() => {
                  navigate('/login')
                }, 3000)
                setLoading(false)
              })
              .catch((err) => {
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
          <Form.Item
            name="email"
            rules={[{ required: true, message: '邮箱不能为空' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[{ required: true, message: '验证码不能为空' }]}
          >
            <Flex gap={8} align="center">
              <Input placeholder="验证码" />
              <Button
                type="link"
                onClick={() => {
                  form.validateFields(['email']).then(({ email }) => {
                    sendEmailCode({ email })
                      .then(() => {
                        messageApi.success('验证码已发送')
                      })
                      .catch((err) => {
                        messageApi.error(err.message)
                      })
                  })
                }}
              >
                获取验证码
              </Button>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Flex vertical justify="center">
              <Button block type="primary" htmlType="submit" loading={loading}>
                注册
              </Button>
              <Button type="link" href="/login">
                已经有账号了？直接去登录
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}

export default Register

import { updateContact, deleteContact } from '@/apis'
import { useThemeToken } from '@/hooks'
import { mailpenDatabase } from '@/storages'
import type { Contact } from '@/typings'
import { Button, Card, Flex, Modal, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormModal from '../FormModal'
import styles from './index.module.less'

interface ContactInfoProps {
  contact: Contact
  refresh: () => void
}

function ContactInfo(props: ContactInfoProps) {
  const [contact, setContact] = useState<Contact | undefined>(props.contact)
  const { token } = useThemeToken()
  const navigate = useNavigate()
  const [useModal, modalContext] = Modal.useModal()
  const [messageApi, messageContextHolder] = message.useMessage()
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    if (!props.contact) return
    setContact(props.contact)
  }, [props.contact])

  if (!contact) return null

  return (
    <Flex justify="center">
      {modalContext}
      {messageContextHolder}
      <Flex gap={40} className={styles.container}>
        <Flex gap={8} vertical className={styles.left}>
          <img className={styles.avatar} src={contact.avatar} />
          <Flex vertical gap={0}>
            <Typography.Text
              style={{
                fontSize: token.fontSizeHeading4,
                color: token.colorTextTertiary,
                marginBottom: -token.marginXS
              }}
            >
              {contact.username}
            </Typography.Text>
            <Typography.Text style={{ fontSize: token.fontSizeHeading3 }}>
              {contact.remark
                ? `${contact.remark}（${contact.nickname || contact.username}）`
                : contact.nickname || contact.username}
            </Typography.Text>
            {/* <Typography.Text ellipsis style={{ fontSize: token.fontSizeLG }}>
              {remark
                ? `${remark}（${nickname || username}）`
                : nickname || username}
            </Typography.Text> */}
          </Flex>
          <Flex vertical gap={0}>
            <div style={{ fontSize: token.fontSizeHeading5 }}>四川·乐山</div>
            <Typography.Text style={{ fontSize: token.fontSizeHeading5 }}>
              {contact.email}
            </Typography.Text>
          </Flex>
          <Flex vertical gap={8}>
            <Button
              block
              onClick={async () => {
                const chat = await mailpenDatabase.chats
                  .findOne({ selector: { _id: contact.username } })
                  .exec()
                if (!chat && contact.username) {
                  await mailpenDatabase.chats.insert({
                    _id: contact.username,
                    name:
                      contact.remark || contact.nickname || contact.username,
                    avatar: contact.avatar,
                    message: null,
                    count: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    pinned: false
                  })
                }
                navigate(`/chat/${contact.username}`)
              }}
            >
              去聊天
            </Button>
            <Flex gap={8}>
              <Button
                block
                onClick={() => {
                  setEditOpen(true)
                }}
              >
                编辑
              </Button>
              <Button
                block
                danger
                onClick={async () => {
                  useModal.confirm({
                    title: '删除好友',
                    content: '确定要删除该好友吗？',
                    onOk: async () => {
                      deleteContact(contact._id)
                        .then(() => {
                          messageApi.success('删除成功')
                          navigate('/contact')
                        })
                        .catch(() => {
                          messageApi.error('删除失败')
                        })
                    }
                  })
                }}
              >
                删除好友
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Card className={styles.right}>
          <div
            style={{
              color: token.colorTextSecondary,
              marginBottom: token.marginXS
            }}
          >
            个人简介
          </div>
          <Typography.Text style={{ fontSize: token.fontSizeHeading5 }}>
            {contact.bio}
          </Typography.Text>
        </Card>
      </Flex>
      <FormModal
        title="编辑好友信息"
        open={editOpen}
        centered
        onClose={() => setEditOpen(false)}
        onConfirm={(values) => {
          console.log(values)
          setEditOpen(false)
          updateContact(contact._id, values)
            .then(() => {
              props.refresh()
              messageApi.success('编辑成功')
            })
            .catch((error) => {
              console.log('✨  ~ ContactInfo ~ error:', error)
              messageApi.error(error.message)
            })
        }}
        initValues={{
          remark: contact.remark,
          star: contact.star
        }}
        items={[
          {
            type: 'input',
            label: '备注',
            name: 'remark',
            placeholder: '请输入对好友的备注'
          },
          {
            type: 'switch',
            label: '星标好友',
            name: 'star'
          }
          // {
          //   type: 'select',
          //   label: '分组',
          //   name: 'group',
          //   options: [
          //     { label: '家人', value: '家人' },
          //     { label: '朋友', value: '朋友' },
          //     { label: '同事', value: '同事' }
          //   ],
          //   placeholder: '请选择分组'
          // }
        ]}
      />
    </Flex>
  )
}

export default ContactInfo

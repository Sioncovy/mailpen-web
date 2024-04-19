import { Dropdown, Flex, Input, Modal, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useMeasure } from 'react-use'
import styles from './index.module.less'
import type { Contact } from '@/typings'
import { useThemeToken } from '@/hooks'

interface ContactItemProps {
  contact: Contact
}

function ContactItem({ contact }: ContactItemProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const { token } = useThemeToken()
  const { remark } = contact
  const { avatar, bio, nickname, username } = contact
  const navigate = useNavigate()
  const { username: routeUsername } = useParams()
  const [useModal, modalContext] = Modal.useModal()

  return (
    <>
      {modalContext}
      <Dropdown
        menu={{
          items: [
            {
              key: 'remark',
              label: '修改备注',
              onClick: () => {
                useModal.confirm({
                  title: '修改备注',
                  content: (
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入备注"
                      defaultValue={remark}
                    />
                  ),
                  onOk: () => { },
                  onCancel: () => { },

                })
              },
            },
            {
              key: 'group',
              label: '修改分组',
              onClick: () => {
                useModal.confirm({
                  title: '修改分组',
                  content: (
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入分组"
                    />
                  ),
                  onOk: () => { },
                  onCancel: () => { },
                })
              },
            },
          ],
        }}
        trigger={['contextMenu']}
      >
        <Flex
          ref={ref}
          onClick={async () => {
            navigate(`/contact/${username}`)
          }}
          style={{ backgroundColor: routeUsername === username ? token.colorPrimaryActive : undefined }}
          gap={10}
          className={styles.contactItem}
        >
          <div style={{ minWidth: 50, height: 50, borderRadius: '50%', overflow: 'hidden' }}>
            <img style={{ height: '100%' }} src={avatar} />
          </div>
          <Flex vertical style={{ width: width - 60 }} justify="space-between">
            <Flex justify="space-between" align="center">
              <Typography.Text ellipsis style={{ fontSize: token.fontSizeLG }}>
                {remark ? `${remark}（${nickname || username}）` : nickname || username}
              </Typography.Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Typography.Text ellipsis>
                {bio}
              </Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      </Dropdown>
    </>
  )
}

export default ContactItem

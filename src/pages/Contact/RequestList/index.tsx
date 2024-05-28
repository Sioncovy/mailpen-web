import {
  approveRequest,
  queryContactList,
  queryRequestList,
  rejectRequest
} from '@/apis'
import { useAppStore, useThemeToken, useTime } from '@/hooks'
import { FriendRequestStatus, type Request } from '@/typings'
import { Dropdown, Flex, message, Modal, Typography } from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.module.less'

function RequestList() {
  const [userInfo, setContactList] = useAppStore((state) => [
    state.userInfo,
    state.setContactList
  ])
  const [requestList, setRequestList] = useState<Request[]>([])
  const time = useTime()
  const { token } = useThemeToken()
  const [modal, modalContextHolder] = Modal.useModal()
  const [messageApi, messageContextHolder] = message.useMessage()

  const getContactList = () => {
    queryContactList().then((res) => {
      if (res) setContactList(res)
    })
  }

  const getRequestList = () => {
    queryRequestList().then((res) => {
      setRequestList(res)
    })
  }

  useEffect(() => {
    getRequestList()
  }, [])

  return (
    <Flex vertical gap={12} className={styles.container} align="center">
      {modalContextHolder}
      {messageContextHolder}
      {requestList.map((request) => {
        const isSelf = userInfo._id === request.user._id
        const friend = isSelf ? request.friend : request.user
        return (
          <Flex
            className={styles.requestItem}
            style={{ padding: `${token.paddingMD}px ${token.paddingXL}px` }}
            key={request._id}
          >
            <Flex gap={20} flex={1}>
              <div className={styles.avatar}>
                <img
                  src={friend.avatar}
                  alt={`${friend.nickname || friend.username}头像`}
                />
              </div>
              <Flex vertical gap={8} justify="center">
                <Flex gap={4} align="center">
                  <Typography.Text
                    className={styles.nickname}
                    style={{ fontWeight: 'bold', color: token.colorPrimary }}
                  >
                    {friend.nickname || friend.username}
                  </Typography.Text>
                  {isSelf ? (
                    <Typography.Text>正在验证你的邀请</Typography.Text>
                  ) : (
                    <Typography.Text>请求添加为好友</Typography.Text>
                  )}
                  <Typography.Text
                    type="secondary"
                    style={{ textAlign: 'center' }}
                  >
                    {time(request.createdAt).format('YYYY-MM-DD')}
                  </Typography.Text>
                </Flex>
                <Typography.Text type="secondary">
                  留言：
                  {request.reason ||
                    (isSelf ? '请求添加对方为好友' : '请求添加你为好友')}
                </Typography.Text>
              </Flex>
            </Flex>
            <Flex align="center">
              {isSelf && request.status === FriendRequestStatus.Pending && (
                <Typography.Text>等待验证</Typography.Text>
              )}
              {!isSelf && request.status === FriendRequestStatus.Pending && (
                <Dropdown.Button
                  trigger={['click']}
                  onClick={() => {
                    approveRequest({
                      requestId: request._id
                    })
                      .then(() => {
                        getContactList()
                        getRequestList()
                        messageApi.success({ content: '已同意好友申请' })
                      })
                      .catch((e) => {
                        messageApi.error({ content: e.message })
                      })
                  }}
                  menu={{
                    items: [
                      {
                        key: 'reject',
                        label: '拒绝'
                      }
                    ],
                    onClick: ({ key }) => {
                      if (key === 'reject') {
                        modal.confirm({
                          title: '拒绝好友申请',
                          content: `是否要拒绝 ${
                            friend.nickname || friend.username
                          } 的好友申请`,
                          onOk: () => {
                            rejectRequest({
                              requestId: request._id
                            })
                              .then(() => {
                                getRequestList()
                                messageApi.success({
                                  content: '已拒绝好友申请'
                                })
                              })
                              .catch(() => {
                                messageApi.error({ content: '拒绝失败' })
                              })
                          }
                        })
                      }
                    }
                  }}
                >
                  同意
                </Dropdown.Button>
              )}
              {request.status === FriendRequestStatus.Accepted && (
                <Typography.Text>已同意</Typography.Text>
              )}
              {request.status === FriendRequestStatus.Rejected && (
                <Typography.Text>已拒绝</Typography.Text>
              )}
            </Flex>
          </Flex>
        )
      })}
    </Flex>
  )
}

export default RequestList

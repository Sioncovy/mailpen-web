import { Dropdown, Flex, Modal, Typography } from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.module.less'
import { approveRequest, queryRequestList, rejectRequest } from '@/apis'
import { useAppStore, useThemeToken, useTime } from '@/hooks'
import { FriendRequestStatus, type Request } from '@/typings'

function RequestList() {
  const [userInfo] = useAppStore(state => [state.userInfo])
  const [requestList, setRequestList] = useState<Request[]>([])
  const time = useTime()
  const { token } = useThemeToken()
  const [modal, modalContextHolder] = Modal.useModal()

  useEffect(() => {
    queryRequestList().then((res) => {
      setRequestList(res)
    })
  }, [])

  return (
    <Flex vertical className={styles.container} align="center">
      {modalContextHolder}
      {requestList.map((request) => {
        const isSelf = userInfo._id === request.user._id
        const friend = isSelf ? request.friend : request.user
        return (
          (
            <Flex
              className={styles.requestItem}
              style={{ padding: `${token.paddingMD}px ${token.paddingXL}px` }}
              key={request._id}
            >
              <Flex gap={20} flex={1}>
                <div className={styles.avatar}>
                  <img src={friend.avatar} alt={`${friend.nickname}头像`} />
                </div>
                <Flex vertical gap={8} justify="center">
                  <Flex gap={4} align="center">
                    <Typography.Text className={styles.nickname} style={{ fontWeight: 'bold', color: token.colorPrimary }}>
                      {friend.nickname}
                    </Typography.Text>
                    {isSelf ? (<span>正在验证你的邀请</span>) : (<span>请求添加为好友</span>)}
                    <Typography.Text type="secondary" style={{ textAlign: 'center' }}>
                      {time(request.createdAt).format('YYYY-MM-DD')}
                    </Typography.Text>
                  </Flex>
                  <Typography.Text type="secondary">
                    留言：
                    {request.reason || (isSelf ? '请求添加对方为好友' : '请求添加你为好友')}
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex align="center">
                {isSelf && request.status === FriendRequestStatus.Pending && (<span>等待验证</span>)}
                {!isSelf && request.status === FriendRequestStatus.Pending && ((
                  <Dropdown.Button
                    trigger={['click']}
                    onClick={() => {
                      approveRequest({
                        requestId: request._id,
                      })
                    }}
                    menu={{
                      items: [{
                        key: 'reject',
                        label: '拒绝',
                      }],
                      onClick: ({ key }) => {
                        if (key === 'reject') {
                          modal.confirm({
                            title: '拒绝好友申请',
                            content: `是否要拒绝 ${friend.nickname || friend.username} 的好友申请`,
                            onOk: () => {
                              rejectRequest({
                                requestId: request._id,
                              })
                            },
                          })
                        }
                      },
                    }}
                  >
                    同意
                  </Dropdown.Button>
                ))}
                {request.status === FriendRequestStatus.Accepted && (<span>已同意</span>)}
                {request.status === FriendRequestStatus.Rejected && (<span>已拒绝</span>)}
              </Flex>
            </Flex>
          )
        )
      })}
    </Flex>
  )
}

export default RequestList
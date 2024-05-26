import { queryContact } from '@/apis'
import { socket, useAppStore, useThemeToken } from '@/hooks'
import { useStateStore } from '@/hooks/useStateStore'
import { mailpenDatabase } from '@/storages'
import type { Chat as ChatType, Message as MessageType } from '@/typings'
import { getLocalUserMedia } from '@/utils'
import { PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Tooltip, Typography, message } from 'antd'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import VideoPlayer from '../MediaPlayer'
import InputArea from './InputArea'
import Message from './Message'
import Home from '@/pages/Home'

interface ChatProps {
  chat?: ChatType
}

export enum CallType {
  Audio = 'audio',
  Video = 'video'
}

function Chat({ chat }: ChatProps) {
  const { token } = useThemeToken()
  const [user, contactList] = useAppStore((state) => [
    state.userInfo,
    state.contactList
  ])
  const [setVideo] = useStateStore((state) => [state.setVideo])
  const friend = contactList.find((contact) => contact.username === chat?._id)
  const [messageList, setMessageList] = useState<MessageType[]>([])
  const messageBoxBottomRef = useRef<HTMLDivElement>(null)
  const [callType, setCallType] = useState<CallType | null>(null)
  const [messageApi, messageContextHolder] = message.useMessage()

  const PeerConnection = window.RTCPeerConnection

  // const [channel, setChannel] = useState<RTCDataChannel | null>(null)
  const [localRtcPc, setLocalRtcPc] = useState<RTCPeerConnection>()
  // const [constraints, setConstraints] = useState<Constraints>({
  //   audio: true,
  //   video: true
  // })
  // 配置 STUN 服务器
  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const getContactInfo = () => {
    if (!friend) return null
    queryContact(friend._id)
      .then((res) => {
        const name = friend.remark || friend.nickname || friend.username
        const avatar = friend.avatar
        if (res && (name !== chat?.name || avatar !== chat?.avatar)) {
          mailpenDatabase.chats
            .findOne({
              selector: { _id: friend.username }
            })
            .update({
              $set: {
                name,
                avatar
              }
            })
        }
      })
      .catch((error) => {
        messageApi.error(error.message)
      })
  }

  const scrollToBottom = () => {
    if (messageBoxBottomRef && messageBoxBottomRef.current) {
      messageBoxBottomRef.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  const readMessage = () => {
    if (friend) {
      const notReadMessageList = mailpenDatabase.messages
        .find({
          selector: { sender: friend._id, receiver: user._id, read: false }
        })
        .exec()
      notReadMessageList.then((res) => {
        // console.log('✨  ~ notReadMessageList.then ~ res:', res)
        res.forEach((message) => {
          socket.emit('readMessage', {
            id: message._id,
            receiver: friend._id
          })
        })
      })
    }
  }

  useLayoutEffect(() => {
    setTimeout(async () => {
      scrollToBottom()
      if (friend) {
        const chatRaw = mailpenDatabase.chats.findOne({
          selector: { _id: friend.username }
        })
        const chat = await chatRaw.exec()
        if (chat?.count !== 0) {
          chatRaw.update({
            $set: { count: 0 }
          })
        }
        readMessage()
      }
    }, 100)
  }, [messageList])

  useLayoutEffect(() => {
    if (friend) {
      getContactInfo()
      const messages = mailpenDatabase.messages.find({
        selector: {
          $or: [
            { sender: friend._id, receiver: user._id },
            { sender: user._id, receiver: friend._id }
          ]
        }
      })
      messages.$.subscribe((list) => {
        setMessageList(list)
      })
    }
  }, [friend])

  useEffect(() => {
    socket.on('onCall', async (data) => {
      setCallType(data.type)
      initCalleeInfo(data.sender, data.receiver, data.type)
    })
    return () => {
      socket.off('onCall')
    }
  }, [])

  useEffect(() => {
    if (localRtcPc) {
      socket.on('onOffer', async (data) => {
        // 保存对方发送过来的 offer 并设置为远程描述
        localRtcPc.setRemoteDescription(data.offer)
        // 创建 Answer
        const answer = await localRtcPc.createAnswer()
        // 设置 Answer 为本地描述
        await localRtcPc.setLocalDescription(answer)
        // 通过 Websocket 发送 Answer 给对方
        socket.emit('answer', {
          receiver: data.sender,
          sender: data.receiver,
          answer: answer
        })
      })
      socket.on('onAnswer', async (data) => {
        // 保存对方发送过来的 Answer 并设置为远程描述
        await localRtcPc.setRemoteDescription(data.answer)
      })
      socket.on('onCandidate', async (data) => {
        await localRtcPc.addIceCandidate(data.candidate)
      })

      return () => {
        socket.off('onOffer')
        socket.off('onAnswer')
        socket.off('onCandidate')
      }
    }
  }, [localRtcPc])

  const call = async (type: CallType) => {
    if (user._id && friend?._id) {
      setCallType(type)
      socket.emit('call', {
        type,
        sender: user._id,
        receiver: friend?._id
      })
      initCallerInfo(user._id, friend?._id, type)
      setVideo(true)
    }
  }

  // sender 是自己，receiver 是对方
  const initCallerInfo = async (
    sender: string,
    receiver: string,
    type: CallType
  ) => {
    const pc = new PeerConnection(configuration)

    // 获取本地媒体并添加到 pc 中
    let localStream = await getLocalUserMedia({
      audio: true,
      video: type === CallType.Video
    })
    if (!localStream) {
      console.error('未获取到本地媒体')
      return
    }
    for (let track of localStream.getTracks()) {
      pc.addTrack(track)
    }
    // 设置本地媒体流
    setLocalStream(localStream)
    // 监听 pc 事件
    onPcEvent(pc, sender, receiver)

    // 创建 Offer
    const offer = await pc.createOffer()
    // 将 Offer 设置为本地描述
    await pc.setLocalDescription(offer)
    // 通过 Websocket 发送 Offer 给对方
    socket.emit('offer', {
      receiver: receiver,
      sender: sender,
      offer: offer
    })

    // 初始化pc
    setLocalRtcPc(pc)
  }

  // sender 是对方，receiver 是自己
  const initCalleeInfo = async (
    sender: string,
    receiver: string,
    type: CallType
  ) => {
    const pc = new PeerConnection(configuration)
    setCallType(type)
    const localStream = await getLocalUserMedia({
      audio: true,
      video: type === CallType.Video
    })
    if (!localStream) {
      console.error('未获取到本地媒体')
      return
    }
    for (let track of localStream.getTracks()) {
      pc.addTrack(track)
    }
    setLocalStream(localStream)
    onPcEvent(pc, sender, receiver)

    // 初始化pc
    setLocalRtcPc(pc)
  }

  const onPcEvent = (
    pc: RTCPeerConnection,
    sender: string,
    receiver: string
  ) => {
    if (!pc) return

    // const channel = pc.createDataChannel('chat')
    // setChannel(channel)
    pc.ontrack = (event) => {
      if (remoteStream) {
        setRemoteStream((stream) => {
          stream?.addTrack(event.track)
          return stream
        })
      } else {
        const newStream = new MediaStream()
        newStream.addTrack(event.track)
        setRemoteStream(newStream)
      }
    }
    pc.onnegotiationneeded = () => {
      console.error('重新协商')
    }
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', {
          receiver: receiver,
          sender: sender,
          candidate: event.candidate
        })
      } else {
        /* 在此次协商中，没有更多的候选了 */
        console.log('在此次协商中，没有更多的候选了')
      }
    }
  }

  const withdrawMessage = async (id: string) => {
    socket.emit('withdrawMessage', {
      id,
      chatId: friend?.username,
      receiver: friend?._id
    })
  }

  if (!chat || !friend) return <Home />

  return (
    <Flex
      vertical
      style={{ height: '100%', maxHeight: '100vh', overflow: 'auto' }}
    >
      {messageContextHolder}
      <Flex
        style={{ padding: token.padding, flexShrink: 0 }}
        justify="space-between"
      >
        <Flex align="center" gap={8}>
          <div
            style={{
              minWidth: 50,
              height: 50,
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <img style={{ height: '100%' }} src={chat.avatar} />
          </div>
          <Flex vertical gap={2}>
            <Typography.Text
              style={{ fontSize: token.fontSizeLG, fontWeight: 'bold' }}
            >
              {chat.name}
            </Typography.Text>
            <Typography.Text type="secondary">{friend?.bio}</Typography.Text>
          </Flex>
        </Flex>
        <Flex align="center" gap={8}>
          <Tooltip title="语音通话">
            <Button
              type="text"
              size="large"
              icon={<PhoneOutlined />}
              onClick={() => {
                call(CallType.Audio)
              }}
            />
          </Tooltip>
          <Tooltip title="视频通话">
            <Button
              type="text"
              size="large"
              icon={<VideoCameraOutlined />}
              onClick={() => {
                call(CallType.Video)
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <Flex flex={1} style={{ overflow: 'auto' }}>
        <Flex vertical style={{ flex: 3, height: '100%' }}>
          <Flex
            flex={1}
            gap={8}
            vertical
            style={{
              padding: token.padding,
              overflow: 'auto',
              display: 'flex'
            }}
          >
            {messageList.map((message) => {
              const isSelf = message.sender === user._id
              const info = isSelf ? user : friend
              return (
                <Message
                  key={message._id}
                  message={{
                    _id: message._id,
                    avatar: info?.avatar || '',
                    content: message.content,
                    type: message.type,
                    createdAt: new Date(message.createdAt),
                    updatedAt: new Date(message.updatedAt),
                    position: isSelf ? 'right' : 'left',
                    read: message.read,
                    special: message.special
                  }}
                  withdrawMessage={withdrawMessage}
                />
              )
            })}
            <div ref={messageBoxBottomRef}></div>
          </Flex>
          <Divider style={{ margin: 0 }} />
          <div style={{ padding: `0 ${token.padding}px` }}>
            <InputArea userId={user._id} friendId={friend._id} />
          </div>
        </Flex>
        {callType && (
          <>
            <Divider type="vertical" style={{ height: '100%' }} />
            <Flex vertical gap={24} style={{ flex: 1 }}>
              <Flex vertical>
                <Typography.Title level={5}>我</Typography.Title>
                <div>
                  {localStream && localRtcPc && callType && (
                    <VideoPlayer
                      stream={localStream}
                      type={callType}
                      // localUID={user._id}
                      // remoteUID={friend._id}
                      // peerConnection={localRtcPc}
                    />
                  )}
                </div>
              </Flex>
              <Flex vertical>
                <Typography.Title level={5}>{friend.username}</Typography.Title>
                <div>
                  {remoteStream && callType && (
                    <VideoPlayer
                      stream={remoteStream}
                      type={callType}
                      // remoteUID={user._id}
                      // localUID={friend._id}
                      // peerConnection={localRtcPc}
                    />
                  )}
                </div>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Chat

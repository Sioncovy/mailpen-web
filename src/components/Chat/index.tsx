import { socket, useAppStore, useThemeToken } from '@/hooks'
import { mailpenDatabase } from '@/storages'
import type { Chat as ChatType, Message as MessageType } from '@/typings'
import { Button, Divider, Flex, Tooltip, Typography } from 'antd'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import InputArea from './InputArea'
import Message from './Message'
import { Constraints, getLocalUserMedia } from '@/utils'
import VideoPlayer from '../VideoPlayer'
import { VideoCameraOutlined } from '@ant-design/icons'

interface ChatProps {
  chat?: ChatType
}

function Chat({ chat }: ChatProps) {
  const { token } = useThemeToken()
  const [user, contactList] = useAppStore((state) => [
    state.userInfo,
    state.contactList
  ])
  const friend = contactList.find((contact) => contact.username === chat?._id)
  const [messageList, setMessageList] = useState<MessageType[]>([])
  const messageBoxBottomRef = useRef<HTMLDivElement>(null)

  const PeerConnection = window.RTCPeerConnection

  // const [channel, setChannel] = useState<RTCDataChannel | null>(null)
  const [localRtcPc, setLocalRtcPc] = useState<RTCPeerConnection>()
  const [constraints, setConstraints] = useState<Constraints>({
    audio: true,
    video: true
  })
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const scrollToBottom = () => {
    if (messageBoxBottomRef && messageBoxBottomRef.current) {
      messageBoxBottomRef.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  }, [messageList])

  useLayoutEffect(() => {
    if (friend) {
      const messages = mailpenDatabase.messages.find({
        selector: {
          $or: [
            { sender: friend._id, receiver: user._id },
            { sender: user._id, receiver: friend._id }
          ]
        }
      })
      const notReadMessageList = mailpenDatabase.messages
        .find({
          selector: { sender: friend._id, read: false }
        })
        .exec()
      notReadMessageList.then((res) => {
        res.forEach((message) => {
          socket.emit('readMessage', message._id)
        })
      })

      mailpenDatabase.chats
        .findOne({
          selector: { _id: friend.username }
        })
        .update({
          $set: { count: 0 }
        })
      messages.$.subscribe((list) => {
        setMessageList(list)
      })
    }
  }, [friend])

  // useEffect(() => {
  //   if (user._id && friend?._id) {
  //     initCallerInfo(user._id, friend?._id)
  //   }
  // }, [user._id, friend?._id])

  useEffect(() => {
    socket.on('onCall', async (data) => {
      console.log('onCall', data)
      initCalleeInfo(data.sender, data.receiver)
    })
    return () => {
      socket.off('onCall')
    }
  }, [])

  useEffect(() => {
    if (localRtcPc) {
      socket.on('onOffer', async (data) => {
        console.log('offer', data)
        // 保存对方发送过来的 offer 并设置为远程描述
        localRtcPc.setRemoteDescription(data.offer)
        console.log('✨  ~ socket.on ~ localRtcPc:', localRtcPc)
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
        console.log('answer', data)
        // 保存对方发送过来的 Answer 并设置为远程描述
        await localRtcPc.setRemoteDescription(data.answer)
      })
      socket.on('onCandidate', async (data) => {
        console.log('candidate', data)
        await localRtcPc.addIceCandidate(data.candidate)
      })

      return () => {
        socket.off('onOffer')
        socket.off('onAnswer')
        socket.off('onCandidate')
      }
    }
  }, [localRtcPc])

  const call = async () => {
    if (user._id && friend?._id) {
      socket.emit('call', {
        sender: user._id,
        receiver: friend?._id
      })
      initCallerInfo(user._id, friend?._id)
    }
  }

  // sender 是自己，receiver 是对方
  const initCallerInfo = async (sender: string, receiver: string) => {
    const pc = new PeerConnection()

    // 获取本地媒体并添加到 pc 中
    let localStream = await getLocalUserMedia(constraints)
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
  const initCalleeInfo = async (sender: string, receiver: string) => {
    const pc = new PeerConnection()

    const localStream = await getLocalUserMedia(constraints)
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
    console.log('在监听啦')

    const channel = pc.createDataChannel('chat')
    // setChannel(channel)
    pc.ontrack = (event) => {
      console.log('在接收啦')

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

  if (!chat || !friend) return <div>请选择正确的好友</div>

  return (
    <Flex vertical style={{ height: '100%', maxHeight: '100vh' }}>
      <Flex style={{ padding: token.padding }} justify="space-between">
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
          <Tooltip title="视频通话">
            <Button
              type="text"
              size="large"
              icon={<VideoCameraOutlined />}
              onClick={() => {
                call()
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <Flex flex={1}>
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
                    avatar: info?.avatar || '',
                    content: message.content,
                    type: message.type,
                    createdAt: new Date(message.createdAt),
                    updatedAt: new Date(message.updatedAt),
                    position: isSelf ? 'right' : 'left',
                    read: message.read
                  }}
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
        <Divider type="vertical" style={{ height: '100%' }} />
        <Flex vertical style={{ flex: 1 }}>
          <div>
            {localStream && localRtcPc && (
              <VideoPlayer
                stream={localStream}
                // localUID={user._id}
                // remoteUID={friend._id}
                // peerConnection={localRtcPc}
              />
            )}
          </div>
          <div>
            {remoteStream && localRtcPc && (
              <VideoPlayer
                stream={remoteStream}
                // remoteUID={user._id}
                // localUID={friend._id}
                // peerConnection={localRtcPc}
              />
            )}
          </div>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Chat

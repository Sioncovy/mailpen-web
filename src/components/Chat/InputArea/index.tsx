import { uploadFile } from '@/apis'
import EmojiPicker from '@/components/EmojiPicker'
import FileInfo from '@/components/FileInfo'
import TextButton from '@/components/TextButton'
import { socket, useThemeToken } from '@/hooks'
import { ChatMessageType, MessageSpecialType } from '@/typings'
import { createObjectURL } from '@/utils'
import {
  AudioOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  FileOutlined,
  FireOutlined,
  SmileOutlined,
  StopOutlined
} from '@ant-design/icons'
import {
  Button,
  Flex,
  Image,
  Input,
  Modal,
  Popover,
  Tooltip,
  Typography,
  Upload
} from 'antd'
import Recorder from 'js-audio-recorder'
import { useEffect, useState } from 'react'

interface InputAreaProps {
  userId: string
  friendId: string
}

enum AudioRecordStatus {
  Record = 'record',
  Pause = 'pause',
  Stop = 'stop',
  Init = 'init'
}

function InputArea({ userId, friendId }: InputAreaProps) {
  const [recorder, setRecorder] = useState<Recorder>()

  const [content, setContent] = useState<string>('')
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false)
  const [useModal, modalContext] = Modal.useModal()
  const { token } = useThemeToken()
  const [type, setType] = useState<'normal' | 'audio'>('normal')
  const [audioRecordStatus, setAudioRecordStatus] = useState<AudioRecordStatus>(
    AudioRecordStatus.Init
  )
  const [special, setSpecial] = useState<MessageSpecialType>(
    MessageSpecialType.Normal
  )

  useEffect(() => {
    if (type === 'audio') {
      setRecorder(
        new Recorder({
          sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
          sampleRate: 48000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
          numChannels: 1 // 声道，支持 1 或 2， 默认是1
        })
      )
    }
  }, [type])

  useEffect(() => {
    if (!recorder) return
    if (audioRecordStatus === AudioRecordStatus.Stop) {
      // recorder.downloadWAV('test')
      setAudioRecordStatus(AudioRecordStatus.Init)
      const blob = recorder.getWAVBlob()
      const file = new File([blob], 'audio.wav', {
        type: 'audio/wav'
      })
      uploadFile(file).then((res) => {
        socket.emit('sendChatMessage', {
          content: res,
          sender: userId,
          receiver: friendId,
          type: ChatMessageType.Audio,
          special
        })
      })
    }
  }, [audioRecordStatus])

  return (
    <Flex vertical>
      {modalContext}
      {type === 'normal' && (
        <>
          <Flex gap={4} style={{ margin: `${token.paddingXS}px 0` }}>
            <Tooltip title="表情">
              <Popover
                open={emojiOpen}
                onOpenChange={setEmojiOpen}
                trigger={['click']}
                content={
                  <EmojiPicker
                    onSelect={(emoji) => {
                      setContent(content + emoji.native)
                      setEmojiOpen(false)
                    }}
                  />
                }
              >
                <Button
                  type="text"
                  icon={<SmileOutlined />}
                  onClick={() => {
                    setEmojiOpen(!emojiOpen)
                  }}
                />
              </Popover>
            </Tooltip>
            <Tooltip title="图片">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  const url = createObjectURL(file)
                  useModal.confirm({
                    title: '确认发送？',
                    content: <Image src={url} />,
                    onOk: async () => {
                      const res = await uploadFile(file)
                      socket.emit('sendChatMessage', {
                        content: res.url,
                        sender: userId,
                        receiver: friendId,
                        type: ChatMessageType.Image,
                        special
                      })
                      URL.revokeObjectURL(url)
                    },
                    onCancel: () => {
                      URL.revokeObjectURL(url)
                    }
                  })
                  return false
                }}
              >
                <Button type="text" icon={<FileImageOutlined />} />
              </Upload>
            </Tooltip>
            <Tooltip title="文件">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  useModal.confirm({
                    title: '确认发送？',
                    content: <FileInfo name={file.name} size={file.size} />,
                    onOk: async () => {
                      const res = await uploadFile(file)
                      socket.emit('sendChatMessage', {
                        content: res,
                        sender: userId,
                        receiver: friendId,
                        type: ChatMessageType.File,
                        special
                      })
                    },
                    onCancel: () => {}
                  })
                  return false
                }}
              >
                <Button type="text" icon={<FileOutlined />} />
              </Upload>
            </Tooltip>
            <Tooltip title="语音消息">
              <Button
                type="text"
                icon={<AudioOutlined />}
                onClick={() => {
                  setType('audio')
                }}
              />
            </Tooltip>
            <Tooltip title="阅后即焚：对方已读五秒后自动销毁">
              <Button
                type="text"
                icon={
                  <FireOutlined
                    style={{
                      color:
                        special === MessageSpecialType.BurnAfterReading
                          ? token.colorPrimary
                          : undefined
                    }}
                  />
                }
                onClick={() => {
                  setSpecial(
                    special === MessageSpecialType.BurnAfterReading
                      ? MessageSpecialType.Normal
                      : MessageSpecialType.BurnAfterReading
                  )
                }}
              />
            </Tooltip>
            <Tooltip title="限时消息：发送五秒后自动销毁">
              <Button
                type="text"
                icon={
                  <ClockCircleOutlined
                    style={{
                      color:
                        special === MessageSpecialType.BurnAfterTime
                          ? token.colorPrimary
                          : undefined
                    }}
                  />
                }
                onClick={() => {
                  setSpecial(
                    special === MessageSpecialType.BurnAfterTime
                      ? MessageSpecialType.Normal
                      : MessageSpecialType.BurnAfterTime
                  )
                }}
              />
            </Tooltip>
          </Flex>
          <Input.TextArea
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                socket.emit('sendChatMessage', {
                  content,
                  sender: userId,
                  receiver: friendId,
                  type: ChatMessageType.Text,
                  special
                })
                setContent('')
              }
            }}
            variant="borderless"
            autoSize={{ minRows: 6, maxRows: 20 }}
          />
        </>
      )}
      {type === 'audio' && (
        <Flex
          align="center"
          justify="center"
          gap={8}
          vertical
          style={{ height: 188 }}
        >
          {audioRecordStatus === AudioRecordStatus.Stop ||
          audioRecordStatus === AudioRecordStatus.Init ? (
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<AudioOutlined />}
              onClick={() => {
                setAudioRecordStatus(AudioRecordStatus.Record)
                recorder &&
                  recorder.start().then(() => {
                    console.log('开始录音了')
                  })
              }}
            />
          ) : (
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<StopOutlined />}
              onClick={() => {
                setAudioRecordStatus(AudioRecordStatus.Stop)
                // recorder.stop()
              }}
            />
          )}
          {/* {audioRecordStatus === AudioRecordStatus.Record && (
            <Button
              shape="circle"
              size="small"
              icon={<PauseOutlined />}
              onClick={() => {
                setAudioRecordStatus(AudioRecordStatus.Pause)
              }}
            />
          )}
          {audioRecordStatus === AudioRecordStatus.Record && (
            <Typography.Text
              type="secondary"
              style={{ fontSize: token.sizeSM }}
            >
              正在录音...
            </Typography.Text>
          )} */}
          <Typography.Text type="secondary" style={{ fontSize: token.sizeSM }}>
            点击按钮后开始录音，再点击时录制结束。
            <TextButton
              type="link"
              onClick={() => {
                setAudioRecordStatus(AudioRecordStatus.Init)
                setType('normal')
                recorder?.destroy()
              }}
              style={{ fontSize: token.sizeSM }}
            >
              点此退出
            </TextButton>
          </Typography.Text>
        </Flex>
      )}
    </Flex>
  )
}

export default InputArea

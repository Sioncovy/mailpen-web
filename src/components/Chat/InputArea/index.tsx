import { FileImageOutlined, SmileOutlined } from '@ant-design/icons'
import { Button, Flex, Image, Input, Modal, Popover, Upload } from 'antd'
import { useState } from 'react'
import { uploadFile } from '@/apis'
import EmojiPicker from '@/components/EmojiPicker'
import { socket, useThemeToken } from '@/hooks'
import { ChatMessageType } from '@/typings'
import { createObjectURL } from '@/utils'

interface InputAreaProps {
  userId: string
  friendId: string
}

function InputArea({ userId, friendId }: InputAreaProps) {
  const [content, setContent] = useState<string>('')
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false)
  const [useModal, modalContext] = Modal.useModal()
  const { token } = useThemeToken()

  return (
    <Flex vertical>
      {modalContext}
      <Flex gap={4} style={{ margin: `${token.paddingXS}px 0` }}>
        <Popover
          open={emojiOpen}
          onOpenChange={setEmojiOpen}
          trigger={['click']}
          content={(
            <EmojiPicker onSelect={(emoji) => {
              setContent(content + emoji.native)
              setEmojiOpen(false)
            }}
            />
          )}
        >
          <Button
            type="text"
            icon={<SmileOutlined />}
            onClick={() => {
              setEmojiOpen(!emojiOpen)
            }}
          />
        </Popover>
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            const url = createObjectURL(file)
            useModal.confirm({
              title: '确认发送？',
              content: <Image src={url} />,
              onOk: async () => {
                const res = await uploadFile(file)
                socket.emit('sendChatMessage', { content: res.url, sender: userId, receiver: friendId, type: ChatMessageType.Image })
                URL.revokeObjectURL(url)
              },
              onCancel: () => {
                URL.revokeObjectURL(url)
              },
            })
            return false
          }}
        >
          <Button
            type="text"
            icon={<FileImageOutlined />}
          />
        </Upload>
      </Flex>
      <Input.TextArea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            socket.emit('sendChatMessage', { content, sender: userId, receiver: friendId, type: ChatMessageType.Text })
            setContent('')
          }
        }}
        variant="borderless"
        autoSize={{ minRows: 6, maxRows: 20 }}
      />
    </Flex>
  )
}

export default InputArea

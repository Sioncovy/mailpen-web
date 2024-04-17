import { SmileOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Popover } from 'antd'
import { useState } from 'react'
import { socket } from '@/hooks'
import EmojiPicker from '@/components/EmojiPicker'
import { ChatMessageType } from '@/typings'

interface InputAreaProps {
  userId: string
  friendId: string
}

function InputArea({ userId, friendId }: InputAreaProps) {
  const [content, setContent] = useState<string>('')
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false)

  return (
    <Flex vertical>
      <Flex>
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

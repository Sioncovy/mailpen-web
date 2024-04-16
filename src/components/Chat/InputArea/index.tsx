import { SmileOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import { useState } from 'react'
import { socket } from '@/hooks'

interface InputAreaProps {
  userId: string
  friendId: string
}

function InputArea({ userId, friendId }: InputAreaProps) {
  const [content, setContent] = useState<string>('')

  return (
    <Flex vertical>
      <Flex>
        <Button type="text" icon={<SmileOutlined />} />
      </Flex>
      <Input.TextArea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            socket.emit('sendChatMessage', { content, sender: userId, receiver: friendId })
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

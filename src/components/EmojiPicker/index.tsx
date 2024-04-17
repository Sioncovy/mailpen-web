import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EmojiPickerProps {
  onSelect: (emoji: any) => void
}

function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Picker data={data} onEmojiSelect={onSelect} />
  )
}

export default EmojiPicker

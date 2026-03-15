import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

interface Props {
  onSend: (msg: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const send = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const onInput = () => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
  }

  return (
    <div className="flex gap-3 items-end bg-white/3 border border-white/10 rounded-2xl p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onInput={onInput}
        disabled={disabled}
        placeholder={placeholder || 'Descreva sua ideia de projeto…'}
        rows={1}
        className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none resize-none leading-relaxed"
      />
      <button
        onClick={send}
        disabled={!value.trim() || disabled}
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all"
      >
        <Send size={14} className="text-white" />
      </button>
    </div>
  )
}

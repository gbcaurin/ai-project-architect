import { useEffect, useRef } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { useInterview } from '../../hooks/useInterview'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { CheckCircle } from 'lucide-react'

interface Props {
  projectId: string
}

export function InterviewPanel({ projectId }: Props) {
  const { messages, isStreaming, interviewComplete } = useProjectStore()
  const { sendMessage } = useInterview(projectId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">AI</span>
          </div>
          <span className="text-sm font-semibold text-white">Arquiteto IA</span>
          {interviewComplete && (
            <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle size={12} />
              Entrevista concluída
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">👋</div>
            <p className="text-sm text-gray-500">Conectando ao Arquiteto IA…</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-3 flex-shrink-0 border-t border-white/5">
        {interviewComplete ? (
          <div className="text-center py-3">
            <p className="text-xs text-gray-500">Entrevista concluída — confira o painel de resultados →</p>
          </div>
        ) : (
          <ChatInput
            onSend={sendMessage}
            disabled={isStreaming}
            placeholder={messages.length < 2 ? "Descreva sua ideia de software…" : "Sua resposta…"}
          />
        )}
        <p className="text-[11px] text-gray-700 text-center mt-2">Enter para enviar · Shift+Enter para nova linha</p>
      </div>
    </div>
  )
}

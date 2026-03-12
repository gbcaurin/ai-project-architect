import { Message } from '../../types'
import { Bot, User } from 'lucide-react'

interface Props {
  message: Message
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming }: Props) {
  const isAI = message.role === 'assistant'

  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
        isAI
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
          : 'bg-white/10 border border-white/10'
      }`}>
        {isAI
          ? <Bot size={14} className="text-white" />
          : <User size={14} className="text-gray-400" />
        }
      </div>

      <div className={`max-w-[82%] ${isAI ? '' : 'items-end flex flex-col'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAI
            ? 'bg-white/5 border border-white/8 text-gray-200 rounded-tl-sm'
            : 'bg-indigo-600 text-white rounded-tr-sm'
        }`}>
          {message.content
            ? message.content.replace('[INTERVIEW_COMPLETE]', '').trim()
            : (
              isStreaming
                ? <span className="inline-flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                  </span>
                : ''
            )
          }
          {isStreaming && isAI && message.content && (
            <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-text-bottom" />
          )}
        </div>
      </div>
    </div>
  )
}

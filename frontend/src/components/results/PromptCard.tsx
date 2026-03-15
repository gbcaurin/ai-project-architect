import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { PromptItem } from '../../types'

interface Props {
  item: PromptItem
  targetAI: string
}

const AI_COLORS: Record<string, string> = {
  claude: 'from-orange-500 to-amber-500',
  cursor: 'from-blue-500 to-cyan-500',
  lovable: 'from-pink-500 to-rose-500',
  gpt: 'from-emerald-500 to-teal-500',
}

export function PromptCard({ item, targetAI }: Props) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(item.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden mb-3">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${AI_COLORS[targetAI] || AI_COLORS.gpt} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-[10px] font-bold">{item.step}</span>
        </div>
        <span className="text-sm font-medium text-white flex-1">{item.title}</span>
        <button
          onClick={e => { e.stopPropagation(); copy() }}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copiado' : `Copiar para ${targetAI}`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-white/5 bg-[#0d0d18]">
          <pre className="p-4 text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96">
            {item.prompt}
          </pre>
        </div>
      )}
    </div>
  )
}

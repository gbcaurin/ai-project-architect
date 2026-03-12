import ReactMarkdown from 'react-markdown'
import { Blueprint } from '../../types'
import { Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface Props {
  blueprint: Blueprint | null
  isGenerating: boolean
  onGenerate: () => void
}

export function BlueprintView({ blueprint, isGenerating, onGenerate }: Props) {
  const [copied, setCopied] = useState(false)

  const copyAll = async () => {
    if (!blueprint) return
    await navigator.clipboard.writeText(blueprint.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isGenerating && !blueprint) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Generating your blueprint…</p>
      </div>
    )
  }

  if (!blueprint) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="text-4xl">📋</div>
        <p className="text-sm text-gray-400 font-medium">No blueprint yet</p>
        <p className="text-xs text-gray-600 max-w-xs">Complete the interview to generate a full technical blueprint</p>
        <button
          onClick={onGenerate}
          className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Generate blueprint
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#0f0f1a] py-2">
        <span className="text-xs text-gray-600">Generated {new Date(blueprint.created_at).toLocaleString()}</span>
        <div className="flex gap-2">
          <button onClick={onGenerate} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <RefreshCw size={12} />
            Regenerate
          </button>
          <button onClick={copyAll} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <Copy size={12} />
            {copied ? 'Copied!' : 'Copy all'}
          </button>
        </div>
      </div>
      <div className="prose prose-invert max-w-none text-sm">
        <ReactMarkdown>{blueprint.content}</ReactMarkdown>
      </div>
    </div>
  )
}

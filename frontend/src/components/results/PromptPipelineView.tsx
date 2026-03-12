import { PromptPipeline, AITool } from '../../types'
import { PromptCard } from './PromptCard'
import { RefreshCw } from 'lucide-react'

const AI_TOOLS: { id: AITool; label: string; emoji: string }[] = [
  { id: 'claude', label: 'Claude Code', emoji: '🟠' },
  { id: 'cursor', label: 'Cursor', emoji: '🔵' },
  { id: 'lovable', label: 'Lovable', emoji: '🌸' },
  { id: 'gpt', label: 'GPT', emoji: '🟢' },
]

interface Props {
  selectedAI: AITool
  onSelectAI: (ai: AITool) => void
  pipeline: PromptPipeline | null
  isGenerating: boolean
  onGenerate: (ai: AITool) => void
}

export function PromptPipelineView({ selectedAI, onSelectAI, pipeline, isGenerating, onGenerate }: Props) {
  return (
    <div>
      {/* AI Selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {AI_TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => onSelectAI(tool.id)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all border ${
              selectedAI === tool.id
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/15'
            }`}
          >
            <span>{tool.emoji}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {isGenerating && !pipeline ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Generating prompts for {selectedAI}…</p>
        </div>
      ) : !pipeline ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
          <div className="text-4xl">✨</div>
          <p className="text-sm text-gray-400 font-medium">No prompts yet for {selectedAI}</p>
          <button
            onClick={() => onGenerate(selectedAI)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Generate prompt pipeline
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-600">{pipeline.prompts.length} step pipeline — click any step to expand</p>
            <button
              onClick={() => onGenerate(selectedAI)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <RefreshCw size={12} />
              Regenerate
            </button>
          </div>
          {pipeline.prompts.map(item => (
            <PromptCard key={item.step} item={item} targetAI={selectedAI} />
          ))}
        </div>
      )}
    </div>
  )
}

import { useProjectStore } from '../../store/projectStore'
import { BlueprintView } from './BlueprintView'
import { PromptPipelineView } from './PromptPipelineView'
import { AnalysisView } from './AnalysisView'
import { AITool } from '../../types'

interface Props {
  projectId: string
  onGenerateBlueprint: () => void
  onGeneratePrompts: (ai: AITool) => void
  onGenerateAnalysis: () => void
}

const TABS = [
  { id: 'blueprint', label: 'Blueprint', emoji: '📋' },
  { id: 'prompts', label: 'Prompts', emoji: '✨' },
  { id: 'analysis', label: 'Analysis', emoji: '📊' },
] as const

export function ResultsPanel({ onGenerateBlueprint, onGeneratePrompts, onGenerateAnalysis }: Props) {
  const {
    activeTab, setActiveTab,
    blueprint, prompts, analysis,
    selectedAI, setSelectedAI,
    isGenerating, interviewComplete
  } = useProjectStore()

  if (!interviewComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/8 flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <div>
          <p className="text-sm font-medium text-white mb-1">Complete the interview</p>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
            Answer the AI Architect's questions about your project. Your blueprint and prompts will appear here.
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-3 mt-2">
          {['Blueprint', 'Prompts', 'Analysis'].map(item => (
            <div key={item} className="flex items-center gap-1.5 text-xs text-gray-700">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-white/5 px-4 flex-shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-3.5 text-xs font-medium border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-gray-600 hover:text-gray-400'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {activeTab === 'blueprint' && (
          <BlueprintView
            blueprint={blueprint}
            isGenerating={isGenerating}
            onGenerate={onGenerateBlueprint}
          />
        )}
        {activeTab === 'prompts' && (
          <PromptPipelineView
            selectedAI={selectedAI}
            onSelectAI={setSelectedAI}
            pipeline={prompts[selectedAI]}
            isGenerating={isGenerating}
            onGenerate={onGeneratePrompts}
          />
        )}
        {activeTab === 'analysis' && (
          <AnalysisView
            analysis={analysis}
            isGenerating={isGenerating}
            onGenerate={onGenerateAnalysis}
          />
        )}
      </div>
    </div>
  )
}

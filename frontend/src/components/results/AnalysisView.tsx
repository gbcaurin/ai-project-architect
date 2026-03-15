import { Analysis } from '../../types'
import { RefreshCw, ExternalLink } from 'lucide-react'

const COMPLEXITY_COLORS: Record<string, string> = {
  simple: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/30',
  moderate: 'text-amber-400 bg-amber-950/50 border-amber-800/30',
  complex: 'text-orange-400 bg-orange-950/50 border-orange-800/30',
  enterprise: 'text-red-400 bg-red-950/50 border-red-800/30',
}

const FIT_COLORS: Record<string, string> = {
  high: 'text-emerald-400',
  medium: 'text-amber-400',
  low: 'text-gray-500',
}

const COMPLEXITY_LABELS: Record<string, string> = {
  simple: 'Simples',
  moderate: 'Moderada',
  complex: 'Complexa',
  enterprise: 'Empresarial',
}

interface Props {
  analysis: Analysis | null
  isGenerating: boolean
  onGenerate: () => void
}

export function AnalysisView({ analysis, isGenerating, onGenerate }: Props) {
  if (isGenerating && !analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Analisando seu projeto…</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="text-4xl">📊</div>
        <p className="text-sm text-gray-400 font-medium">Nenhuma análise ainda</p>
        <p className="text-xs text-gray-600 max-w-xs">Obtenha estimativas de complexidade, referências de mercado e sugestões de melhoria</p>
        <button onClick={onGenerate} className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          Gerar análise
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <button onClick={onGenerate} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          <RefreshCw size={12} />
          Regenerar
        </button>
      </div>

      {/* Complexity metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-600 mb-2">Complexidade</p>
          <span className={`text-sm font-semibold px-2 py-1 rounded-lg border ${COMPLEXITY_COLORS[analysis.complexity] || COMPLEXITY_COLORS.moderate}`}>
            {COMPLEXITY_LABELS[analysis.complexity] || analysis.complexity}
          </span>
        </div>
        <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Tempo de dev</p>
          <p className="text-xl font-bold text-white">{analysis.dev_time_days}d</p>
          <p className="text-[11px] text-gray-600">estimativa solo</p>
        </div>
        <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-600 mb-1">Tamanho da equipe</p>
          <p className="text-xl font-bold text-white">{analysis.team_size}</p>
          <p className="text-[11px] text-gray-600">recomendado</p>
        </div>
      </div>

      {/* Complexity factors */}
      {analysis.complexity_factors?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Fatores de complexidade</p>
          <div className="space-y-2">
            {analysis.complexity_factors.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-indigo-500 mt-0.5">•</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar products */}
      {analysis.similar_products?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Produtos similares</p>
          <div className="space-y-2">
            {analysis.similar_products.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white">{p.name}</span>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-400" onClick={e => e.stopPropagation()}>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{p.similarity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monetization */}
      {analysis.monetization_models?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Modelos de monetização</p>
          <div className="space-y-2">
            {analysis.monetization_models.map((m, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{m.model}</span>
                  <span className={`text-xs font-medium ${FIT_COLORS[m.fit] || FIT_COLORS.medium}`}>{m.fit === 'high' ? 'alta' : m.fit === 'medium' ? 'média' : 'baixa'} adequação</span>
                </div>
                <p className="text-xs text-gray-500">{m.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {analysis.suggested_improvements?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Melhorias sugeridas</p>
          <div className="space-y-2">
            {analysis.suggested_improvements.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-purple-500 mt-0.5">→</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

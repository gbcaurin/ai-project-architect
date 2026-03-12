import { create } from 'zustand'
import { Message, Blueprint, PromptPipeline, Analysis, AITool } from '../types'

interface ProjectStore {
  messages: Message[]
  isStreaming: boolean
  phase: string
  interviewComplete: boolean
  blueprint: Blueprint | null
  prompts: Record<AITool, PromptPipeline | null>
  analysis: Analysis | null
  isGenerating: boolean
  selectedAI: AITool
  activeTab: 'blueprint' | 'prompts' | 'analysis'

  setMessages: (msgs: Message[]) => void
  addMessage: (msg: Message) => void
  appendToLastMessage: (token: string) => void
  setStreaming: (v: boolean) => void
  setPhase: (phase: string) => void
  setInterviewComplete: (v: boolean) => void
  setBlueprint: (b: Blueprint | null) => void
  setPrompts: (ai: AITool, p: PromptPipeline | null) => void
  setAnalysis: (a: Analysis | null) => void
  setGenerating: (v: boolean) => void
  setSelectedAI: (ai: AITool) => void
  setActiveTab: (tab: 'blueprint' | 'prompts' | 'analysis') => void
  reset: () => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  messages: [],
  isStreaming: false,
  phase: 'initial',
  interviewComplete: false,
  blueprint: null,
  prompts: { claude: null, cursor: null, lovable: null, gpt: null },
  analysis: null,
  isGenerating: false,
  selectedAI: 'claude',
  activeTab: 'blueprint',

  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
  appendToLastMessage: (token) =>
    set(s => {
      const msgs = [...s.messages]
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = {
          ...msgs[msgs.length - 1],
          content: msgs[msgs.length - 1].content + token,
        }
      }
      return { messages: msgs }
    }),
  setStreaming: (v) => set({ isStreaming: v }),
  setPhase: (phase) => set({ phase }),
  setInterviewComplete: (v) => set({ interviewComplete: v }),
  setBlueprint: (b) => set({ blueprint: b }),
  setPrompts: (ai, p) =>
    set(s => ({ prompts: { ...s.prompts, [ai]: p } })),
  setAnalysis: (a) => set({ analysis: a }),
  setGenerating: (v) => set({ isGenerating: v }),
  setSelectedAI: (ai) => set({ selectedAI: ai }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () =>
    set({
      messages: [], isStreaming: false, phase: 'initial',
      interviewComplete: false, blueprint: null,
      prompts: { claude: null, cursor: null, lovable: null, gpt: null },
      analysis: null, isGenerating: false,
    }),
}))

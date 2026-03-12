export interface User {
  id: string
  email: string
}

export interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

export interface Project {
  id: string
  title?: string
  status: 'interviewing' | 'complete'
  interview_phase: string
  created_at: string
  updated_at: string
}

export interface ProjectDetail extends Project {
  messages: Message[]
}

export interface Blueprint {
  id: string
  content: string
  created_at: string
}

export interface PromptItem {
  step: number
  title: string
  prompt: string
}

export interface PromptPipeline {
  id: string
  target_ai: string
  prompts: PromptItem[]
  created_at: string
}

export interface Analysis {
  id: string
  complexity: string
  dev_time_days: number
  team_size: number
  complexity_factors: string[]
  similar_products: { name: string; url: string; similarity: string }[]
  monetization_models: { model: string; fit: string; reasoning: string }[]
  suggested_improvements: string[]
}

export type AITool = 'claude' | 'cursor' | 'lovable' | 'gpt'

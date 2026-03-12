import { api } from './client'

export const generationApi = {
  createBlueprint: (id: string) => api.post(`/api/projects/${id}/blueprint`),
  getBlueprint: (id: string) => api.get(`/api/projects/${id}/blueprint`),
  createPrompts: (id: string, target_ai: string) =>
    api.post(`/api/projects/${id}/prompts`, { target_ai }),
  getPrompts: (id: string, target_ai: string) =>
    api.get(`/api/projects/${id}/prompts/${target_ai}`),
  createAnalysis: (id: string) => api.post(`/api/projects/${id}/analysis`),
  getAnalysis: (id: string) => api.get(`/api/projects/${id}/analysis`),
}

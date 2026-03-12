import { api } from './client'

export const projectsApi = {
  list: () => api.get('/api/projects'),
  create: (title?: string) => api.post('/api/projects', { title }),
  get: (id: string) => api.get(`/api/projects/${id}`),
  delete: (id: string) => api.delete(`/api/projects/${id}`),
}

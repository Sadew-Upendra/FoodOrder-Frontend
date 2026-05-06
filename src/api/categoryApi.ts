import api from './axiosInstance'
import { type CategoryResponse, type CategoryRequest } from '../utils/types'

export const categoryApi = {
  getAll: () => api.get<CategoryResponse[]>('/categories').then(r => r.data),
  create: (d: CategoryRequest) => api.post<CategoryResponse>('/categories', d).then(r => r.data),
  update: (id: string, d: CategoryRequest) => api.put<CategoryResponse>(`/categories/${id}`, d).then(r => r.data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

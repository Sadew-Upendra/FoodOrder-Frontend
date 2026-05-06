import api from './axiosInstance'
import { type FoodItemResponse, type FoodItemRequest } from '../utils/types'

export const foodApi = {
  getAll: (params?: { categoryId?: string; search?: string }) =>
    api.get<FoodItemResponse[]>('/foods', { params }).then(r => r.data),
  create: (d: FoodItemRequest) => api.post<FoodItemResponse>('/foods', d).then(r => r.data),
  update: (id: string, d: FoodItemRequest) => api.put<FoodItemResponse>(`/foods/${id}`, d).then(r => r.data),
  delete: (id: string) => api.delete(`/foods/${id}`),
}

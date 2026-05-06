import api from './axiosInstance'
import { type OrderResponse, type OrderRequest, type OrderStatus } from '../utils/types'

export const orderApi = {
  place: (d: OrderRequest) => api.post<OrderResponse>('/orders', d).then(r => r.data),
  getMy: () => api.get<OrderResponse[]>('/orders/my').then(r => r.data),
  getAll: () => api.get<OrderResponse[]>('/orders').then(r => r.data),
  updateStatus: (id: string, status: OrderStatus) =>
    api.put<OrderResponse>(`/orders/${id}/status`, null, { params: { status } }).then(r => r.data),
  cancel: (id: string) => api.put(`/orders/${id}/cancel`),
}

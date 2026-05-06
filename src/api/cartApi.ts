import api from './axiosInstance'
import { type CartResponse, type CartItemRequest } from '../utils/types'

export const cartApi = {
  get: () => api.get<CartResponse>('/cart').then(r => r.data),
  addItem: (d: CartItemRequest) => api.post<CartResponse>('/cart/add', d).then(r => r.data),
  updateItem: (id: number, quantity: number) =>
    api.put<CartResponse>(`/cart/items/${id}`, null, { params: { quantity } }).then(r => r.data),
  removeItem: (id: number) => api.delete<CartResponse>(`/cart/items/${id}`).then(r => r.data),
  clear: () => api.delete('/cart/clear'),
}

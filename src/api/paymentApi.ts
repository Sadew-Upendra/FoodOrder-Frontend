import api from './axiosInstance'
import { type PaymentResponse, type PaymentRequest } from '../utils/types'

export const paymentApi = {
  process: (d: PaymentRequest) => api.post<PaymentResponse>('/payments', d).then(r => r.data),
  getByOrder: (id: string) => api.get<PaymentResponse>(`/payments/order/${id}`).then(r => r.data),
}

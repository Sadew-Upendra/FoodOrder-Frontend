import api from './axiosInstance'
import { type UserDto } from '../utils/types'

export const userApi = {
  getMe: () => api.get<UserDto>('/users/me').then(r => r.data),
  getAll: () => api.get<UserDto[]>('/users').then(r => r.data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
}

import api from './axiosInstance'
import { type JWTResponse, type LoginDto, type SignUpDto } from '../utils/types'

export const authApi = {
  login: (d: LoginDto) => api.post<JWTResponse>('/auth/login', d).then(r => r.data),
  signUp: (d: SignUpDto) => api.post<JWTResponse>('/auth/signup', d).then(r => r.data),
}

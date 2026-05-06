import { type JWTResponse } from '../utils/types'

const TOKEN_KEY = 'token'
const USER_KEY  = 'user'

export const authService = {
  persist: (data: JWTResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data))
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  getStoredUser: (): JWTResponse | null => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
}

import { type OrderStatus, type PaymentStatus } from './types'

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default'

export const orderStatusVariant = (s: OrderStatus): BadgeVariant => {
  const m: Record<OrderStatus, BadgeVariant> = {
    PLACED: 'info', PREPARING: 'warning', DELIVERED: 'success', CANCELLED: 'error',
  }
  return m[s] ?? 'default'
}

export const orderStatusEmoji: Record<OrderStatus, string> = {
  PLACED: '📋', PREPARING: '👨‍🍳', DELIVERED: '✅', CANCELLED: '❌',
}

export const paymentStatusVariant = (s: PaymentStatus): BadgeVariant => {
  const m: Record<PaymentStatus, BadgeVariant> = {
    COMPLETED: 'success', FAILED: 'error', PENDING: 'warning',
  }
  return m[s] ?? 'default'
}

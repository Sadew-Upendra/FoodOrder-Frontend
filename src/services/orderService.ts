import { type OrderStatus } from '../utils/types'

export const orderService = {
  canCancel: (s: OrderStatus) => s === 'PLACED' || s === 'PREPARING',
}

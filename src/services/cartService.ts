import { type CartItemResponse } from '../utils/types'
import { DELIVERY_FEE } from '../data/constants'

export const cartService = {
  subtotal: (items: CartItemResponse[]) => items.reduce((s, i) => s + i.subtotal, 0),
  deliveryFee: (subtotal: number) => subtotal > 0 ? DELIVERY_FEE : 0,
  total: (items: CartItemResponse[]) => {
    const sub = items.reduce((s, i) => s + i.subtotal, 0)
    return sub + (sub > 0 ? DELIVERY_FEE : 0)
  },
}

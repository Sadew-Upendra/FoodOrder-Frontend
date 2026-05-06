import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { type CartResponse, type CartItemRequest } from '../utils/types'
import { cartApi } from '../api/cartApi'
import { useAuth } from './AuthContext'

interface CartCtx {
  cart: CartResponse | null
  cartCount: number
  loading: boolean
  refresh: () => Promise<void>
  addItem: (d: CartItemRequest) => Promise<void>
  updateItem: (id: number, qty: number) => Promise<void>
  removeItem: (id: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartCtx>({} as CartCtx)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try { setCart(await cartApi.get()) } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  // Load cart when user logs in; clear when they log out
  useEffect(() => {
    if (isAuthenticated) refresh()
    else setCart(null)
  }, [isAuthenticated, refresh])

  const addItem = async (d: CartItemRequest) => { setCart(await cartApi.addItem(d)) }
  const updateItem = async (id: number, qty: number) => { setCart(await cartApi.updateItem(id, qty)) }
  const removeItem = async (id: number) => { setCart(await cartApi.removeItem(id)) }
  const clearCart = async () => { await cartApi.clear(); setCart(null) }

  return (
    <CartContext.Provider value={{
      cart,
      cartCount: cart?.totalItems ?? 0,
      loading,
      refresh,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

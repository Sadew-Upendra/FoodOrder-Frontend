import { useCallback, useEffect, useState } from 'react'
import { orderApi } from '../api/orderApi'
import { type OrderResponse } from '../utils/types'

export const useOrders = (adminMode = false) => {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const data = adminMode ? await orderApi.getAll() : await orderApi.getMy()
      setOrders(data)
    } catch { setError('Failed to load orders.') }
    finally { setLoading(false) }
  }, [adminMode])

  useEffect(() => { loadOrders() }, [loadOrders])

  return { orders, loading, error, refetch: loadOrders }
}

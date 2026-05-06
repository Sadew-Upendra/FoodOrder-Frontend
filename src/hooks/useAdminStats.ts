import { useEffect, useState } from 'react'
import { foodApi } from '../api/foodApi'
import { categoryApi } from '../api/categoryApi'
import { orderApi } from '../api/orderApi'
import { userApi } from '../api/userApi'

export interface AdminStats {
  totalFoods: number
  totalCategories: number
  totalOrders: number
  totalUsers: number
  recentOrders: number
  revenue: number
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [foods, cats, orders, users] = await Promise.all([
          foodApi.getAll(), categoryApi.getAll(), orderApi.getAll(), userApi.getAll(),
        ])
        const revenue = orders
          .filter(o => o.status === 'DELIVERED')
          .reduce((s, o) => s + o.totalAmount, 0)
        const recentOrders = orders.filter(o => {
          const diffDays = (Date.now() - new Date(o.orderDate).getTime()) / 86400000
          return diffDays <= 7
        }).length
        setStats({
          totalFoods: foods.length,
          totalCategories: cats.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          recentOrders,
          revenue,
        })
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return { stats, loading }
}

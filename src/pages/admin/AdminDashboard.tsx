import { Link } from 'react-router-dom'
import { Utensils, Tag, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { useAdminStats } from '../../hooks/useAdminStats'
import { useOrders } from '../../hooks/useOrders'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { orderStatusVariant } from '../../utils/orderStatus'
import { formatLKR, formatDate } from '../../utils/formatters'
import { type OrderStatus } from '../../utils/types'

const AdminDashboard = () => {
  const { stats, loading } = useAdminStats()
  const { orders } = useOrders(true)

  if (loading) return <Loader message="Loading dashboard…" />

  const STATS = [
    { icon: Utensils, label: 'Total Foods', value: stats?.totalFoods ?? 0, color: 'text-orange-500', bg: 'bg-orange-50', trend: 'Active menu items' },
    { icon: Tag, label: 'Categories', value: stats?.totalCategories ?? 0, color: 'text-blue-500', bg: 'bg-blue-50', trend: 'Food categories' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats?.totalOrders ?? 0, color: 'text-purple-500', bg: 'bg-purple-50', trend: `${stats?.recentOrders ?? 0} this week` },
    { icon: Users, label: 'Total Users', value: stats?.totalUsers ?? 0, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: 'Registered customers' },
    { icon: TrendingUp, label: 'Revenue (Delivered)', value: formatLKR(stats?.revenue ?? 0), color: 'text-[#ff4757]', bg: 'bg-red-50', trend: 'From completed orders' },
  ]

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#2f3542]">Dashboard Overview</h2>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/admin/foods', icon: '🍔', label: 'Manage Foods', cls: 'bg-orange-50 border-orange-200 hover:border-orange-400' },
          { to: '/admin/categories', icon: '📂', label: 'Categories', cls: 'bg-blue-50   border-blue-200   hover:border-blue-400' },
          { to: '/admin/orders', icon: '📦', label: 'All Orders', cls: 'bg-purple-50 border-purple-200 hover:border-purple-400' },
          { to: '/admin/users', icon: '👥', label: 'Manage Users', cls: 'bg-green-50  border-green-200  hover:border-green-400' },
        ].map(({ to, icon, label, cls }) => (
          <Link key={to} to={to}
            className={`border-2 ${cls} rounded-2xl p-5 text-center hover:shadow-md transition-all group`}>
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{icon}</div>
            <p className="font-semibold text-[#2f3542] text-sm">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#2f3542]">Recent Orders</h3>
          <Link to="/admin/orders"
            className="text-sm text-[#ff4757] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(o => (
                <tr key={o.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-semibold text-[#2f3542]">#{o.orderId.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3.5 font-medium text-[#2f3542]">{o.userName}</td>
                  <td className="px-5 py-3.5 text-gray-500">{o.orderItems.length}</td>
                  <td className="px-5 py-3.5 font-bold text-[#ff4757]">{formatLKR(o.totalAmount)}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(o.orderDate)}</td>
                  <td className="px-5 py-3.5">
                    <Badge label={o.status} variant={orderStatusVariant(o.status as OrderStatus)} />
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400 py-10">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

import { useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { orderApi } from '../../api/orderApi'
import { type OrderStatus } from '../../utils/types'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { useToast } from '../../context/ToastContext'
import { orderStatusVariant, orderStatusEmoji } from '../../utils/orderStatus'
import { formatLKR, formatDate } from '../../utils/formatters'

const ALL_STATUSES: OrderStatus[] = ['PLACED', 'PREPARING', 'DELIVERED', 'CANCELLED']

const AdminOrdersPage = () => {
  const { orders, loading, refetch } = useOrders(true)
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [filterSt, setFilterSt] = useState<OrderStatus | 'ALL'>('ALL')
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id)
    try {
      await orderApi.updateStatus(id, status)
      toast(`Order updated to ${status}`, 'success')
      refetch()
    } catch { toast('Failed to update status', 'error') }
    finally { setUpdating(null) }
  }

  const filtered = orders
    .filter(o => filterSt === 'ALL' || o.status === filterSt)
    .filter(o =>
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.userName.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryAddress.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2f3542]">All Orders</h2>
          <p className="text-gray-400 text-sm mt-1">{orders.length} orders total</p>
        </div>
        <button onClick={refetch}
          className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-semibold hover:border-[#ff4757] hover:text-[#ff4757] transition-all text-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…"
            className="pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ff4757] focus:outline-none w-52" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['ALL', ...ALL_STATUSES] as const).map(s => (
            <button key={s} onClick={() => setFilterSt(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all
                ${filterSt === s
                  ? 'bg-[#ff4757] text-white border-[#ff4757]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#ff4757] hover:text-[#ff4757]'
                }`}>
              {s === 'ALL' ? 'All' : `${orderStatusEmoji[s]} ${s}`}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Address', 'Date', 'Status', 'Update'].map(h => (
                    <th key={h} className="px-4 py-4 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(o => (
                  <tr key={o.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-gray-500 font-semibold">
                      #{o.orderId.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#2f3542] whitespace-nowrap">{o.userName}</td>
                    <td className="px-4 py-4 text-gray-500 text-center">{o.orderItems.length}</td>
                    <td className="px-4 py-4 font-bold text-[#ff4757] whitespace-nowrap">{formatLKR(o.totalAmount)}</td>
                    <td className="px-4 py-4 text-gray-500 max-w-[140px] truncate">{o.deliveryAddress}</td>
                    <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(o.orderDate)}</td>
                    <td className="px-4 py-4">
                      <Badge label={o.status} variant={orderStatusVariant(o.status as OrderStatus)} />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={o.status}
                        disabled={updating === o.orderId || o.status === 'DELIVERED' || o.status === 'CANCELLED'}
                        onChange={e => handleStatus(o.orderId, e.target.value as OrderStatus)}
                        className="border-2 border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#ff4757] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s}>{orderStatusEmoji[s]} {s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-gray-400 py-14">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage

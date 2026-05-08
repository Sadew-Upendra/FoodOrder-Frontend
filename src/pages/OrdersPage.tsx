import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, RefreshCw, CreditCard, X, Shield } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { orderApi } from '../api/orderApi'
import { paymentApi } from '../api/paymentApi'
import { type OrderResponse } from '../utils/types'
import { OrderCard } from '../components/ui/OrderCard'
import { Loader } from '../components/ui/Loader'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../context/ToastContext'
import { formatLKR } from '../utils/formatters'

const OrdersPage = () => {
  const { orders, loading, error, refetch } = useOrders(false)
  const { toast } = useToast()

  const [payingOrder, setPayingOrder] = useState<OrderResponse | null>(null)
  const [txnId, setTxnId] = useState('')
  const [processingPay, setProcessingPay] = useState(false)

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      await orderApi.cancel(id)
      toast('Order cancelled', 'success')
      refetch()
    } catch { toast('Failed to cancel order', 'error') }
  }

  const openPayModal = (order: OrderResponse) => {
    setPayingOrder(order)
    setTxnId(`TXN-${Date.now()}`)
  }

  const handlePay = async () => {
    if (!payingOrder) return
    setProcessingPay(true)
    try {
      await paymentApi.process({ orderId: payingOrder.orderId, transactionId: txnId })
      toast('Payment successful! 🎉', 'success')
      setPayingOrder(null)
      refetch()
    } catch { toast('Payment failed. Please try again.', 'error') }
    finally { setProcessingPay(false) }
  }

  return (
    <div className="pt-[72px] min-h-screen bg-[#f1f2f6]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2f3542] to-[#3d4451] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl font-bold text-white">My Orders 📦</h1>
            <p className="text-gray-300 mt-1">Track and manage your food orders</p>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <Loader message="Loading orders…" />
        ) : error ? (
          <EmptyState emoji="😕" title="Failed to load orders" desc={error}
            action={
              <button onClick={refetch}
                className="bg-[#ff4757] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e84118] transition-colors">
                Retry
              </button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState emoji="📦" title="No orders yet" desc="Start ordering your favourite food!"
            action={
              <Link to="/menu"
                className="inline-flex items-center gap-2 bg-[#ff4757] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#e84118] transition-all">
                Browse Menu <ArrowRight size={16} />
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {/* Status legend */}
            <div className="bg-white rounded-2xl p-4 flex flex-wrap gap-2.5 shadow-sm">
              {[
                ['📋 PLACED', 'bg-blue-100   text-blue-700'],
                ['👨‍🍳 PREPARING', 'bg-amber-100  text-amber-700'],
                ['✅ DELIVERED', 'bg-emerald-100 text-emerald-700'],
                ['❌ CANCELLED', 'bg-red-100    text-red-700'],
              ].map(([label, cls]) => (
                <span key={label} className={`text-xs font-bold px-3 py-1.5 rounded-full ${cls}`}>{label}</span>
              ))}
            </div>
            {orders.map(o => (
              <OrderCard key={o.orderId} order={o} onCancel={handleCancel} onPay={openPayModal} />
            ))}
          </div>
        )}
      </div>

      {/* Payment modal */}
      {payingOrder && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          onClick={() => !processingPay && setPayingOrder(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="bg-gradient-to-r from-[#ff4757] to-[#c0392b] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard size={22} className="text-white" />
                <h2 className="font-bold text-white text-lg">Complete Payment</h2>
              </div>
              <button onClick={() => setPayingOrder(null)} disabled={processingPay}
                className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Order summary */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order</span>
                  <span className="font-mono font-semibold text-[#2f3542]">
                    #{payingOrder.orderId.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items</span>
                  <span className="font-semibold text-[#2f3542]">{payingOrder.orderItems.length} item(s)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-[#2f3542]">Total</span>
                  <span className="font-extrabold text-[#ff4757] text-lg">{formatLKR(payingOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-[#2f3542] mb-2">
                  Transaction / Reference ID
                </label>
                <input
                  value={txnId}
                  onChange={e => setTxnId(e.target.value)}
                  placeholder="e.g. TXN-123456789"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#ff4757] focus:outline-none transition-colors font-mono"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Enter your bank transfer or payment reference number.
                </p>
              </div>

              <button
                onClick={handlePay}
                disabled={processingPay || !txnId.trim()}
                className="w-full bg-[#ff4757] hover:bg-[#e84118] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-base">
                <CreditCard size={19} />
                {processingPay ? 'Processing Payment…' : `Pay ${formatLKR(payingOrder.totalAmount)}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <Shield size={13} /> Payments are processed securely
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage

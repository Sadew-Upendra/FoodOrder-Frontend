import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, Clock, Ban, CreditCard } from 'lucide-react'
import { type OrderResponse, type OrderStatus } from '../../utils/types'
import { Badge } from './Badge'
import { orderStatusVariant, orderStatusEmoji, paymentStatusVariant } from '../../utils/orderStatus'
import { formatLKR, formatDate } from '../../utils/formatters'
import { orderService } from '../../services/orderService'

export const OrderCard = ({
  order, onCancel, onPay,
}: {
  order: OrderResponse
  onCancel?: (id: string) => void
  onPay?: (order: OrderResponse) => void
}) => {
  const [open, setOpen] = useState(false)

  const canPay = order.status !== 'CANCELLED'
    && (!order.payment || order.payment.status === 'PENDING' || order.payment.status === 'FAILED')

  return (
    <div className="bg-white rounded-2xl shadow-md border-l-4 border-[#ff4757] overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xl">{orderStatusEmoji[order.status as OrderStatus]}</span>
              <span className="font-bold text-[#2f3542] font-mono text-sm">
                #{order.orderId.slice(-8).toUpperCase()}
              </span>
              <Badge label={order.status} variant={orderStatusVariant(order.status as OrderStatus)} />
              {order.payment && (
                <Badge
                  label={`Pay: ${order.payment.status}`}
                  variant={paymentStatusVariant(order.payment.status)}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {formatDate(order.orderDate)}
              </span>
              <span className="flex items-center gap-1.5 max-w-[240px] truncate">
                <MapPin size={13} /> {order.deliveryAddress}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#ff4757] font-extrabold text-xl">{formatLKR(order.totalAmount)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{order.orderItems.length} item(s)</p>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-2 flex-wrap">
          <button
            onClick={() => setOpen(p => !p)}
            className="flex items-center gap-1.5 text-sm text-[#ff4757] font-semibold hover:text-[#e84118] transition-colors"
          >
            {open ? <><ChevronUp size={16} /> Hide items</> : <><ChevronDown size={16} /> View items</>}
          </button>
          <div className="flex gap-2">
            {onPay && canPay && (
              <button
                onClick={() => onPay(order)}
                className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#ff4757] hover:bg-[#e84118] px-4 py-2 rounded-xl transition-all shadow-sm hover:-translate-y-0.5"
              >
                <CreditCard size={14} /> Pay Now
              </button>
            )}
            {onCancel && orderService.canCancel(order.status as OrderStatus) && (
              <button
                onClick={() => onCancel(order.orderId)}
                className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 font-semibold border border-red-200 hover:border-red-400 px-3 py-2 rounded-xl transition-all"
              >
                <Ban size={14} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded items */}
      {open && (
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
          {order.orderItems.map(oi => (
            <div key={oi.orderItemId} className="flex justify-between py-2.5 text-sm border-b border-gray-100 last:border-0">
              <span className="text-[#2f3542] font-medium">
                {oi.foodItemName} <span className="text-gray-400 font-normal">× {oi.quantity}</span>
              </span>
              <span className="font-semibold text-gray-600">{formatLKR(oi.subtotal)}</span>
            </div>
          ))}
          {order.payment && (
            <div className="flex justify-between pt-3 text-sm">
              <span className="text-gray-500 font-medium">Payment</span>
              <Badge label={order.payment.status} variant={paymentStatusVariant(order.payment.status)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

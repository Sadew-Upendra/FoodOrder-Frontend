import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Shield, MapPin, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { orderApi } from '../api/orderApi'
import { cartService } from '../services/cartService'
import { formatLKR } from '../utils/formatters'
import { FALLBACK_IMG } from '../data/constants'

const CartPage = () => {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)

  const handlePlaceOrder = async () => {
    if (!address.trim()) { toast('Please enter a delivery address', 'warning'); return }
    setPlacing(true)
    try {
      await orderApi.place({ deliveryAddress: address })
      await clearCart()
      toast('Order placed successfully! 🎉', 'success')
      navigate('/orders')
    } catch { toast('Failed to place order. Try again.', 'error') }
    finally { setPlacing(false) }
  }

  if (loading) return (
    <div className="pt-[72px] min-h-screen bg-[#f1f2f6] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-[#ff4757] rounded-full animate-spin" />
    </div>
  )

  const isEmpty = !cart || cart.items.length === 0
  const subtotal = cart ? cartService.subtotal(cart.items) : 0
  const delivery = cart ? cartService.deliveryFee(subtotal) : 0
  const total = subtotal + delivery

  return (
    <div className="pt-[72px] min-h-screen bg-[#f1f2f6]">
      <div className="bg-gradient-to-r from-[#2f3542] to-[#3d4451] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-4xl font-bold text-white flex items-center gap-3">
            <ShoppingCart size={36} /> Your Cart
          </h1>
          <p className="text-gray-300 mt-1">
            {isEmpty ? 'No items yet' : `${cart.totalItems} item(s) in your cart`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {isEmpty ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="font-serif text-3xl font-bold text-[#2f3542] mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 text-lg">Browse our menu and add some delicious items!</p>
            <Link to="/menu"
              className="inline-flex items-center gap-2 bg-[#ff4757] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#e84118] transition-all shadow-lg">
              Browse Menu <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-[#2f3542] text-lg">Order Items ({cart.items.length})</h2>
                <button
                  onClick={async () => { await clearCart(); toast('Cart cleared', 'info') }}
                  className="text-sm text-red-400 hover:text-red-600 font-semibold flex items-center gap-1.5">
                  <Trash2 size={14} /> Clear All
                </button>
              </div>

              {cart.items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={item.foodItemImage || FALLBACK_IMG}
                      alt={item.foodItemName}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#2f3542] truncate">{item.foodItemName}</h3>
                    <p className="text-gray-400 text-sm">{formatLKR(item.unitPrice)} each</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-[#ff4757] hover:text-[#ff4757] flex items-center justify-center transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-[#2f3542]">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border-2 border-[#ff4757] text-[#ff4757] hover:bg-[#ff4757] hover:text-white flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-[#ff4757] text-lg">{formatLKR(item.subtotal)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors mt-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-[#2f3542] mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-[#ff4757]" /> Delivery Address <span className="text-red-500">*</span>
                </h3>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Enter your full delivery address…"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-[#ff4757] focus:outline-none transition-colors"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-[#2f3542] text-lg mb-5 flex items-center gap-2">
                  <Tag size={18} className="text-[#ff4757]" /> Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span className="font-semibold text-[#2f3542]">{formatLKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[#2f3542]">{formatLKR(delivery)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-lg">
                    <span className="text-[#2f3542]">Total</span>
                    <span className="text-[#ff4757]">{formatLKR(total)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full mt-6 bg-[#ff4757] hover:bg-[#e84118] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  {placing ? 'Placing Order…' : <><span>Place Order</span><ArrowRight size={18} /></>}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
                  <Shield size={13} /> Secure &amp; encrypted checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage

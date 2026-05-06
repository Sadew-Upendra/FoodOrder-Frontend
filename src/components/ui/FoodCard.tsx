import { useState } from 'react'
import { ShoppingCart, Star, Clock, CheckCircle } from 'lucide-react'
import { type FoodItemResponse } from '../../utils/types'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { FALLBACK_IMG } from '../../data/constants'
import { formatLKR } from '../../utils/formatters'

export const FoodCard = ({ food }: { food: FoodItemResponse }) => {
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const isAvail = food.status === 'AVAILABLE'

  const handleAdd = async () => {
    if (!isAuthenticated) { toast('Please sign in first 👋', 'warning'); return }
    if (!isAvail) return
    setAdding(true)
    try {
      await addItem({ foodItemId: food.foodItemId, quantity: 1 })
      setAdded(true)
      toast(`${food.name} added to cart! 🛒`, 'success')
      setTimeout(() => setAdded(false), 2000)
    } catch { toast('Failed to add item', 'error') }
    finally { setAdding(false) }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={food.imageUrl || FALLBACK_IMG}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="absolute top-3 left-3 bg-[#ffa502] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {food.categoryName}
        </span>
        {!isAvail && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-sm font-bold px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-[#2f3542] text-lg leading-tight">{food.name}</h3>
          {food.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{food.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-[#ffa502] fill-[#ffa502]" /> 4.8
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> 20–30 min
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[#ff4757] font-extrabold text-2xl">{formatLKR(food.price)}</span>
          <button
            onClick={handleAdd}
            disabled={!isAvail || adding || added}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${!isAvail
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                  ? 'bg-emerald-500 text-white'
                  : adding
                    ? 'bg-[#ff4757]/70 text-white cursor-wait'
                    : 'bg-[#ff4757] text-white hover:bg-[#e84118] hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
              }`}
          >
            {added
              ? <><CheckCircle size={16} /> Added!</>
              : <><ShoppingCart size={16} /> {adding ? '…' : 'Add'}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

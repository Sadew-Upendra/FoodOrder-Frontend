import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useFoods } from '../hooks/useFoods'
import { FoodCard } from '../components/ui/FoodCard'
import { CategoryFilter } from '../components/ui/CategoryFilter'
import { Loader } from '../components/ui/Loader'
import { EmptyState } from '../components/ui/EmptyState'

const MenuPage = () => {
  const [params, setParams] = useSearchParams()
  const [inputVal, setInputVal] = useState('')
  const [search, setSearch] = useState('')
  const selectedCat = params.get('categoryId')

  const { foods, categories, loading } = useFoods(selectedCat, search || undefined)

  const available = foods.filter(f => f.status === 'AVAILABLE')
  const outOfStock = foods.filter(f => f.status === 'OUT_OF_STOCK')

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(inputVal.trim()) }
  const clearSearch = () => { setSearch(''); setInputVal('') }
  const clearAll = () => { clearSearch(); setParams({}) }

  return (
    <div className="pt-[72px] min-h-screen bg-[#f1f2f6]">
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#2f3542] to-[#3d4451] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Explore Our Menu</h1>
          <p className="text-gray-300 text-lg">Freshly prepared, just for you 🍽️</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search for food or ingredients…"
              className="w-full pl-12 pr-10 py-3.5 rounded-xl border-2 border-white bg-white shadow-sm focus:border-[#ff4757] focus:outline-none text-sm font-medium"
            />
            {inputVal && (
              <button type="button" onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit"
            className="bg-[#ff4757] text-white px-6 rounded-xl font-semibold text-sm hover:bg-[#e84118] transition-colors shadow-sm">
            Search
          </button>
        </form>

        {/* Category filter */}
        <div className="flex items-start gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
          <SlidersHorizontal size={18} className="text-gray-400 shrink-0 mt-2" />
          <CategoryFilter
            categories={categories}
            selected={selectedCat}
            onSelect={id => id ? setParams({ categoryId: id }) : setParams({})}
          />
        </div>

        {/* Active search label */}
        {search && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            Results for <strong className="text-[#2f3542]">"{search}"</strong>
            <button onClick={clearSearch}
              className="text-[#ff4757] font-semibold hover:underline flex items-center gap-1 ml-1">
              <X size={13} /> Clear
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? <Loader message="Loading menu…" /> : foods.length === 0
          ? <EmptyState
            emoji="🍽️" title="No items found" desc="Try a different category or search term."
            action={
              <button onClick={clearAll}
                className="bg-[#ff4757] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e84118] transition-colors">
                Clear Filters
              </button>
            }
          />
          : (
            <>
              {available.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-sm font-bold text-[#2f3542]">{available.length} Available</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {available.map(f => <FoodCard key={f.foodItemId} food={f} />)}
                  </div>
                </>
              )}
              {outOfStock.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-sm font-bold text-gray-400">{outOfStock.length} Out of Stock</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
                    {outOfStock.map(f => <FoodCard key={f.foodItemId} food={f} />)}
                  </div>
                </>
              )}
            </>
          )
        }
      </div>
    </div>
  )
}

export default MenuPage

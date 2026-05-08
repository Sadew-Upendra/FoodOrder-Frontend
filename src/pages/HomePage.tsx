import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ChefHat, Shield, Star } from 'lucide-react'
import { foodApi } from '../api/foodApi'
import { categoryApi } from '../api/categoryApi'
import { type FoodItemResponse, type CategoryResponse } from '../utils/types'
import { FoodCard } from '../components/ui/FoodCard'
import { Loader } from '../components/ui/Loader'
import { getCategoryEmoji } from '../data/constants'

const FEATURES = [
  { Icon: Truck, title: 'Fast Delivery', desc: 'Fresh food at your door in 30 minutes or less.' },
  { Icon: ChefHat, title: 'Expert Chefs', desc: 'Every dish crafted by skilled culinary professionals.' },
  { Icon: Shield, title: 'Safe & Secure', desc: 'Your payments and data are always protected.' },
  { Icon: Star, title: 'Top Rated', desc: 'Loved by thousands of happy customers daily.' },
]

const HomePage = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [featured, setFeatured] = useState<FoodItemResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, foods] = await Promise.all([categoryApi.getAll(), foodApi.getAll()])
        setCategories(cats)
        setFeatured(foods.filter(f => f.status === 'AVAILABLE').slice(0, 4))
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="pt-[72px]">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff5f5] via-white to-[#fff9f0] py-20 md:py-32">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#ff4757]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#ffa502]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#ff4757]/10 text-[#ff4757] px-4 py-2 rounded-full text-sm font-bold mb-6">
                <span className="w-2 h-2 bg-[#ff4757] rounded-full animate-pulse" />
                Fresh &amp; Fast Delivery 🚀
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#2f3542] leading-[1.08] mb-6">
                Satisfy Your<br />
                <span className="text-[#ff4757]">Cravings</span><br />
                Instantly.
              </h1>
              <p className="text-gray-500 text-xl leading-relaxed mb-10 max-w-lg">
                Discover the best food delivered to your doorstep. Order in seconds and enjoy!
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/menu"
                  className="inline-flex items-center gap-2 bg-[#ff4757] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#e84118] transition-all shadow-xl hover:shadow-[#ff4757]/30 hover:-translate-y-1 text-lg">
                  Order Now <ArrowRight size={20} />
                </Link>
                <Link to="/menu"
                  className="inline-flex items-center gap-2 border-2 border-[#ff4757] text-[#ff4757] font-bold px-8 py-4 rounded-2xl hover:bg-[#ff4757] hover:text-white transition-all text-lg">
                  Explore Menu
                </Link>
              </div>
              <div className="flex items-center gap-6">
                {[['10K+', 'Customers'], ['4.9 ⭐', 'Rating'], ['30min', 'Delivery']].map(([v, l], i) => (
                  <div key={l} className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-extrabold text-2xl text-[#2f3542]">{v}</p>
                      <p className="text-gray-400 text-xs">{l}</p>
                    </div>
                    {i < 2 && <div className="w-px h-10 bg-gray-200" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-[#ff4757] rounded-[3rem] rotate-6 opacity-10" />
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                  alt="Delicious food"
                  className="relative w-full rounded-[2.5rem] shadow-2xl object-cover h-[420px]"
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#ff4757]/10 rounded-xl flex items-center justify-center text-2xl">🍕</div>
                  <div>
                    <p className="font-bold text-[#2f3542] text-sm">New Order!</p>
                    <p className="text-gray-400 text-xs">Just delivered nearby</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-[#ff4757] text-white rounded-2xl shadow-xl p-4 text-center">
                  <p className="text-2xl font-extrabold leading-none">30</p>
                  <p className="text-xs font-semibold opacity-90">min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#2f3542] mb-3">Explore Categories</h2>
            <p className="text-gray-500 text-lg">What are you in the mood for today?</p>
          </div>
          {loading ? <Loader /> : categories.length === 0
            ? <p className="text-center text-gray-400 py-8">No categories yet — check back soon!</p>
            : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.slice(0, 12).map(cat => (
                  <Link key={cat.categoryId} to={`/menu?categoryId=${cat.categoryId}`}
                    className="group bg-white border-2 border-gray-100 hover:border-[#ff4757] rounded-2xl p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                      {getCategoryEmoji(cat.name)}
                    </div>
                    <h3 className="font-semibold text-[#2f3542] text-sm group-hover:text-[#ff4757] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{cat.foodItemCount} items</p>
                  </Link>
                ))}
              </div>
            )
          }
        </div>
      </section>

      {/* ── Featured ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f1f2f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-serif text-4xl font-bold text-[#2f3542] mb-3">Featured Delicacies</h2>
              <p className="text-gray-500 text-lg">Handpicked favourites from our kitchen</p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center gap-2 text-[#ff4757] font-bold hover:gap-3 transition-all shrink-0">
              View All <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? <Loader /> : featured.length > 0
            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(f => <FoodCard key={f.foodItemId} food={f} />)}
            </div>
            : <div className="text-center text-gray-400 py-12"><div className="text-6xl mb-4">🍽️</div><p>No featured items yet.</p></div>
          }
        </div>
      </section>

      {/* ── Why Us ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#2f3542] mb-3">Why Choose Us?</h2>
            <p className="text-gray-500 text-lg">We make your food experience extraordinary</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="text-center group p-6 rounded-2xl hover:bg-[#fff5f5] transition-colors border-2 border-transparent hover:border-[#ff4757]/10">
                <div className="w-16 h-16 bg-[#ff4757]/10 group-hover:bg-[#ff4757] rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors duration-300">
                  <Icon size={28} className="text-[#ff4757] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-[#2f3542] text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#ff4757] to-[#c0392b]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-5">
            Hungry? Let's fix that! 🍕
          </h2>
          <p className="text-white/80 text-xl mb-10">Join thousands who order with FoodieExpress every day.</p>
          <Link to="/menu"
            className="inline-flex items-center gap-2 bg-white text-[#ff4757] font-extrabold px-10 py-4 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg">
            Start Ordering <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default HomePage

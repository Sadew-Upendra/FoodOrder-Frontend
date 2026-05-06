import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, Utensils, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getInitials } from '../../utils/formatters'

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Close mobile menu and dropdown on route change
  useEffect(() => { setMenuOpen(false); setDropdown(false) }, [location])

  // Shadow on scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdown(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${isActive ? 'text-[#ff4757]' : 'text-[#2f3542] hover:text-[#ff4757]'}`

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300
      ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-[#ff4757] rounded-xl flex items-center justify-center shadow-md">
            <Utensils size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-[#2f3542]">
            Foodie<span className="text-[#ff4757]">Express</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/menu" className={linkClass}>Menu</NavLink>
          {isAuthenticated && <NavLink to="/orders" className={linkClass}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <Link to="/cart" className="relative p-2 text-[#2f3542] hover:text-[#ff4757] transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff4757] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropdown(p => !p)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors"
              >
                <div className="w-7 h-7 bg-[#ff4757] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user ? getInitials(user.name) : '?'}</span>
                </div>
                <span className="text-sm font-semibold text-[#2f3542] max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdown ? 'rotate-180' : ''}`} />
              </button>
              {dropdown && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-[#2f3542]">
                    <User size={16} className="text-gray-400" /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-[#2f3542]">
                      <LayoutDashboard size={16} className="text-gray-400" /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-[#ff4757] w-full"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/signin" className="text-sm font-semibold text-[#2f3542] hover:text-[#ff4757] transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="text-sm font-semibold bg-[#ff4757] text-white px-5 py-2.5 rounded-xl hover:bg-[#e84118] transition-all shadow-md hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated && (
            <Link to="/cart" className="relative p-2">
              <ShoppingCart size={22} className="text-[#2f3542]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff4757] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button onClick={() => setMenuOpen(p => !p)} className="p-2 text-[#2f3542]">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-t border-gray-100 shadow-xl md:hidden z-40">
          <div className="flex flex-col p-6 gap-4">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/menu" className={linkClass}>Menu</NavLink>
            {isAuthenticated && <NavLink to="/orders" className={linkClass}>My Orders</NavLink>}
            {isAuthenticated && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
            {isAdmin && <NavLink to="/admin" className={linkClass}>Admin Panel</NavLink>}
            <div className="border-t border-gray-100 pt-4">
              {isAuthenticated
                ? <button onClick={logout} className="flex items-center gap-2 text-[#ff4757] font-semibold text-sm">
                  <LogOut size={16} /> Sign Out
                </button>
                : <div className="flex gap-3">
                  <Link to="/signin" className="flex-1 text-center border-2 border-[#ff4757] text-[#ff4757] font-semibold py-2.5 rounded-xl text-sm">Sign In</Link>
                  <Link to="/signup" className="flex-1 text-center bg-[#ff4757] text-white font-semibold py-2.5 rounded-xl text-sm">Sign Up</Link>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

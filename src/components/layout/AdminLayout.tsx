import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Utensils, Tag, ShoppingBag, Users, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/foods', label: 'Food Items', icon: Utensils, exact: false },
  { to: '/admin/categories', label: 'Categories', icon: Tag, exact: false },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { to: '/admin/users', label: 'Users', icon: Users, exact: false },
]

const SidebarNav = ({
  collapsed, onClose,
}: {
  collapsed: boolean; onClose?: () => void
}) => {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/10 ${collapsed ? 'justify-center px-3' : ''}`}>
        <div className="w-9 h-9 bg-[#ff4757] rounded-xl flex items-center justify-center shrink-0">
          <Utensils size={18} className="text-white" />
        </div>
        {!collapsed && <span className="font-bold text-white text-lg">FoodieExpress</span>}
        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white md:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to} to={to} end={exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all
              ${isActive ? 'bg-[#ff4757] text-white shadow-lg shadow-[#ff4757]/30' : 'text-gray-400 hover:bg-white/10 hover:text-white'}
              ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-3">
            <div className="w-8 h-8 bg-[#ff4757] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{user ? getInitials(user.name) : 'A'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2.5 text-gray-400 hover:text-[#ff4757] text-sm font-semibold
            px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all w-full
            ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  )
}

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f1f2f6] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col bg-[#2f3542] transition-all duration-300 relative shrink-0
        ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <SidebarNav collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(p => !p)}
          className="absolute -right-3.5 top-20 w-7 h-7 bg-[#ff4757] text-white rounded-full
            flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20 border-2 border-white"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#2f3542] z-50">
            <SidebarNav collapsed={false} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-[#2f3542] text-lg leading-tight">Admin Panel</h1>
              <p className="text-gray-400 text-xs">FoodieExpress Management</p>
            </div>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#ff4757] hover:text-[#e84118] transition-colors">
            ← Back to Site
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

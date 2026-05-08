import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/ui/ProtectedRoute'

import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFoodsPage from './pages/admin/AdminFoodsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'

// Layout wrapper for customer-facing pages (Navbar + Footer)
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </>
)

const App = () => (
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/*  Public pages  */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/*  Authenticated customer pages  */}
            <Route path="/cart"
              element={<ProtectedRoute><PublicLayout><CartPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/orders"
              element={<ProtectedRoute><PublicLayout><OrdersPage /></PublicLayout></ProtectedRoute>} />
            <Route path="/profile"
              element={<ProtectedRoute><PublicLayout><ProfilePage /></PublicLayout></ProtectedRoute>} />

            {/*  Admin-only pages (sidebar layout)  */}
            <Route path="/admin"
              element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/foods"
              element={<ProtectedRoute adminOnly><AdminLayout><AdminFoodsPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/categories"
              element={<ProtectedRoute adminOnly><AdminLayout><AdminCategoriesPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/orders"
              element={<ProtectedRoute adminOnly><AdminLayout><AdminOrdersPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/users"
              element={<ProtectedRoute adminOnly><AdminLayout><AdminUsersPage /></AdminLayout></ProtectedRoute>} />

            {/*  Fallback  */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
)

export default App

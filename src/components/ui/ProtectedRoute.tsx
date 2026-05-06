import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader } from './Loader'

export const ProtectedRoute = ({
  children, adminOnly = false,
}: {
  children: React.ReactNode; adminOnly?: boolean
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return <Loader fullPage />
  if (!isAuthenticated) return <Navigate to="/signin" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

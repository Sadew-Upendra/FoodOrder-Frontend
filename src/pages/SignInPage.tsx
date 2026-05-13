import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Utensils, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const SignInPage = () => {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast('Welcome back! 👋', 'success')
      navigate('/menu')
    } catch {
      toast('Invalid email or password', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="pt-[72px] min-h-screen bg-[#f1f2f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top banner */}
          <div className="bg-gradient-to-br from-[#ff4757] to-[#c0392b] p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils size={28} className="text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/80 mt-1 text-sm">Sign in to your FoodieExpress account</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Admin hint */}
            {/*
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 font-medium">
              🔑 <strong>Admin:</strong> admin@foodorder.lk / Admin@1234
            </div>
            */}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#2f3542] mb-2">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#ff4757] focus:outline-none text-sm transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#2f3542] mb-2">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Your password"
                  className="w-full pl-11 pr-11 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#ff4757] focus:outline-none text-sm transition-colors"
                />
                <button type="button" onClick={() => setShow(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#ff4757] hover:bg-[#e84118] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#ff4757] font-bold hover:underline">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignInPage

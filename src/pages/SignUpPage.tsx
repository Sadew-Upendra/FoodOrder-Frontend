import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Utensils, Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail, isStrongPassword } from '../utils/validators'

const FIELDS = [
  { label: 'Full Name *', key: 'name', type: 'text', Icon: User, placeholder: 'John Doe' },
  { label: 'Email Address *', key: 'email', type: 'email', Icon: Mail, placeholder: 'name@example.com' },
  { label: 'Password *', key: 'password', type: 'password', Icon: Lock, placeholder: 'Min. 6 characters' },
  { label: 'Confirm Password *', key: 'confirmPassword', type: 'password', Icon: Lock, placeholder: 'Repeat password' },
  { label: 'Phone', key: 'phone', type: 'tel', Icon: Phone, placeholder: '+94 77 000 0000' },
  { label: 'Delivery Address', key: 'address', type: 'text', Icon: MapPin, placeholder: '123 Main St, Colombo' },
]

const SignUpPage = () => {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', address: '',
  })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(form.email)) { toast('Enter a valid email address', 'warning'); return }
    if (!isStrongPassword(form.password)) { toast('Password must be at least 6 characters', 'warning'); return }
    if (form.password !== form.confirmPassword) { toast('Passwords do not match', 'error'); return }
    setLoading(true)
    try {
      await signUp({
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, address: form.address,
      })
      toast('Welcome to FoodieExpress! 🎉', 'success')
      navigate('/menu')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data
      toast(typeof msg === 'string' ? msg : 'Registration failed. Please try again.', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="pt-[72px] min-h-screen bg-[#f1f2f6] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-gradient-to-br from-[#ff4757] to-[#c0392b] p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils size={28} className="text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">Create Account</h1>
            <p className="text-white/80 mt-1 text-sm">Join FoodieExpress and start ordering!</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {FIELDS.map(({ label, key, type, Icon, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-[#2f3542] mb-2">{label}</label>
                <div className="relative">
                  <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={type === 'password' ? (show ? 'text' : 'password') : type}
                    required={label.includes('*')}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-11 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#ff4757] focus:outline-none text-sm transition-colors"
                  />
                  {type === 'password' && (
                    <button type="button" onClick={() => setShow(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-[#ff4757] hover:bg-[#e84118] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 mt-2">
              {loading ? 'Creating account…' : 'Create Account 🎉'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#ff4757] font-bold hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage

import { useEffect, useRef, useState } from 'react'
import { User, Mail, Phone, MapPin, Shield, Edit3, Save, X, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { userApi } from '../api/userApi'
import { type UserDto } from '../utils/types'
import { Badge } from '../components/ui/Badge'
import { Loader } from '../components/ui/Loader'
import { getInitials } from '../utils/formatters'

const ProfilePage = () => {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [profile, setProfile] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })

  const toastRef = useRef(toast)
  toastRef.current = toast

  useEffect(() => {
    if (!isAuthenticated) return
    userApi.getMe()
      .then(d => { setProfile(d); setForm({ name: d.name, phone: d.phone ?? '', address: d.address ?? '' }) })
      .catch(() => toastRef.current('Failed to load profile', 'error'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleCancel = () => {
    if (!profile) return
    setEditing(false)
    setForm({ name: profile.name, phone: profile.phone ?? '', address: profile.address ?? '' })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      setProfile(p => p ? { ...p, name: form.name, phone: form.phone, address: form.address } : p)
      setEditing(false)
      toast('Profile updated ✅', 'success')
    } catch { toast('Failed to update profile', 'error') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="pt-[72px] min-h-screen bg-[#f1f2f6]"><Loader /></div>
  if (!profile) return null

  const ROWS = [
    { icon: Mail, label: 'Email', value: profile.email, editable: false },
    { icon: Phone, label: 'Phone', value: profile.phone || 'Not set', editable: true, key: 'phone' },
    { icon: MapPin, label: 'Address', value: profile.address || 'Not set', editable: true, key: 'address' },
    { icon: Shield, label: 'Role', value: profile.role, editable: false, badge: true },
  ]

  return (
    <div className="pt-[72px] min-h-screen bg-[#f1f2f6]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2f3542] to-[#3d4451] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-24 h-24 bg-[#ff4757] rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl ring-4 ring-white/10">
            <span className="text-white font-extrabold text-3xl">{getInitials(profile.name)}</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-1">{profile.name}</h1>
          <p className="text-gray-300 mb-3">{profile.email}</p>
          <Badge label={profile.role} variant={profile.role === 'ADMIN' ? 'warning' : 'info'} className="text-sm px-4 py-1" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        {/* Profile card */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-bold text-[#2f3542] text-xl flex items-center gap-2">
              <User size={20} className="text-[#ff4757]" /> Profile Information
            </h2>
            {!editing
              ? <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-sm font-semibold text-[#ff4757] border-2 border-[#ff4757] px-4 py-2 rounded-xl hover:bg-[#ff4757] hover:text-white transition-all">
                <Edit3 size={15} /> Edit
              </button>
              : <div className="flex gap-2">
                <button onClick={handleCancel}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 border-2 border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
                  <X size={15} /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-[#ff4757] px-4 py-2 rounded-xl hover:bg-[#e84118] transition-all disabled:opacity-60">
                  <Save size={15} /> {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            }
          </div>

          <div className="divide-y divide-gray-50">
            {/* Name row */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="w-10 h-10 bg-[#ff4757]/10 rounded-xl flex items-center justify-center shrink-0">
                <User size={18} className="text-[#ff4757]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                {editing
                  ? <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border-2 border-[#ff4757] rounded-xl px-3 py-2 text-sm font-medium focus:outline-none" />
                  : <p className="font-semibold text-[#2f3542]">{profile.name}</p>
                }
              </div>
            </div>

            {ROWS.map(({ icon: Icon, label, value, editable, key, badge }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-5">
                <div className="w-10 h-10 bg-[#ff4757]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#ff4757]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  {editing && editable && key
                    ? <input value={form[key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full border-2 border-[#ff4757] rounded-xl px-3 py-2 text-sm font-medium focus:outline-none" />
                    : badge
                      ? <Badge label={value} variant={value === 'ADMIN' ? 'warning' : 'info'} />
                      : <p className={`font-semibold ${value === 'Not set' ? 'text-gray-300 italic' : 'text-[#2f3542]'}`}>{value}</p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-700">
            <strong>User ID:</strong>{' '}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">{profile.userId}</code>
            <p className="mt-1 text-blue-600">Profile changes are saved for this session. Contact an admin to update your email or role.</p>
          </div>
        </div>

        {/* Security card */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h3 className="font-bold text-[#2f3542] mb-2 flex items-center gap-2">
            <Shield size={18} className="text-[#ff4757]" /> Account Security
          </h3>
          <p className="text-gray-500 text-sm mb-4">Your account is secured with JWT authentication. Sessions expire after 24 hours.</p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium flex items-center gap-2">
            ✅ Account is active and secure
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

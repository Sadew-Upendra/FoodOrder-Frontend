import { useCallback, useEffect, useState } from 'react'
import { Trash2, Search, Users } from 'lucide-react'
import { userApi } from '../../api/userApi'
import { type UserDto } from '../../utils/types'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { useToast } from '../../context/ToastContext'
import { getInitials } from '../../utils/formatters'

const AdminUsersPage = () => {
  const { toast } = useToast()

  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try { setUsers(await userApi.getAll()) }
    catch { toast('Failed to load users', 'error') }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return
    try { await userApi.deleteUser(id); toast('User deleted', 'success'); load() }
    catch { toast('Failed to delete user', 'error') }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const admins = filtered.filter(u => u.role === 'ADMIN')
  const customers = filtered.filter(u => u.role === 'CUSTOMER')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2f3542]">All Users</h2>
          <p className="text-gray-400 text-sm mt-1">{users.length} registered users</p>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-semibold">
            {admins.length} Admin{admins.length !== 1 ? 's' : ''}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
            {customers.length} Customer{customers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ff4757] focus:outline-none" />
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {['User', 'Email', 'Phone', 'Address', 'Role', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#ff4757] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">{getInitials(u.name)}</span>
                        </div>
                        <span className="font-semibold text-[#2f3542]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{u.email}</td>
                    <td className="px-5 py-4 text-gray-500">{u.phone || '—'}</td>
                    <td className="px-5 py-4 text-gray-500 max-w-[150px] truncate">{u.address || '—'}</td>
                    <td className="px-5 py-4">
                      <Badge label={u.role} variant={u.role === 'ADMIN' ? 'warning' : 'info'} />
                    </td>
                    <td className="px-5 py-4">
                      {u.role !== 'ADMIN'
                        ? <button onClick={() => handleDelete(u.userId, u.name)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                          <Trash2 size={13} /> Delete
                        </button>
                        : <span className="text-xs text-gray-300 italic">Protected</span>
                      }
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-14">
                      <Users size={40} className="mx-auto mb-3 text-gray-200" />
                      <p className="text-gray-400">No users found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage

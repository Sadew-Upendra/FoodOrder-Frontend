import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, ImageIcon } from 'lucide-react'
import { foodApi } from '../../api/foodApi'
import { categoryApi } from '../../api/categoryApi'
import { type FoodItemResponse, type FoodItemRequest, type CategoryResponse } from '../../utils/types'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { useToast } from '../../context/ToastContext'
import { formatLKR, truncate } from '../../utils/formatters'
import { FALLBACK_IMG } from '../../data/constants'

const EMPTY: FoodItemRequest = { name: '', description: '', price: 0, imageUrl: '', status: 'AVAILABLE', categoryId: '' }

const AdminFoodsPage = () => {
  const { toast } = useToast()

  const [foods, setFoods] = useState<FoodItemResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<FoodItemRequest>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [f, c] = await Promise.all([foodApi.getAll(), categoryApi.getAll()])
      setFoods(f); setCategories(c)
    } catch { toast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (f: FoodItemResponse) => {
    setForm({ name: f.name, description: f.description ?? '', price: f.price, imageUrl: f.imageUrl ?? '', status: f.status, categoryId: f.categoryId })
    setEditId(f.foodItemId); setModal(true)
  }
  const handleClose = () => { setModal(false); setForm(EMPTY); setEditId(null) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) { toast('Please select a category', 'warning'); return }
    setSaving(true)
    try {
      if (editId) { await foodApi.update(editId, form); toast('Food item updated ✅', 'success') }
      else { await foodApi.create(form); toast('Food item created ✅', 'success') }
      handleClose(); load()
    } catch { toast('Failed to save food item', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try { await foodApi.delete(id); toast('Deleted successfully', 'success'); load() }
    catch { toast('Failed to delete item', 'error') }
  }

  const set = (k: keyof FoodItemRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: k === 'price' ? +e.target.value : e.target.value }))

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.categoryName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2f3542]">Food Items</h2>
          <p className="text-gray-400 text-sm mt-1">{foods.length} items total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#ff4757] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#e84118] transition-all shadow-md text-sm">
          <Plus size={18} /> Add Food Item
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food items…"
          className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#ff4757] focus:outline-none" />
      </div>

      {loading ? <Loader /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {['Image', 'Name', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(f => (
                  <tr key={f.foodItemId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <img src={f.imageUrl || FALLBACK_IMG} alt={f.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                        onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#2f3542]">{f.name}</p>
                      {f.description && <p className="text-gray-400 text-xs mt-0.5">{truncate(f.description, 50)}</p>}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{f.categoryName}</td>
                    <td className="px-5 py-4 font-bold text-[#ff4757]">{formatLKR(f.price)}</td>
                    <td className="px-5 py-4">
                      <Badge label={f.status} variant={f.status === 'AVAILABLE' ? 'success' : 'error'} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(f)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => handleDelete(f.foodItemId, f.name)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-gray-400 py-14">No food items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal open={modal} title={editId ? 'Edit Food Item' : 'Add Food Item'} onClose={handleClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#2f3542] mb-1.5">Name *</label>
            <input required value={form.name} onChange={set('name')}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#ff4757] focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2f3542] mb-1.5">Description</label>
            <textarea value={form.description ?? ''} onChange={set('description')} rows={2}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:border-[#ff4757] focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2f3542] mb-1.5 flex items-center gap-1.5">
              <ImageIcon size={14} /> Image URL
            </label>
            <input value={form.imageUrl ?? ''} onChange={set('imageUrl')}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#ff4757] focus:outline-none transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2f3542] mb-1.5">Price (LKR) *</label>
              <input type="number" min="0" step="0.01" required value={form.price} onChange={set('price')}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#ff4757] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2f3542] mb-1.5">Status *</label>
              <select value={form.status} onChange={set('status')}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#ff4757] focus:outline-none transition-colors bg-white">
                <option value="AVAILABLE">Available</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2f3542] mb-1.5">Category *</label>
            <select required value={form.categoryId} onChange={set('categoryId')}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#ff4757] focus:outline-none transition-colors bg-white">
              <option value="">Select category…</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
            </select>
          </div>
          {/* Image preview */}
          {form.imageUrl && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <img src={form.imageUrl} alt="preview"
                className="w-14 h-14 rounded-lg object-cover bg-gray-200"
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} />
              <span className="text-xs text-gray-400">Image preview</span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#ff4757] text-white py-3 rounded-xl font-semibold hover:bg-[#e84118] transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : editId ? 'Update Item' : 'Create Item'}
            </button>
            <button type="button" onClick={handleClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminFoodsPage

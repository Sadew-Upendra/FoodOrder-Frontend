import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { categoryApi } from '../../api/categoryApi'
import { type CategoryResponse, type CategoryRequest } from '../../utils/types'
import { Modal } from '../../components/ui/Modal'
import { Loader } from '../../components/ui/Loader'
import { useToast } from '../../context/ToastContext'
import { getCategoryEmoji } from '../../data/constants'

const EMPTY: CategoryRequest = { name: '', description: '', imageUrl: '' }

const AdminCategoriesPage = () => {
  const { toast } = useToast()

  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<CategoryRequest>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { setCategories(await categoryApi.getAll()) }
    catch { toast('Failed to load categories', 'error') }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (c: CategoryResponse) => {
    setForm({ name: c.name, description: c.description ?? '', imageUrl: c.imageUrl ?? '' })
    setEditId(c.categoryId); setModal(true)
  }
  const handleClose = () => { setModal(false); setForm(EMPTY); setEditId(null) }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editId) { await categoryApi.update(editId, form); toast('Category updated ✅', 'success') }
      else { await categoryApi.create(form); toast('Category created ✅', 'success') }
      handleClose(); load()
    } catch { toast('Failed to save category', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try { await categoryApi.delete(id); toast('Category deleted', 'success'); load() }
    catch { toast('Failed to delete category', 'error') }
  }

  const set = (k: keyof CategoryRequest) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2f3542]">Categories</h2>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#ff4757] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#e84118] transition-all shadow-md text-sm">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map(c => (
            <div key={c.categoryId} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-[#ff4757]/10 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                {getCategoryEmoji(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#2f3542] truncate">{c.name}</h3>
                {c.description && <p className="text-gray-400 text-xs mt-0.5 truncate">{c.description}</p>}
                <p className="text-xs text-[#ff4757] font-semibold mt-1">{c.foodItemCount} items</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => openEdit(c)}
                  className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(c.categoryId, c.name)}
                  className="p-2 text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400">
              <Tag size={40} className="mx-auto mb-3 opacity-30" />
              <p>No categories yet. Create one!</p>
            </div>
          )}
        </div>
      )}

      <Modal open={modal} title={editId ? 'Edit Category' : 'Add Category'} onClose={handleClose} maxW="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {(
            [
              { label: 'Category Name *', key: 'name', placeholder: 'e.g. Burgers', required: true },
              { label: 'Description', key: 'description', placeholder: 'Short description' },
              { label: 'Image URL', key: 'imageUrl', placeholder: 'https://…' },
            ] as Array<{ label: string; key: keyof CategoryRequest; placeholder: string; required?: boolean }>)
            .map(({ label, key, placeholder, required }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-[#2f3542] mb-1.5">{label}</label>
              <input
                required={required ?? false}
                value={form[key] ?? ''}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#ff4757] focus:outline-none transition-colors"
              />
            </div>
          ))}

          {/* Emoji preview */}
          {form.name && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <span className="text-3xl">{getCategoryEmoji(form.name)}</span>
              <span className="text-sm text-gray-500 font-medium">
                Preview: <strong className="text-[#2f3542]">{form.name}</strong>
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#ff4757] text-white py-3 rounded-xl font-semibold hover:bg-[#e84118] transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : editId ? 'Update' : 'Create'}
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

export default AdminCategoriesPage

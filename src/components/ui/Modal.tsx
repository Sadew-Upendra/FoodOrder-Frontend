import { useEffect } from 'react'
import { X } from 'lucide-react'

export const Modal = ({
  open, title, onClose, children, maxW = 'max-w-lg',
}: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode; maxW?: string
}) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${maxW} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-[#2f3542] text-lg">{title}</h2>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

import { createContext, useCallback, useContext, useState } from 'react'
import { X } from 'lucide-react'

type TType = 'success' | 'error' | 'warning' | 'info'
interface Toast { id: number; message: string; type: TType }
interface ToastCtx { toast: (msg: string, type?: TType) => void }

const ToastContext = createContext<ToastCtx>({ toast: () => { } })

const STYLES: Record<TType, { bar: string; icon: string }> = {
  success: { bar: 'bg-emerald-500', icon: '✅' },
  error: { bar: 'bg-red-500', icon: '❌' },
  warning: { bar: 'bg-amber-500', icon: '⚠️' },
  info: { bar: 'bg-blue-500', icon: 'ℹ️' },
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: TType = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-80">
        {toasts.map(t => (
          <div key={t.id}
            className="pointer-events-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex items-stretch border border-gray-100"
            style={{ animation: 'slideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div className={`w-1.5 shrink-0 ${STYLES[t.type].bar}`} />
            <div className="flex items-center gap-3 px-4 py-3.5 flex-1">
              <span className="text-lg">{STYLES[t.type].icon}</span>
              <p className="text-sm font-semibold text-[#2f3542] flex-1">{t.message}</p>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
                className="text-gray-300 hover:text-gray-500 transition-colors ml-1">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

import { type LucideIcon } from 'lucide-react'

export const StatCard = ({
  icon: Icon, label, value, color, bg, trend,
}: {
  icon: LucideIcon; label: string; value: string | number; color: string; bg: string; trend?: string
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
      <Icon size={26} className={color} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="font-extrabold text-2xl text-[#2f3542] mt-0.5">{value}</p>
      {trend && <p className="text-xs text-emerald-500 font-semibold mt-1">{trend}</p>}
    </div>
  </div>
)

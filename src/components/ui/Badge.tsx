import { type BadgeVariant } from '../../utils/orderStatus'

const styles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  error: 'bg-red-100    text-red-700    border border-red-200',
  warning: 'bg-amber-100  text-amber-700  border border-amber-200',
  info: 'bg-blue-100   text-blue-700   border border-blue-200',
  default: 'bg-gray-100   text-gray-600   border border-gray-200',
}

export const Badge = ({
  label, variant = 'default', className = '',
}: {
  label: string; variant?: BadgeVariant; className?: string
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[variant]} ${className}`}>
    {label}
  </span>
)

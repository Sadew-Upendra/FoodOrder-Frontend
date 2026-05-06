export const EmptyState = ({
  emoji, title, desc, action,
}: {
  emoji: string; title: string; desc?: string; action?: React.ReactNode
}) => (
  <div className="flex flex-col items-center justify-center text-center py-20 px-4">
    <div className="text-7xl mb-5">{emoji}</div>
    <h3 className="font-bold text-[#2f3542] text-xl mb-2">{title}</h3>
    {desc && <p className="text-gray-400 mb-6 max-w-xs">{desc}</p>}
    {action && action}
  </div>
)

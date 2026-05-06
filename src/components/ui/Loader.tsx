export const Loader = ({
  message = 'Loading…',
  fullPage = false,
}: {
  message?: string
  fullPage?: boolean
}) => (
  <div className={`flex flex-col items-center justify-center gap-4 ${fullPage ? 'min-h-screen' : 'py-24'}`}>
    <div className="w-12 h-12 border-4 border-gray-100 border-t-[#ff4757] rounded-full animate-spin" />
    <p className="text-gray-400 text-sm font-medium">{message}</p>
  </div>
)

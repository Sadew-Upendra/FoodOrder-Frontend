import { type CategoryResponse } from '../../utils/types'

export const CategoryFilter = ({
  categories, selected, onSelect,
}: {
  categories: CategoryResponse[]
  selected: string | null
  onSelect: (id: string | null) => void
}) => (
  <div className="flex flex-wrap gap-2.5">
    <button
      onClick={() => onSelect(null)}
      className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all whitespace-nowrap
        ${selected === null
          ? 'bg-[#ff4757] text-white border-[#ff4757] shadow-md'
          : 'bg-white text-[#2f3542] border-gray-200 hover:border-[#ff4757] hover:text-[#ff4757]'
        }`}
    >
      All Items
    </button>
    {categories.map(c => (
      <button
        key={c.categoryId}
        onClick={() => onSelect(c.categoryId)}
        className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all whitespace-nowrap
          ${selected === c.categoryId
            ? 'bg-[#ff4757] text-white border-[#ff4757] shadow-md'
            : 'bg-white text-[#2f3542] border-gray-200 hover:border-[#ff4757] hover:text-[#ff4757]'
          }`}
      >
        {c.name}
        <span className="ml-1 opacity-60 text-[11px]">({c.foodItemCount})</span>
      </button>
    ))}
  </div>
)

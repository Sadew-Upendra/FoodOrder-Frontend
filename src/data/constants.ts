export const BASE_URL     = '/foodorder/api/v1'
export const DELIVERY_FEE = 250
export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600'

export const CATEGORY_EMOJIS: Record<string, string> = {
  default: '🍽️', burger: '🍔', pizza: '🍕', sushi: '🍣', pasta: '🍝',
  salad: '🥗', dessert: '🍰', drinks: '🥤', drink: '🥤', chicken: '🍗',
  rice: '🍚', soup: '🍜', sandwich: '🥪', seafood: '🦞', bbq: '🥩',
  cake: '🎂', coffee: '☕', ice: '🍦', noodles: '🍜',
}

export const getCategoryEmoji = (name: string) =>
  CATEGORY_EMOJIS[name.toLowerCase()] ?? CATEGORY_EMOJIS.default

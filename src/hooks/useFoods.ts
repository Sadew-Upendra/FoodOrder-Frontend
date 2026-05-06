import { useCallback, useEffect, useState } from 'react'
import { foodApi } from '../api/foodApi'
import { categoryApi } from '../api/categoryApi'
import { type FoodItemResponse, type CategoryResponse } from '../utils/types'

export const useFoods = (categoryId?: string | null, search?: string) => {
  const [foods, setFoods] = useState<FoodItemResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFoods = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const data = await foodApi.getAll({
        categoryId: categoryId ?? undefined,
        search: search ?? undefined,
      })
      setFoods(data)
    } catch { setError('Failed to load items.') }
    finally { setLoading(false) }
  }, [categoryId, search])

  useEffect(() => { categoryApi.getAll().then(setCategories).catch(() => { }) }, [])
  useEffect(() => { loadFoods() }, [loadFoods])

  return { foods, categories, loading, error, refetch: loadFoods }
}

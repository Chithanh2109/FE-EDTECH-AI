"use client"

import { useState } from "react"
import type { Course } from "@/types/course"
import { CourseService } from "@/services/courseService"

export const useAISuggestions = () => {
  const [suggestions, setSuggestions] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSuggestions = async (userId?: string, userBehavior?: any) => {
    try {
      setLoading(true)
      setError(null)

      const data = await CourseService.getAISuggestions(userId, userBehavior)
      setSuggestions(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể lấy gợi ý AI lúc này"
      setError(errorMessage)
      setSuggestions([])
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearSuggestions = () => {
    setSuggestions([])
    setError(null)
  }

  return {
    suggestions,
    loading,
    error,
    getSuggestions,
    clearSuggestions,
  }
}

import axios from "axios"
import type { Course, ApiResponse, SuggestionResponse } from "@/types/course"
import { MOCK_COURSES } from "@/constants/courses"

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
})

export class CourseService {
  // Get all courses (mock)
  static async getAllCourses(): Promise<Course[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_COURSES
  }

  // Get AI suggestions with fallback
  static async getAISuggestions(userId = "default", userBehavior?: any): Promise<Course[]> {
    const buildFallback = (): Course[] =>
      [...MOCK_COURSES].sort((a, b) => b.rating * b.students - a.rating * a.students).slice(0, 6)

    try {
      const params = new URLSearchParams()
      params.append("userId", userId)
      if (userBehavior) params.append("behavior", JSON.stringify(userBehavior))

      const { data } = await api.get<ApiResponse<SuggestionResponse>>(`/suggestions?${params.toString()}`)

      if (data?.success && data.data?.suggestions?.length) {
        return data.data.suggestions
      }

      console.warn("AI suggestion API returned unsuccessful response, using fallback list.")
      return buildFallback()
    } catch (error: any) {
      console.error("Error fetching AI suggestions:", error?.message || "Unknown error")
      return buildFallback()
    }
  }

  // Search courses
  static searchCourses(courses: Course[], searchTerm: string): Course[] {
    if (!searchTerm.trim()) return courses

    const term = searchTerm.toLowerCase()
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term) ||
        course.tags.some((tag) => tag.toLowerCase().includes(term)),
    )
  }

  // Advanced search with price filter
  static advancedSearchCourses(courses: Course[], searchTerm: string, priceFilter: string): Course[] {
    let filtered = courses

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = this.searchCourses(filtered, searchTerm)
    }

    // Apply price filter
    filtered = this.filterCoursesByPrice(filtered, priceFilter)

    return filtered
  }

  // Filter courses by price
  static filterCoursesByPrice(courses: Course[], priceFilter: string): Course[] {
    switch (priceFilter) {
      case "under500k":
        return courses.filter((course) => course.price < 500000)
      case "500k-1m":
        return courses.filter((course) => course.price >= 500000 && course.price <= 1000000)
      case "over1m":
        return courses.filter((course) => course.price > 1000000)
      case "all":
      default:
        return courses
    }
  }

  // Get filter counts
  static getFilterCounts(courses: Course[]): Record<string, number> {
    return {
      all: courses.length,
      under500k: courses.filter((c) => c.price < 500000).length,
      "500k-1m": courses.filter((c) => c.price >= 500000 && c.price <= 1000000).length,
      over1m: courses.filter((c) => c.price > 1000000).length,
    }
  }
}

"use client"

import { useState, useEffect } from "react"
import type { Course } from "@/types/course"
import { CourseService } from "@/services/courseService"

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem("favorites")
        return savedFavorites ? JSON.parse(savedFavorites) : []
      } catch (error) {
        console.error("Error loading favorites:", error)
        return []
      }
    }

    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await CourseService.getAllCourses()
        const savedFavorites = loadFavorites()

        // Apply saved favorites to courses
        const coursesWithFavorites = data.map((course) => ({
          ...course,
          isFavorite: savedFavorites.includes(course.id),
        }))

        setCourses(coursesWithFavorites)
      } catch (err) {
        setError("Không thể tải danh sách khóa học")
        console.error("Error fetching courses:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Save favorites to localStorage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      const favoriteIds = courses.filter((course) => course.isFavorite).map((course) => course.id)
      try {
        localStorage.setItem("favorites", JSON.stringify(favoriteIds))
      } catch (error) {
        console.error("Error saving favorites:", error)
      }
    }
  }, [courses])

  const toggleFavorite = (courseId: string) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId ? { ...course, isFavorite: !course.isFavorite } : course,
      )

      // Immediately save to localStorage
      const favoriteIds = updatedCourses.filter((course) => course.isFavorite).map((course) => course.id)
      try {
        localStorage.setItem("favorites", JSON.stringify(favoriteIds))
      } catch (error) {
        console.error("Error saving favorites:", error)
      }

      return updatedCourses
    })
  }

  // Get favorite courses
  const getFavoriteCourses = () => {
    return courses.filter((course) => course.isFavorite)
  }

  // Get favorite count
  const getFavoriteCount = () => {
    return courses.filter((course) => course.isFavorite).length
  }

  return {
    courses,
    loading,
    error,
    toggleFavorite,
    getFavoriteCourses,
    getFavoriteCount,
  }
}

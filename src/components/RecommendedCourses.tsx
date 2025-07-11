"use client"

import { Sparkles, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/types/course"

interface RecommendedCoursesProps {
  cartCourses: (Course & { quantity: number })[]
  allCourses: Course[]
  onAddToCart: (courseId: string) => void
  onViewDetail: (course: Course) => void
}

export const RecommendedCourses = ({ cartCourses, allCourses, onAddToCart, onViewDetail }: RecommendedCoursesProps) => {
  // Get recommended courses based on cart content
  const getRecommendedCourses = () => {
    const cartCourseIds = cartCourses.map((c) => c.id)
    const cartCategories = [...new Set(cartCourses.map((c) => c.category))]
    const cartInstructors = [...new Set(cartCourses.map((c) => c.instructor))]

    // Filter out courses already in cart
    const availableCourses = allCourses.filter((course) => !cartCourseIds.includes(course.id))

    // Score courses based on similarity to cart content
    const scoredCourses = availableCourses.map((course) => {
      let score = 0

      // Same category bonus
      if (cartCategories.includes(course.category)) score += 3

      // Same instructor bonus
      if (cartInstructors.includes(course.instructor)) score += 2

      // High rating bonus
      if (course.rating >= 4.7) score += 1

      // Popular course bonus
      if (course.students > 2000) score += 1

      return { ...course, score }
    })

    // Sort by score and return top 3
    return scoredCourses.sort((a, b) => b.score - a.score).slice(0, 3)
  }

  const recommendedCourses = getRecommendedCourses()

  if (recommendedCourses.length === 0) return null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-semibold">Khóa học được gợi ý</h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Dựa trên giỏ hàng của bạn
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCourses.map((course) => (
            <div key={course.id} className="relative">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />

                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 mb-2">
                    {course.category}
                  </Badge>

                  <h4 className="font-semibold text-sm line-clamp-2 mb-2">{course.title}</h4>

                  <div className="text-xs text-gray-600 mb-2">{course.instructor}</div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-orange-600">{course.price.toLocaleString("vi-VN")} VNĐ</div>
                    <div className="text-xs text-yellow-600">★ {course.rating}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAddToCart(course.id)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Thêm vào giỏ
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(course)} className="text-xs">
                      Xem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent">
            <Sparkles className="h-4 w-4 mr-2" />
            Xem thêm gợi ý AI
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

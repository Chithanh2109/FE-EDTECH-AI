"use client"

import { useState } from "react"
import { Sparkles, TrendingUp, Heart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { CourseCard } from "@/components/CourseCard"
import { useAISuggestions } from "@/hooks/useAISuggestions"
import { useCart } from "@/hooks/useCart"
import type { Course } from "@/types/course"

interface AdvancedRecommendationsProps {
  courses: Course[]
  favoriteCourses: Course[]
  onToggleFavorite: (courseId: string) => void
  onViewDetail: (course: Course) => void
  onAddToCart: (courseId: string) => void
}

export const AdvancedRecommendations = ({
  courses,
  favoriteCourses,
  onToggleFavorite,
  onViewDetail,
  onAddToCart,
}: AdvancedRecommendationsProps) => {
  const { suggestions, loading, error, getSuggestions, clearSuggestions } = useAISuggestions()
  const { cartItems } = useCart()

  const [activeTab, setActiveTab] = useState("ai")
  const [isGenerating, setIsGenerating] = useState(false)

  // Get cart courses
  const cartCourses = cartItems.map((item) => courses.find((c) => c.id === item.courseId)).filter(Boolean) as Course[]

  // Generate recommendations based on different strategies
  const generateRecommendations = async (strategy: string) => {
    setIsGenerating(true)

    try {
      let userBehavior = {}

      switch (strategy) {
        case "ai":
          userBehavior = {
            favoriteCourses: favoriteCourses.map((c) => c.id),
            cartCourses: cartCourses.map((c) => c.id),
            favoriteCategories: [...new Set(favoriteCourses.map((c) => c.category))],
            favoriteInstructors: [...new Set(favoriteCourses.map((c) => c.instructor))],
          }
          break

        case "cart":
          userBehavior = {
            cartCourses: cartCourses.map((c) => c.id),
            cartCategories: [...new Set(cartCourses.map((c) => c.category))],
            cartInstructors: [...new Set(cartCourses.map((c) => c.instructor))],
          }
          break
      }

      await getSuggestions(`user_${Date.now()}`, userBehavior)
    } catch (err) {
      console.error("Error generating recommendations:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Get trending courses (high rating + high student count)
  const getTrendingCourses = () => {
    return courses
      .filter((course) => !favoriteCourses.some((fav) => fav.id === course.id))
      .sort((a, b) => b.rating * Math.log(b.students) - a.rating * Math.log(a.students))
      .slice(0, 6)
  }

  // Get similar courses based on favorites
  const getSimilarToFavorites = () => {
    if (favoriteCourses.length === 0) return []

    const favoriteCategories = [...new Set(favoriteCourses.map((c) => c.category))]
    const favoriteInstructors = [...new Set(favoriteCourses.map((c) => c.instructor))]

    return courses
      .filter(
        (course) =>
          !favoriteCourses.some((fav) => fav.id === course.id) &&
          (favoriteCategories.includes(course.category) || favoriteInstructors.includes(course.instructor)),
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }

  const trendingCourses = getTrendingCourses()
  const similarToFavorites = getSimilarToFavorites()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Gợi Ý Thông Minh
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Cá Nhân
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Xu Hướng
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Tương Tự
            </TabsTrigger>
          </TabsList>

          {/* AI Personalized Recommendations */}
          <TabsContent value="ai" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Gợi Ý AI Cá Nhân Hóa</h3>
                <p className="text-sm text-gray-600">Dựa trên yêu thích và giỏ hàng của bạn</p>
              </div>
              <Button
                onClick={() => generateRecommendations("ai")}
                disabled={isGenerating || loading}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {isGenerating || loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Đang phân tích...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Tạo gợi ý AI
                  </div>
                )}
              </Button>
            </div>

            {loading && <LoadingSkeleton />}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-red-600 font-medium mb-2">Không thể lấy gợi ý lúc này</div>
                <p className="text-sm text-red-500 mb-3">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateRecommendations("ai")}
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  Thử lại
                </Button>
              </div>
            )}

            {suggestions.length > 0 && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onToggleFavorite={onToggleFavorite}
                    onViewDetail={onViewDetail}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}

            {suggestions.length === 0 && !loading && !error && (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nhấn "Tạo gợi ý AI" để nhận gợi ý cá nhân hóa</p>
              </div>
            )}
          </TabsContent>

          {/* Trending Courses */}
          <TabsContent value="trending" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Khóa Học Xu Hướng</h3>
              <p className="text-sm text-gray-600 mb-4">Những khóa học được đánh giá cao và có nhiều học viên nhất</p>
            </div>

            {trendingCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onToggleFavorite={onToggleFavorite}
                    onViewDetail={onViewDetail}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Không có khóa học xu hướng</p>
              </div>
            )}
          </TabsContent>

          {/* Similar to Favorites */}
          <TabsContent value="favorites" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Tương Tự Yêu Thích</h3>
              <p className="text-sm text-gray-600 mb-4">Khóa học tương tự với những khóa học bạn đã yêu thích</p>
            </div>

            {similarToFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarToFavorites.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onToggleFavorite={onToggleFavorite}
                    onViewDetail={onViewDetail}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {favoriteCourses.length === 0
                    ? "Hãy thêm khóa học vào yêu thích để nhận gợi ý"
                    : "Không tìm thấy khóa học tương tự"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

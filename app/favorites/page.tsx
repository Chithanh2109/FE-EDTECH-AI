"use client"

import { useState } from "react"
import { Heart, ArrowLeft, Filter, SortAsc, Sparkles, Lightbulb, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Custom hooks
import { useCourses } from "@/hooks/useCourses"
import { useAISuggestions } from "@/hooks/useAISuggestions"

// Components
import { Header } from "@/components/Header"
import { CourseGrid } from "@/components/CourseGrid"
import { CourseModal } from "@/components/CourseModal"
import { EmptyState } from "@/components/EmptyState"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Types
import type { Course } from "@/types/course"

export default function FavoritesPage() {
  // Custom hooks
  const { courses, loading: coursesLoading, toggleFavorite } = useCourses()
  const { suggestions, loading: suggestionsLoading, getSuggestions, clearSuggestions } = useAISuggestions()

  // Local state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [sortBy, setSortBy] = useState("recent")
  const [searchTerm, setSearchTerm] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)

  const { toast } = useToast()

  // Get favorite courses
  const favoriteCourses = courses.filter((course) => course.isFavorite)

  // Filter and sort favorite courses
  const filteredFavorites = favoriteCourses
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.title.localeCompare(b.title)
        default: // recent
          return b.students - a.students // Mock recent by popularity
      }
    })

  // Handle favorite toggle with toast
  const handleToggleFavorite = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      toggleFavorite(courseId)
      toast({
        title: course.isFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
        description: course.title,
      })
    }
  }

  // Handle course detail view
  const handleViewDetail = (course: Course) => {
    setSelectedCourse(course)
  }

  // Handle AI recommendations based on user behavior
  const handleGetRecommendations = async () => {
    try {
      // Simulate user behavior data
      const userBehavior = {
        favoriteCourses: favoriteCourses.map((course) => course.id),
        favoriteCategories: [...new Set(favoriteCourses.map((course) => course.category))],
        favoriteInstructors: [...new Set(favoriteCourses.map((course) => course.instructor))],
      }

      const suggestedCourses = await getSuggestions(`user_${Date.now()}`, userBehavior)
      setShowRecommendations(true)

      toast({
        title: "🎯 Gợi Ý Thông Minh Đã Sẵn Sàng!",
        description: `Tìm thấy ${suggestedCourses.length} khóa học phù hợp với sở thích của bạn`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lấy gợi ý lúc này. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const favoriteCount = favoriteCourses.length

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} favoriteCount={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onSearch={setSearchTerm} favoriteCount={favoriteCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại trang chủ
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Khóa học yêu thích</h1>
              <p className="text-gray-600">
                {favoriteCount > 0
                  ? `Bạn đã lưu ${favoriteCount} khóa học yêu thích`
                  : "Chưa có khóa học yêu thích nào"}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {favoriteCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-2xl font-bold text-red-500">{favoriteCount}</div>
                <div className="text-sm text-gray-600">Khóa học yêu thích</div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-2xl font-bold text-green-500">
                  {Math.round((favoriteCourses.reduce((sum, course) => sum + course.rating, 0) / favoriteCount) * 10) /
                    10}
                  ★
                </div>
                <div className="text-sm text-gray-600">Đánh giá trung bình</div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-2xl font-bold text-blue-500">
                  {favoriteCourses.reduce((sum, course) => sum + course.price, 0).toLocaleString("vi-VN")}
                </div>
                <div className="text-sm text-gray-600">Tổng giá trị (VNĐ)</div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-2xl font-bold text-purple-500">
                  {Math.round(favoriteCourses.reduce((sum, course) => sum + course.price, 0) * 0.7).toLocaleString(
                    "vi-VN",
                  )}
                </div>
                <div className="text-sm text-gray-600">Tiết kiệm 30% (VNĐ)</div>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {favoriteCount > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-6 w-6" />
                    <h3 className="text-xl font-bold">Gợi Ý Thông Minh Dành Riêng Cho Bạn</h3>
                  </div>
                  <p className="opacity-90 mb-4">
                    Dựa trên {favoriteCount} khóa học yêu thích của bạn, AI sẽ tìm những khóa học phù hợp nhất
                  </p>
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100"
                      onClick={handleGetRecommendations}
                      disabled={suggestionsLoading}
                    >
                      <Lightbulb className="h-5 w-5 mr-2" />
                      {suggestionsLoading ? "Đang phân tích..." : "Gợi ý sản phẩm phù hợp"}
                    </Button>
                    {showRecommendations && suggestions.length > 0 && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 bg-transparent"
                        onClick={() => {
                          setShowRecommendations(false)
                          clearSuggestions()
                        }}
                      >
                        Ẩn gợi ý
                      </Button>
                    )}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">AI</div>
                    <div className="text-sm opacity-80">Phân tích thông minh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Results */}
        {showRecommendations && suggestions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Khóa Học Được Gợi Ý Cho Bạn</h2>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-purple-700">Dựa trên hành vi của bạn</span>
              </div>
            </div>

            {/* Behavior Analysis */}
            <div className="bg-white rounded-lg p-4 mb-6 border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Phân tích hành vi của bạn:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Danh mục yêu thích:</span>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(favoriteCourses.map((course) => course.category))].map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Mức độ:</span>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(favoriteCourses.map((course) => course.level))].map((level) => (
                      <Badge key={level} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Khoảng giá:</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.min(...favoriteCourses.map((c) => c.price)).toLocaleString("vi-VN")} -{" "}
                    {Math.max(...favoriteCourses.map((c) => c.price)).toLocaleString("vi-VN")} VNĐ
                  </Badge>
                </div>
              </div>
            </div>

            <CourseGrid courses={suggestions} onToggleFavorite={handleToggleFavorite} onViewDetail={handleViewDetail} />
          </div>
        )}

        {/* Loading Skeleton for Suggestions */}
        {suggestionsLoading && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
              <h2 className="text-2xl font-bold">AI đang phân tích hành vi của bạn...</h2>
            </div>
            <div className="bg-white rounded-lg p-4 mb-6 border">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500 animate-pulse" />
                <span className="font-semibold">Đang phân tích sở thích và hành vi...</span>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* Toolbar */}
        {favoriteCount > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Hiển thị {filteredFavorites.length} khóa học</span>
                </div>
                {searchTerm && <div className="text-sm text-gray-600">cho "{searchTerm}"</div>}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="recent">Mới nhất</option>
                    <option value="name">Tên A-Z</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    favoriteCourses.forEach((course) => toggleFavorite(course.id))
                    toast({
                      title: "Đã xóa tất cả khỏi yêu thích",
                      description: `${favoriteCount} khóa học đã được xóa`,
                    })
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {filteredFavorites.length > 0 ? (
          <>
            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Sẵn sàng bắt đầu học?</h3>
                  <p className="opacity-90">
                    Bạn có {favoriteCount} khóa học tuyệt vời đang chờ. Hãy bắt đầu hành trình học tập ngay hôm nay!
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                    Đăng ký ngay
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 bg-transparent"
                  >
                    Xem thêm
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <CourseGrid
              courses={filteredFavorites}
              onToggleFavorite={handleToggleFavorite}
              onViewDetail={handleViewDetail}
            />
          </>
        ) : favoriteCount === 0 ? (
          /* Empty State - No Favorites */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có khóa học yêu thích</h3>
              <p className="text-gray-600 mb-8">
                Hãy khám phá và lưu những khóa học bạn quan tâm để dễ dàng tìm lại sau này.
              </p>
              <div className="space-y-4">
                <Link href="/">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600">
                    <Heart className="h-4 w-4 mr-2" />
                    Khám phá khóa học
                  </Button>
                </Link>
                <div className="text-sm text-gray-500">💡 Mẹo: Nhấn vào icon ❤️ trên khóa học để thêm vào yêu thích</div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State - No Search Results */
          <EmptyState
            icon={<Heart className="h-12 w-12" />}
            title={`Không tìm thấy khóa học yêu thích nào với từ khóa "${searchTerm}"`}
            description="Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc"
          />
        )}
      </div>

      {/* Course Detail Modal */}
      <CourseModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={(courseId) => {
          const course = courses.find((c) => c.id === courseId)
          if (course) {
            // Thêm logic add to cart ở đây nếu cần
            toast({
              title: "✅ Đã thêm vào giỏ hàng",
              description: course.title,
            })
          }
        }}
      />
    </div>
  )
}

"use client"

import React from "react"

import { useState } from "react"
import { Sparkles, TrendingUp, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

// Custom hooks
import { useCourses } from "@/hooks/useCourses"
import { useCart } from "@/hooks/useCart"

// Components
import { Header } from "@/components/Header"
import { CourseGrid } from "@/components/CourseGrid"
import { CourseModal } from "@/components/CourseModal"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { ChatBot } from "@/components/ChatBot"
import { FavoriteButton } from "@/components/FavoriteButton"
import { SearchFilter } from "@/components/SearchFilter"
import { AdvancedRecommendations } from "@/components/AdvancedRecommendations"
import { FavoriteToast } from "@/components/FavoriteToast"

// Services
import { CourseService } from "@/services/courseService"

// Types
import type { Course } from "@/types/course"

export default function HomePage() {
  // Custom hooks
  const { courses, loading: coursesLoading, toggleFavorite, getFavoriteCount } = useCourses()
  const { addToCart, getCartCount } = useCart()

  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [sortBy, setSortBy] = useState("popular")
  const [priceFilter, setPriceFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [favoriteToast, setFavoriteToast] = useState<{
    course: Course | null
    isAdded: boolean
  }>({ course: null, isAdded: false })

  const { toast } = useToast()

  // Filter courses based on search, price, and category
  React.useEffect(() => {
    let filtered = CourseService.advancedSearchCourses(courses, searchTerm, priceFilter)

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category === categoryFilter)
    }

    // Sort courses
    let sorted = [...filtered]
    switch (sortBy) {
      case "price-low":
        sorted = sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted = sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted = sorted.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        sorted = sorted.sort((a, b) => b.students - a.students)
        break
      default:
        sorted = sorted.sort((a, b) => b.rating * b.students - a.rating * a.students)
    }

    setFilteredCourses(sorted)
  }, [searchTerm, priceFilter, categoryFilter, courses, sortBy])

  // Handle category filter from header
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category)
    toast({
      title: `Lọc theo danh mục: ${category}`,
      description: `Hiển thị các khóa học thuộc danh mục ${category}`,
    })
  }

  // Handle favorite toggle with custom toast
  const handleToggleFavorite = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      const wasAdded = !course.isFavorite
      toggleFavorite(courseId)

      // Show custom toast
      setFavoriteToast({
        course,
        isAdded: wasAdded,
      })

      // Also show regular toast
      toast({
        title: wasAdded ? "❤️ Đã thêm vào yêu thích" : "💔 Đã xóa khỏi yêu thích",
        description: course.title,
        duration: 2000,
      })
    }
  }

  // Handle course detail view
  const handleViewDetail = (course: Course) => {
    setSelectedCourse(course)
  }

  // Handle add to cart
  const handleAddToCart = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      addToCart(courseId)
      toast({
        title: "✅ Đã thêm vào giỏ hàng",
        description: course.title,
      })
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setPriceFilter("all")
    setCategoryFilter("all")
  }

  const favoriteCount = getFavoriteCount()
  const favoriteCourses = courses.filter((c) => c.isFavorite)
  const cartCount = getCartCount()

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchTerm} onCategoryFilter={handleCategoryFilter} favoriteCount={0} cartCount={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onSearch={setSearchTerm}
        onCategoryFilter={handleCategoryFilter}
        favoriteCount={favoriteCount}
        cartCount={cartCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Khám phá hàng nghìn khóa học chất lượng cao</h2>
              <p className="text-lg mb-6 opacity-90">
                Học từ các chuyên gia hàng đầu với công nghệ AI hỗ trợ cá nhân hóa
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Khám phá ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                  onClick={() => setCategoryFilter("all")}
                >
                  Xem tất cả khóa học
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm opacity-80">Khóa học</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm opacity-80">Học viên</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-sm opacity-80">Đánh giá</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm opacity-80">Giảng viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Recommendations */}
        <div className="mb-8">
          <AdvancedRecommendations
            courses={courses}
            favoriteCourses={favoriteCourses}
            onToggleFavorite={handleToggleFavorite}
            onViewDetail={handleViewDetail}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Search & Filter - Full Width */}
        <SearchFilter
          searchTerm={searchTerm}
          priceFilter={priceFilter}
          onSearchChange={setSearchTerm}
          onPriceFilterChange={setPriceFilter}
          onClearFilters={handleClearFilters}
          resultCount={filteredCourses.length}
        />

        {/* Category Filter Display */}
        {categoryFilter !== "all" && (
          <div className="mb-6 flex items-center gap-4">
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <span>
                Đang lọc theo: <strong>{categoryFilter}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCategoryFilter("all")}
                className="text-orange-600 hover:bg-orange-200 h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold">{filteredCourses.length} khóa học được tìm thấy</h3>
            {searchTerm && <div className="text-sm text-gray-600">cho "{searchTerm}"</div>}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center border hover:shadow-md transition-shadow">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border hover:shadow-md transition-shadow">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">24/7</div>
            <div className="text-sm text-gray-600">Hỗ trợ học tập</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border hover:shadow-md transition-shadow">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">50K+</div>
            <div className="text-sm text-gray-600">Cộng đồng học viên</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border hover:shadow-md transition-shadow">
            <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">AI</div>
            <div className="text-sm text-gray-600">Hỗ trợ thông minh</div>
          </div>
        </div>

        {/* Course Grid - Full Width */}
        <CourseGrid
          courses={filteredCourses}
          onToggleFavorite={handleToggleFavorite}
          onViewDetail={handleViewDetail}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Course Detail Modal */}
      <CourseModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />

      {/* ChatBot */}
      <ChatBot onCourseSelect={handleViewDetail} />

      {/* Floating Favorite Button */}
      {favoriteCount > 0 && <FavoriteButton favoriteCount={favoriteCount} variant="floating" showCount={false} />}

      {/* Custom Favorite Toast */}
      <FavoriteToast
        course={favoriteToast.course}
        isAdded={favoriteToast.isAdded}
        onClose={() => setFavoriteToast({ course: null, isAdded: false })}
        onUndo={() => {
          if (favoriteToast.course) {
            handleToggleFavorite(favoriteToast.course.id)
            setFavoriteToast({ course: null, isAdded: false })
          }
        }}
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import { ArrowLeft, ShoppingCart, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Custom hooks
import { useCart } from "@/hooks/useCart"
import { useCourses } from "@/hooks/useCourses"

// Components
import { Header } from "@/components/Header"
import { CartItem } from "@/components/CartItem"
import { CartSummary } from "@/components/CartSummary"
import { CourseModal } from "@/components/CourseModal"
import { EmptyCart } from "@/components/EmptyCart"
import { PromoCodeInput } from "@/components/PromoCodeInput"
import { RecommendedCourses } from "@/components/RecommendedCourses"

// Types
import type { Course } from "@/types/course"

export default function CartPage() {
  // Custom hooks
  const { courses, toggleFavorite } = useCourses()
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    discount,
  } = useCart()

  // Local state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const { toast } = useToast()

  // Get cart courses with details
  const cartCourses = cartItems
    .map((item) => {
      const course = courses.find((c) => c.id === item.courseId)
      return course ? { ...course, quantity: item.quantity } : null
    })
    .filter(Boolean) as (Course & { quantity: number })[]

  // Handle checkout
  const handleCheckout = async () => {
    if (cartCourses.length === 0) return

    setIsCheckingOut(true)

    try {
      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "🎉 Thanh toán thành công!",
        description: `Bạn đã đăng ký ${cartCourses.length} khóa học. Chúc bạn học tập hiệu quả!`,
      })

      clearCart()
    } catch (error) {
      toast({
        title: "Lỗi thanh toán",
        description: "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Handle remove item
  const handleRemoveItem = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    removeFromCart(courseId)

    toast({
      title: "Đã xóa khỏi giỏ hàng",
      description: course?.title,
    })
  }

  // Handle clear cart
  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Đã xóa tất cả khóa học",
      description: "Giỏ hàng của bạn hiện đang trống",
    })
  }

  const favoriteCount = courses.filter((c) => c.isFavorite).length
  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onSearch={() => {}} favoriteCount={favoriteCount} cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 rounded-full">
              <ShoppingCart className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
              <p className="text-gray-600">
                {cartCount > 0 ? `${cartCount} khóa học đang chờ thanh toán` : "Giỏ hàng hiện đang trống"}
              </p>
            </div>
          </div>
        </div>

        {cartCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Khóa học đã chọn ({cartCount})</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa tất cả
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Thanh toán an toàn với mã hóa SSL 256-bit</span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartCourses.map((course) => (
                  <CartItem
                    key={course.id}
                    course={course}
                    quantity={course.quantity}
                    onUpdateQuantity={(quantity) => updateQuantity(course.id, quantity)}
                    onRemove={() => handleRemoveItem(course.id)}
                    onViewDetail={() => setSelectedCourse(course)}
                    onToggleFavorite={() => toggleFavorite(course.id)}
                  />
                ))}
              </div>

              {/* Promo Code */}
              <PromoCodeInput
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
                appliedCoupon={appliedCoupon}
                discount={discount}
              />

              {/* Recommended Courses */}
              <RecommendedCourses
                cartCourses={cartCourses}
                allCourses={courses}
                onAddToCart={addToCart}
                onViewDetail={setSelectedCourse}
              />
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                cartCourses={cartCourses}
                appliedCoupon={appliedCoupon}
                discount={discount}
                total={cartTotal}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>

      {/* Course Detail Modal */}
      <CourseModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
      />
    </div>
  )
}

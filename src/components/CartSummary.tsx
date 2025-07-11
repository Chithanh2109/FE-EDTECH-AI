"use client"

import { CreditCard, Shield, Gift, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Course, Coupon } from "@/types/course"
import { formatPrice } from "@/utils/formatters"

interface CartSummaryProps {
  cartCourses: (Course & { quantity: number })[]
  appliedCoupon: Coupon | null
  discount: number
  total: number
  onCheckout: () => void
  isCheckingOut: boolean
}

export const CartSummary = ({
  cartCourses,
  appliedCoupon,
  discount,
  total,
  onCheckout,
  isCheckingOut,
}: CartSummaryProps) => {
  const subtotal = cartCourses.reduce((sum, course) => sum + course.price * course.quantity, 0)
  const originalTotal = cartCourses.reduce(
    (sum, course) => sum + (course.originalPrice || course.price) * course.quantity,
    0,
  )
  const savings = originalTotal - subtotal
  const finalTotal = total

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            Tóm tắt đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Course List */}
          <div className="space-y-3">
            {cartCourses.map((course) => (
              <div key={course.id} className="flex justify-between items-center text-sm">
                <div className="flex-1 min-w-0">
                  <div className="font-medium line-clamp-1">{course.title}</div>
                  <div className="text-gray-500">Số lượng: {course.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(course.price * course.quantity)}</div>
                  {course.originalPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice(course.originalPrice * course.quantity)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {savings > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Tiết kiệm:</span>
                <span>-{formatPrice(savings)}</span>
              </div>
            )}

            {appliedCoupon && discount > 0 && (
              <div className="flex justify-between text-sm text-blue-600">
                <span className="flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  Mã giảm giá ({appliedCoupon.code}):
                </span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-orange-600">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={onCheckout}
            disabled={isCheckingOut || cartCourses.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg font-semibold"
          >
            {isCheckingOut ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Đang xử lý...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thanh toán ngay
              </div>
            )}
          </Button>

          {/* Security Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Thanh toán an toàn & bảo mật</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>SSL 256-bit</span>
              <span>•</span>
              <span>Bảo vệ thông tin</span>
              <span>•</span>
              <span>Hoàn tiền 100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Quyền lợi của bạn
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Truy cập trọn đời</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Chứng chỉ hoàn thành</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Cập nhật nội dung miễn phí</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guarantee */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Cam kết hoàn tiền</span>
          </div>
          <p className="text-sm text-green-700">Hoàn tiền 100% trong vòng 30 ngày nếu không hài lòng</p>
        </CardContent>
      </Card>
    </div>
  )
}

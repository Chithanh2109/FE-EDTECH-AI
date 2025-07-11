"use client"

import { useState } from "react"
import { Gift, Check, X, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Coupon } from "@/types/course"
import { formatPrice } from "@/utils/formatters"

interface PromoCodeInputProps {
  onApplyCoupon: (code: string) => Promise<boolean>
  onRemoveCoupon: () => void
  appliedCoupon: Coupon | null
  discount: number
}

export const PromoCodeInput = ({ onApplyCoupon, onRemoveCoupon, appliedCoupon, discount }: PromoCodeInputProps) => {
  const [promoCode, setPromoCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState("")

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return

    setIsApplying(true)
    setError("")

    try {
      const success = await onApplyCoupon(promoCode.trim().toUpperCase())
      if (success) {
        setPromoCode("")
      } else {
        setError("Mã giảm giá không hợp lệ hoặc đã hết hạn")
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi áp dụng mã giảm giá")
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemoveCoupon = () => {
    onRemoveCoupon()
    setError("")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold">Mã giảm giá</h3>
        </div>

        {appliedCoupon ? (
          /* Applied Coupon Display */
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-800">{appliedCoupon.code}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {appliedCoupon.type === "percentage"
                        ? `${appliedCoupon.value}%`
                        : formatPrice(appliedCoupon.value)}
                    </Badge>
                  </div>
                  <div className="text-sm text-green-700">{appliedCoupon.description}</div>
                  <div className="text-sm font-medium text-green-800">Tiết kiệm: {formatPrice(discount)}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Promo Code Input */
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Nhập mã giảm giá..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className={`${error ? "border-red-300 focus:border-red-500" : ""}`}
                />
                {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
              </div>
              <Button
                onClick={handleApplyCoupon}
                disabled={!promoCode.trim() || isApplying}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {isApplying ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  "Áp dụng"
                )}
              </Button>
            </div>

            {/* Available Coupons */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Mã giảm giá có sẵn:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: "WELCOME10", description: "Giảm 10% cho đơn hàng đầu tiên" },
                  { code: "STUDENT20", description: "Giảm 20% cho sinh viên" },
                  { code: "COMBO30", description: "Giảm 30% khi mua từ 3 khóa học" },
                ].map((coupon) => (
                  <Button
                    key={coupon.code}
                    variant="outline"
                    size="sm"
                    onClick={() => setPromoCode(coupon.code)}
                    className="text-xs hover:bg-purple-50 hover:border-purple-200"
                  >
                    <Percent className="h-3 w-3 mr-1" />
                    {coupon.code}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

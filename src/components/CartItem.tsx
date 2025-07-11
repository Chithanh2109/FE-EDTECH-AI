"use client"

import { useState } from "react"
import { Star, Heart, Trash2, Eye, Plus, Minus, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Course } from "@/types/course"
import { formatPrice } from "@/utils/formatters"

interface CartItemProps {
  course: Course & { quantity: number }
  quantity: number
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  onViewDetail: () => void
  onToggleFavorite: () => void
}

export const CartItem = ({
  course,
  quantity,
  onUpdateQuantity,
  onRemove,
  onViewDetail,
  onToggleFavorite,
}: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    onRemove()
  }

  const discountPercent = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0

  const totalPrice = course.price * quantity

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${isRemoving ? "opacity-50 scale-95" : "hover:shadow-md"}`}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Course Image */}
          <div className="relative flex-shrink-0">
            <img
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              className="w-32 h-24 object-cover rounded-lg"
            />
            {discountPercent > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-xs">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Course Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 mb-2">
                  {course.category}
                </Badge>
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">{course.title}</h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs bg-orange-100 text-orange-600">
                      {course.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{course.instructor}</span>
                </div>

                {/* Course Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-gray-400">({course.students.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.level}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="icon" onClick={onToggleFavorite} className="hover:bg-red-50">
                  <Heart className={`h-4 w-4 ${course.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={onViewDetail} className="hover:bg-blue-50">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="hover:bg-red-50 text-red-600"
                  disabled={isRemoving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Price and Quantity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-600">{formatPrice(course.price)}</span>
                  {course.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{formatPrice(course.originalPrice)}</span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(quantity + 1)}
                    disabled={quantity >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <div className="text-sm text-gray-600">Tổng cộng</div>
                <div className="text-xl font-bold text-green-600">{formatPrice(totalPrice)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

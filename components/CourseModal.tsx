"use client"

import { Star, Users, Clock, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Course } from "@/types/course"
import { formatPrice } from "@/utils/formatters"

interface CourseModalProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onToggleFavorite: (id: string) => void
  onAddToCart?: (courseId: string) => void
}

export const CourseModal = ({ course, isOpen, onClose, onToggleFavorite, onAddToCart }: CourseModalProps) => {
  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-gray-500">({course.students} học viên)</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.level}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Giảng viên</p>
              <p className="font-semibold">{course.instructor}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Giá</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">{formatPrice(course.price)}</span>
                {course.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">{formatPrice(course.originalPrice)}</span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Danh mục</p>
              <Badge variant="secondary">{course.category}</Badge>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Thẻ</p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  if (onAddToCart && course) {
                    onAddToCart(course.id)
                  }
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" size="icon" onClick={() => onToggleFavorite(course.id)}>
                <Heart className={`h-4 w-4 ${course.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Mô tả khóa học</h3>
          <p className="text-gray-700 leading-relaxed">{course.fullDescription}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

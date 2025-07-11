"use client"

import type React from "react"

import { Star, Clock, Heart, ShoppingCart, Award, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Course } from "@/types/course"
import { formatPrice } from "@/utils/formatters"

interface CourseCardProps {
  course: Course
  onToggleFavorite: (id: string) => void
  onViewDetail: (course: Course) => void
  onAddToCart?: (courseId: string) => void
}

export const CourseCard = ({ course, onToggleFavorite, onViewDetail, onAddToCart }: CourseCardProps) => {
  const discountPercent = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(course.id)
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(course.id)
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md h-full flex flex-col">
      <div className="relative">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className={`shadow-md transition-all duration-200 ${
                course.isFavorite ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/90 hover:bg-white"
              }`}
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-200 ${
                  course.isFavorite ? "fill-white text-white" : "text-gray-600"
                }`}
              />
            </Button>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 rounded-full"
              onClick={() => onViewDetail(course)}
            >
              <Play className="h-5 w-5 mr-2" />
              Xem trước
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {course.originalPrice && <Badge className="bg-red-500 text-white font-bold">-{discountPercent}%</Badge>}
          {course.rating >= 4.8 && (
            <Badge className="bg-yellow-500 text-white">
              <Award className="h-3 w-3 mr-1" />
              Bestseller
            </Badge>
          )}
          {course.isFavorite && (
            <Badge className="bg-red-500 text-white">
              <Heart className="h-3 w-3 mr-1 fill-white" />
              Yêu thích
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Category */}
        <div className="mb-2">
          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
            {course.category}
          </Badge>
        </div>

        {/* Title - Fixed height */}
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors min-h-[3.5rem]">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-xs bg-orange-100 text-orange-600">
              {course.instructor
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600 line-clamp-1">{course.instructor}</span>
        </div>

        {/* Stats */}
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
        </div>

        {/* Description - Fixed height */}
        <p className="text-sm text-gray-700 line-clamp-2 mb-4 min-h-[2.5rem]">{course.description}</p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">{formatPrice(course.price)}</span>
            {course.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{formatPrice(course.originalPrice)}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">{course.level}</div>
        </div>

        {/* Spacer to push actions to bottom */}
        <div className="flex-1"></div>

        {/* Actions - Always at bottom */}
        <div className="flex gap-2 mt-auto">
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 h-10" onClick={() => onViewDetail(course)}>
            Xem chi tiết
          </Button>
          {onAddToCart && (
            <Button
              variant="outline"
              size="icon"
              className="border-orange-200 hover:bg-orange-50 bg-transparent h-10 w-10"
              onClick={handleAddToCartClick}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Heart, Check, X, Undo } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/utils/formatters"
import type { Course } from "@/types/course"

interface FavoriteToastProps {
  course: Course | null
  isAdded: boolean
  onClose: () => void
  onUndo?: () => void
}

export const FavoriteToast = ({ course, isAdded, onClose, onUndo }: FavoriteToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (course) {
      setIsVisible(true)
      setCountdown(5)

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setIsVisible(false)
            setTimeout(onClose, 300)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [course, onClose])

  if (!course) return null

  const handleUndo = () => {
    if (onUndo) {
      onUndo()
      setIsVisible(false)
      setTimeout(onClose, 300)
    }
  }

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 shadow-lg border-l-4 border-l-red-500 bg-white">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`p-2 rounded-full ${isAdded ? "bg-red-100" : "bg-gray-100"}`}>
              <Heart className={`h-5 w-5 ${isAdded ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Check className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-sm">
                  {isAdded ? "Đã thêm vào yêu thích!" : "Đã xóa khỏi yêu thích"}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-8 h-6 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm line-clamp-1">{course.title}</div>
                  <div className="text-xs text-gray-600">{formatPrice(course.price)}</div>
                </div>
              </div>

              {onUndo && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    className="text-xs h-6 px-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <Undo className="h-3 w-3 mr-1" />
                    Hoàn tác
                  </Button>
                  <span className="text-xs text-gray-500">{countdown}s</span>
                </div>
              )}
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

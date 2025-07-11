"use client"

import { ShoppingCart, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Empty Cart Icon */}
        <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingCart className="h-16 w-16 text-orange-400" />
        </div>

        {/* Empty State Content */}
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h3>
        <p className="text-gray-600 mb-8 text-lg">
          Hãy khám phá và thêm những khóa học yêu thích vào giỏ hàng để bắt đầu hành trình học tập của bạn!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Khám phá khóa học
            </Button>
          </Link>

          <div className="flex gap-4 justify-center">
            <Link href="/favorites">
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Xem yêu thích
              </Button>
            </Link>

            <Button variant="outline" size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Gợi ý AI
            </Button>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-12">
          <h4 className="text-lg font-semibold mb-4">Danh mục phổ biến</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Ngoại ngữ", icon: "🌍", count: "156 khóa học" },
              { name: "Lập trình", icon: "💻", count: "89 khóa học" },
              { name: "Marketing", icon: "📈", count: "67 khóa học" },
              { name: "Thiết kế", icon: "🎨", count: "45 khóa học" },
              { name: "Kinh doanh", icon: "💼", count: "34 khóa học" },
              { name: "Khoa học dữ liệu", icon: "📊", count: "28 khóa học" },
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-800 mb-2">💡 Mẹo mua sắm thông minh</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Thêm khóa học vào yêu thích để theo dõi giá</li>
            <li>• Đăng ký nhận thông báo khuyến mãi</li>
            <li>• Mua combo để tiết kiệm hơn</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

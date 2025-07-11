"use client"

import type React from "react"

import { useState } from "react"
import { BookOpen, Search, Heart, ShoppingCart, User, Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

interface HeaderProps {
  onSearch: (term: string) => void
  onCategoryFilter?: (category: string) => void
  favoriteCount: number
  cartCount?: number
}

export const Header = ({ onSearch, onCategoryFilter, favoriteCount, cartCount = 0 }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleCategoryClick = (category: string) => {
    if (onCategoryFilter) {
      onCategoryFilter(category)
    }
    setIsMobileMenuOpen(false)
  }

  const categories = [
    { name: "Ngoại ngữ", icon: "🌍" },
    { name: "Lập trình", icon: "💻" },
    { name: "Marketing", icon: "📈" },
    { name: "Thiết kế", icon: "🎨" },
    { name: "Kinh doanh", icon: "💼" },
    { name: "Khoa học dữ liệu", icon: "📊" },
  ]

  const notifications = [
    {
      id: 1,
      title: "Khóa học mới: React Advanced",
      message: "Khóa học React nâng cao vừa được thêm vào danh sách yêu thích",
      time: "2 phút trước",
      type: "favorite",
      unread: true,
    },
    {
      id: 2,
      title: "Giảm giá 50%",
      message: "Khóa học Python AI đang có ưu đãi đặc biệt",
      time: "1 giờ trước",
      type: "promotion",
      unread: true,
    },
    {
      id: 3,
      title: "Hoàn thành khóa học",
      message: "Chúc mừng bạn đã hoàn thành khóa học JavaScript cơ bản",
      time: "1 ngày trước",
      type: "achievement",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>🎓 Khuyến mãi đặc biệt: Giảm 50% cho khóa học đầu tiên!</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Hotline: 1900-1234</span>
              <span>|</span>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EduMarket</h1>
              <p className="text-xs text-gray-500">Sàn Giáo Dục AI</p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Input
                placeholder="Tìm kiếm khóa học, giảng viên, kỹ năng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 text-base border-2 border-orange-200 focus:border-orange-500 rounded-lg"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 rounded-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Thông báo</h3>
                  <p className="text-sm text-gray-600">{unreadCount} thông báo chưa đọc</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-4 border-b last:border-b-0">
                      <div className="flex items-start gap-3 w-full">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-blue-500" : "bg-gray-300"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">{notification.message}</div>
                          <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <Button variant="ghost" className="w-full text-sm">
                    Xem tất cả thông báo
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites */}
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favoriteCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs">
                    {favoriteCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/favorites" className="w-full flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Yêu thích ({favoriteCount})
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/cart" className="w-full flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Giỏ hàng ({cartCount})
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="mt-6">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Input
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 pr-12"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Mobile Navigation */}
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Danh mục</h3>
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </Button>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Yêu thích ({favoriteCount})
                      </Button>
                    </Link>
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Giỏ hàng ({cartCount})
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t bg-gray-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-8 py-3 text-sm">
            <Link href="/" className="text-orange-600 font-medium">
              Trang chủ
            </Link>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="text-gray-700 hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
            <Link href="/favorites" className="text-gray-700 hover:text-orange-600 flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Yêu thích
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

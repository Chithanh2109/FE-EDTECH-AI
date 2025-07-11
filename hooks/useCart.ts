"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { CartItem, Coupon } from "@/types/course"

// Mock coupons
const MOCK_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "Giảm 10% cho đơn hàng đầu tiên",
    minAmount: 500000,
    maxDiscount: 200000,
    expiryDate: new Date("2024-12-31"),
    isActive: true,
  },
  {
    id: "2",
    code: "STUDENT20",
    type: "percentage",
    value: 20,
    description: "Giảm 20% cho sinh viên",
    minAmount: 800000,
    maxDiscount: 500000,
    expiryDate: new Date("2024-12-31"),
    isActive: true,
  },
  {
    id: "3",
    code: "COMBO30",
    type: "percentage",
    value: 30,
    description: "Giảm 30% khi mua từ 3 khóa học",
    minAmount: 1500000,
    maxDiscount: 1000000,
    expiryDate: new Date("2024-12-31"),
    isActive: true,
  },
  {
    id: "4",
    code: "SAVE100K",
    type: "fixed",
    value: 100000,
    description: "Giảm 100.000 VNĐ cho đơn hàng từ 1 triệu",
    minAmount: 1000000,
    expiryDate: new Date("2024-12-31"),
    isActive: true,
  },
]

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [discount, setDiscount] = useState(0)
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Add item to cart
  const addToCart = (courseId: string, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.courseId === courseId)

      if (existingItem) {
        return prev.map((item) => (item.courseId === courseId ? { ...item, quantity: item.quantity + quantity } : item))
      } else {
        return [...prev, { courseId, quantity }]
      }
    })

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: "Khóa học đã được thêm vào giỏ hàng của bạn",
    })
  }

  // Remove item from cart
  const removeFromCart = (courseId: string) => {
    setCartItems((prev) => prev.filter((item) => item.courseId !== courseId))
  }

  // Update item quantity
  const updateQuantity = (courseId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(courseId)
      return
    }

    setCartItems((prev) => prev.map((item) => (item.courseId === courseId ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    setAppliedCoupon(null)
    setDiscount(0)
  }

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Get cart total (before discount)
  const getCartSubtotal = () => {
    // This would need course data to calculate actual total
    // For now, return a mock calculation
    return cartItems.reduce((total, item) => total + 800000 * item.quantity, 0)
  }

  // Apply coupon
  const applyCoupon = async (code: string): Promise<boolean> => {
    const coupon = MOCK_COUPONS.find((c) => c.code === code && c.isActive && new Date() <= c.expiryDate)

    if (!coupon) {
      return false
    }

    const subtotal = getCartSubtotal()

    // Check minimum amount
    if (coupon.minAmount && subtotal < coupon.minAmount) {
      toast({
        title: "Không thể áp dụng mã giảm giá",
        description: `Đơn hàng tối thiểu ${coupon.minAmount.toLocaleString("vi-VN")} VNĐ`,
        variant: "destructive",
      })
      return false
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === "percentage") {
      discountAmount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      }
    } else {
      discountAmount = coupon.value
    }

    setAppliedCoupon(coupon)
    setDiscount(discountAmount)

    toast({
      title: "Áp dụng mã giảm giá thành công!",
      description: `Tiết kiệm ${discountAmount.toLocaleString("vi-VN")} VNĐ`,
    })

    return true
  }

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscount(0)

    toast({
      title: "Đã xóa mã giảm giá",
      description: "Mã giảm giá đã được gỡ bỏ khỏi đơn hàng",
    })
  }

  // Get final total (after discount)
  const getCartTotal = () => {
    const subtotal = getCartSubtotal()
    return Math.max(0, subtotal - discount)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartSubtotal,
    getCartTotal,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    discount,
  }
}

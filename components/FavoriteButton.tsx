"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface FavoriteButtonProps {
  favoriteCount: number
  variant?: "header" | "floating" | "sidebar"
  showCount?: boolean
}

export const FavoriteButton = ({ favoriteCount, variant = "header", showCount = true }: FavoriteButtonProps) => {
  const baseClasses = "relative transition-all duration-200"

  const variantClasses = {
    header: "hover:bg-gray-100",
    floating: "fixed bottom-20 right-6 z-40 bg-red-500 hover:bg-red-600 text-white shadow-lg rounded-full h-14 w-14",
    sidebar: "w-full justify-start gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
  }

  const content = (
    <>
      <Heart
        className={`${variant === "floating" ? "h-6 w-6" : "h-5 w-5"} ${favoriteCount > 0 ? "fill-current" : ""}`}
      />
      {variant !== "floating" && showCount && (
        <span className="ml-2">Yêu thích {favoriteCount > 0 && `(${favoriteCount})`}</span>
      )}
      {favoriteCount > 0 && variant !== "sidebar" && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs p-0 flex items-center justify-center">
          {favoriteCount}
        </Badge>
      )}
    </>
  )

  return (
    <Link href="/favorites">
      <Button
        variant={variant === "floating" ? "default" : "ghost"}
        size={variant === "floating" ? "lg" : variant === "sidebar" ? "default" : "icon"}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {content}
      </Button>
    </Link>
  )
}

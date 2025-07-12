export interface Course {
  id: string
  title: string
  instructor: string
  price: number
  originalPrice?: number
  image: string
  description: string
  fullDescription: string
  rating: number
  students: number
  duration: string
  level: string
  category: string
  tags: string[]
  isFavorite: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface SuggestionResponse {
  suggestions: Course[]
  message: string
  behaviorAnalysis?: BehaviorAnalysis
}

// Chat interfaces
export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  suggestions?: Course[]
}

export interface ChatResponse {
  message: string
  suggestions: Course[]
  intent: string
}

// Behavior analysis interfaces
export interface UserBehavior {
  viewedCourses: string[]
  favoriteCourses: string[]
  favoriteCategories: string[]
  favoriteInstructors: string[]
}

export interface BehaviorAnalysis {
  totalFavorites: number
  favoriteCategories: string[]
  favoriteInstructors: string[]
  viewHistory: number
}

// Cart interfaces
export interface CartItem {
  courseId: string
  quantity: number
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  description: string
  minAmount?: number
  maxDiscount?: number
  expiryDate: Date
  isActive: boolean
}

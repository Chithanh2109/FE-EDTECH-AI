import { type NextRequest, NextResponse } from "next/server"
import type { Course } from "@/types/course"

// Enhanced mock course data for behavior-based suggestions
const mockSuggestions: Course[] = [
  {
    id: "7",
    title: "JavaScript & TypeScript Nâng Cao",
    instructor: "Thầy Alex Kim",
    price: 950000,
    image: "/placeholder.svg?height=200&width=300",
    description: "Đi sâu vào JavaScript và TypeScript hiện đại cho phát triển chuyên nghiệp",
    fullDescription: "Khóa học nâng cao về JavaScript và TypeScript với các kỹ thuật hiện đại nhất.",
    rating: 4.7,
    students: 1234,
    duration: "10 tuần",
    level: "Nâng cao",
    category: "Lập trình",
    tags: ["JavaScript", "TypeScript", "ES6+", "Advanced"],
    isFavorite: false,
  },
  {
    id: "8",
    title: "Nguyên Tắc Thiết Kế UI/UX",
    instructor: "Cô Lisa Wang",
    price: 750000,
    image: "/placeholder.svg?height=200&width=300",
    description: "Học các nguyên tắc cơ bản về thiết kế giao diện và trải nghiệm người dùng",
    fullDescription: "Khóa học toàn diện về thiết kế UI/UX từ cơ bản đến nâng cao.",
    rating: 4.6,
    students: 987,
    duration: "8 tuần",
    level: "Cơ bản",
    category: "Thiết kế",
    tags: ["UI", "UX", "Design", "Figma"],
    isFavorite: false,
  },
  {
    id: "9",
    title: "Advanced English Conversation",
    instructor: "Mr. John Smith",
    price: 899000,
    originalPrice: 1200000,
    image: "/placeholder.svg?height=200&width=300",
    description: "Nâng cao kỹ năng giao tiếp tiếng Anh với giáo viên bản xứ",
    fullDescription: "Khóa học nâng cao kỹ năng giao tiếp tiếng Anh thông qua thực hành intensive.",
    rating: 4.9,
    students: 2156,
    duration: "12 tuần",
    level: "Nâng cao",
    category: "Ngoại ngữ",
    tags: ["Tiếng Anh", "Giao tiếp", "Advanced", "Native Speaker"],
    isFavorite: false,
  },
  {
    id: "10",
    title: "Digital Marketing Strategy 2024",
    instructor: "Cô Anna Nguyen",
    price: 1100000,
    image: "/placeholder.svg?height=200&width=300",
    description: "Chiến lược marketing số toàn diện cho năm 2024",
    fullDescription: "Học các chiến lược marketing số mới nhất và hiệu quả nhất.",
    rating: 4.8,
    students: 1876,
    duration: "14 tuần",
    level: "Trung cấp",
    category: "Marketing",
    tags: ["Digital Marketing", "Strategy", "2024", "ROI"],
    isFavorite: false,
  },
  {
    id: "11",
    title: "Machine Learning với Python",
    instructor: "TS. David Park",
    price: 1350000,
    image: "/placeholder.svg?height=200&width=300",
    description: "Khóa học machine learning thực hành với Python và TensorFlow",
    fullDescription: "Học machine learning từ cơ bản đến nâng cao với các dự án thực tế.",
    rating: 4.7,
    students: 1543,
    duration: "16 tuần",
    level: "Nâng cao",
    category: "Khoa học dữ liệu",
    tags: ["Python", "Machine Learning", "TensorFlow", "AI"],
    isFavorite: false,
  },
  {
    id: "12",
    title: "Startup & Entrepreneurship",
    instructor: "Thầy Michael Tran",
    price: 980000,
    image: "/placeholder.svg?height=200&width=300",
    description: "Hướng dẫn khởi nghiệp và xây dựng startup thành công",
    fullDescription: "Học cách xây dựng startup từ ý tưởng đến thực hiện thành công.",
    rating: 4.5,
    students: 876,
    duration: "10 tuần",
    level: "Cơ bản",
    category: "Kinh doanh",
    tags: ["Startup", "Entrepreneurship", "Business Plan", "Funding"],
    isFavorite: false,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")
  const behaviorParam = searchParams.get("behavior")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate random error (5% chance)
  if (Math.random() < 0.05) {
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server nội bộ",
      },
      { status: 500 },
    )
  }

  let suggestions: Course[] = []
  let analysisMessage = ""

  try {
    // Parse user behavior if provided
    const userBehavior = behaviorParam ? JSON.parse(behaviorParam) : null

    if (userBehavior) {
      // Smart recommendation based on user behavior
      const { favoriteCourses, favoriteCategories, favoriteInstructors, viewedCourses } = userBehavior

      // Filter suggestions based on user preferences
      let filteredSuggestions = mockSuggestions.filter((course) => {
        // Exclude courses user already favorited
        if (favoriteCourses?.includes(course.id)) return false

        // Prefer courses from favorite categories
        if (favoriteCategories?.includes(course.category)) return true

        // Prefer courses from favorite instructors
        if (
          favoriteInstructors?.some((instructor: string) =>
            course.instructor.toLowerCase().includes(instructor.toLowerCase()),
          )
        )
          return true

        // Include highly rated courses
        if (course.rating >= 4.7) return true

        return false
      })

      // If no filtered results, fall back to top-rated courses
      if (filteredSuggestions.length === 0) {
        filteredSuggestions = mockSuggestions
          .filter((course) => !favoriteCourses?.includes(course.id))
          .sort((a, b) => b.rating - a.rating)
      }

      // Sort by relevance score
      suggestions = filteredSuggestions
        .map((course) => ({
          ...course,
          relevanceScore: calculateRelevanceScore(course, userBehavior),
        }))
        .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
        .slice(0, 4)

      analysisMessage = `Dựa trên ${favoriteCourses?.length || 0} khóa học yêu thích và ${favoriteCategories?.length || 0} danh mục quan tâm của bạn`
    } else {
      // Default recommendations
      suggestions = mockSuggestions.sort((a, b) => b.rating * b.students - a.rating * a.students).slice(0, 3)

      analysisMessage = "Gợi ý phổ biến dành cho bạn"
    }

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        message: analysisMessage,
        behaviorAnalysis: userBehavior
          ? {
              totalFavorites: userBehavior.favoriteCourses?.length || 0,
              favoriteCategories: userBehavior.favoriteCategories || [],
              favoriteInstructors: userBehavior.favoriteInstructors || [],
              viewHistory: userBehavior.viewedCourses?.length || 0,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Error processing suggestions:", error)

    // Fallback to simple recommendations
    suggestions = mockSuggestions.slice(0, 3)

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        message: "Gợi ý khóa học phổ biến",
      },
    })
  }
}

// Calculate relevance score based on user behavior
function calculateRelevanceScore(course: Course, userBehavior: any): number {
  let score = 0

  // Category match (high weight)
  if (userBehavior.favoriteCategories?.includes(course.category)) {
    score += 50
  }

  // Instructor match (medium weight)
  if (
    userBehavior.favoriteInstructors?.some((instructor: string) =>
      course.instructor.toLowerCase().includes(instructor.toLowerCase()),
    )
  ) {
    score += 30
  }

  // Rating bonus (low weight)
  score += course.rating * 5

  // Popularity bonus (very low weight)
  score += Math.log(course.students) * 2

  // Price similarity (if user has price preferences)
  if (userBehavior.favoriteCourses?.length > 0) {
    // This would need actual favorite course data to calculate average price
    // For now, just add a small bonus for mid-range prices
    if (course.price >= 500000 && course.price <= 1500000) {
      score += 10
    }
  }

  return score
}

import type { ChatResponse, Course } from "@/types/course"
import { MOCK_COURSES } from "@/constants/courses"

export class ChatService {
  // Mock AI chat response
  static async getChatResponse(userMessage: string): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const message = userMessage.toLowerCase()
    let intent = "general"
    let suggestions: Course[] = []
    let responseMessage = ""

    // Intent detection and course matching
    if (
      message.includes("tiếng anh") ||
      message.includes("english") ||
      message.includes("người mỹ") ||
      message.includes("giao tiếp")
    ) {
      intent = "english_learning"
      suggestions = MOCK_COURSES.filter(
        (course) =>
          course.category === "Ngoại ngữ" ||
          course.title.toLowerCase().includes("tiếng anh") ||
          course.tags.some((tag) => tag.toLowerCase().includes("tiếng anh")),
      )
      responseMessage =
        "Tuyệt vời! Tôi hiểu bạn muốn học tiếng Anh. Đây là những khóa học tiếng Anh chất lượng cao với giáo viên bản xứ mà tôi gợi ý cho bạn:"
    } else if (
      message.includes("lập trình") ||
      message.includes("code") ||
      message.includes("web") ||
      message.includes("react") ||
      message.includes("javascript")
    ) {
      intent = "programming"
      suggestions = MOCK_COURSES.filter(
        (course) =>
          course.category === "Lập trình" ||
          course.tags.some((tag) => ["React", "JavaScript", "Node.js", "Lập trình"].includes(tag)),
      )
      responseMessage =
        "Bạn quan tâm đến lập trình! Đây là những khóa học lập trình từ cơ bản đến nâng cao mà tôi khuyên bạn nên xem:"
    } else if (message.includes("marketing") || message.includes("quảng cáo") || message.includes("bán hàng")) {
      intent = "marketing"
      suggestions = MOCK_COURSES.filter(
        (course) =>
          course.category === "Marketing" || course.tags.some((tag) => ["SEO", "Marketing", "Quảng cáo"].includes(tag)),
      )
      responseMessage = "Marketing là lĩnh vực rất thú vị! Tôi có một số khóa học marketing hiệu quả cho bạn:"
    } else if (
      message.includes("thiết kế") ||
      message.includes("design") ||
      message.includes("photoshop") ||
      message.includes("đồ họa")
    ) {
      intent = "design"
      suggestions = MOCK_COURSES.filter(
        (course) =>
          course.category === "Thiết kế" ||
          course.tags.some((tag) => ["Thiết kế", "Photoshop", "Illustrator"].includes(tag)),
      )
      responseMessage = "Thiết kế là một kỹ năng tuyệt vời! Đây là những khóa học thiết kế phù hợp với bạn:"
    } else if (
      message.includes("python") ||
      message.includes("data") ||
      message.includes("dữ liệu") ||
      message.includes("ai") ||
      message.includes("machine learning")
    ) {
      intent = "data_science"
      suggestions = MOCK_COURSES.filter(
        (course) =>
          course.category === "Khoa học dữ liệu" ||
          course.tags.some((tag) => ["Python", "AI", "Machine Learning"].includes(tag)),
      )
      responseMessage = "Khoa học dữ liệu và AI đang rất hot! Tôi gợi ý những khóa học này cho bạn:"
    } else if (
      message.includes("kinh doanh") ||
      message.includes("business") ||
      message.includes("quản lý") ||
      message.includes("lãnh đạo")
    ) {
      intent = "business"
      suggestions = MOCK_COURSES.filter(
        (course) =>
          course.category === "Kinh doanh" ||
          course.tags.some((tag) => ["Kinh doanh", "Lãnh đạo", "Quản lý"].includes(tag)),
      )
      responseMessage = "Kỹ năng kinh doanh rất quan trọng! Đây là những khóa học kinh doanh chất lượng:"
    } else if (
      message.includes("giá rẻ") ||
      message.includes("khuyến mãi") ||
      message.includes("miễn phí") ||
      message.includes("sale")
    ) {
      intent = "price_inquiry"
      suggestions = MOCK_COURSES.filter((course) => course.originalPrice && course.originalPrice > course.price)
        .sort((a, b) => a.price - b.price)
        .slice(0, 3)
      responseMessage = "Tôi hiểu bạn đang tìm khóa học có giá tốt! Đây là những khóa học đang có khuyến mãi hấp dẫn:"
    } else if (
      message.includes("tốt nhất") ||
      message.includes("chất lượng") ||
      message.includes("đánh giá cao") ||
      message.includes("nổi tiếng")
    ) {
      intent = "quality_inquiry"
      suggestions = MOCK_COURSES.filter((course) => course.rating >= 4.7)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
      responseMessage = "Bạn muốn tìm khóa học chất lượng cao! Đây là những khóa học được đánh giá tốt nhất:"
    } else if (
      message.includes("người mới") ||
      message.includes("cơ bản") ||
      message.includes("bắt đầu") ||
      message.includes("beginner")
    ) {
      intent = "beginner_inquiry"
      suggestions = MOCK_COURSES.filter((course) => course.level === "Cơ bản").slice(0, 3)
      responseMessage = "Tuyệt vời! Bạn đang muốn bắt đầu học một kỹ năng mới. Đây là những khóa học cơ bản phù hợp:"
    } else if (
      message.includes("nâng cao") ||
      message.includes("chuyên sâu") ||
      message.includes("advanced") ||
      message.includes("expert")
    ) {
      intent = "advanced_inquiry"
      suggestions = MOCK_COURSES.filter((course) => course.level === "Nâng cao").slice(0, 3)
      responseMessage = "Bạn đã có kinh nghiệm và muốn nâng cao kỹ năng! Đây là những khóa học nâng cao tôi gợi ý:"
    } else {
      // General response with popular courses
      intent = "general"
      suggestions = MOCK_COURSES.sort((a, b) => b.rating * b.students - a.rating * a.students).slice(0, 3)
      responseMessage =
        "Tôi hiểu bạn đang tìm hiểu về các khóa học. Đây là những khóa học phổ biến nhất mà nhiều học viên lựa chọn:"
    }

    // Add personalized touch to responses
    const personalizedResponses = [
      "Dựa trên yêu cầu của bạn, tôi đã tìm được những khóa học tuyệt vời này:",
      "Tôi nghĩ những khóa học này sẽ rất phù hợp với bạn:",
      "Đây là những gợi ý tốt nhất mà tôi có cho bạn:",
      "Tôi tin rằng bạn sẽ thích những khóa học này:",
    ]

    if (suggestions.length === 0) {
      responseMessage =
        "Xin lỗi, tôi chưa tìm thấy khóa học phù hợp với yêu cầu của bạn. Bạn có thể thử mô tả chi tiết hơn về những gì bạn muốn học không? 🤔"
    } else if (intent === "general") {
      responseMessage = personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)]
    }

    return {
      message: responseMessage,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      intent,
    }
  }

  // Get conversation starters
  static getConversationStarters(): string[] {
    return [
      "Tôi muốn học tiếng Anh với người Mỹ",
      "Khóa học lập trình web cho người mới bắt đầu",
      "Marketing online hiệu quả nhất",
      "Thiết kế đồ họa từ cơ bản",
      "Python cho khoa học dữ liệu",
      "Kỹ năng kinh doanh và lãnh đạo",
      "Khóa học nào đang có khuyến mãi?",
      "Khóa học nào được đánh giá cao nhất?",
    ]
  }

  // Analyze user intent for better responses
  static analyzeIntent(message: string): string {
    const keywords = {
      english: ["tiếng anh", "english", "người mỹ", "giao tiếp", "ielts", "toeic"],
      programming: ["lập trình", "code", "web", "react", "javascript", "python", "java"],
      marketing: ["marketing", "quảng cáo", "bán hàng", "seo", "facebook ads"],
      design: ["thiết kế", "design", "photoshop", "illustrator", "đồ họa"],
      business: ["kinh doanh", "business", "quản lý", "lãnh đạo", "startup"],
      price: ["giá rẻ", "khuyến mãi", "miễn phí", "sale", "giảm giá"],
      quality: ["tốt nhất", "chất lượng", "đánh giá cao", "nổi tiếng"],
      level_beginner: ["người mới", "cơ bản", "bắt đầu", "beginner"],
      level_advanced: ["nâng cao", "chuyên sâu", "advanced", "expert"],
    }

    const lowerMessage = message.toLowerCase()

    for (const [intent, words] of Object.entries(keywords)) {
      if (words.some((word) => lowerMessage.includes(word))) {
        return intent
      }
    }

    return "general"
  }
}

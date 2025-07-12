<<<<<<< HEAD
# Hướng dẫn cài đặt & chạy dự án
# EduMarket AI - Sàn Giáo Dục Thương Mại Điện Tử

Một nền tảng thương mại điện tử giáo dục hiện đại tích hợp AI, lấy cảm hứng từ Shopee, Italki và Wyzant.

## 🎯 Tính Năng Chính

### 🛒 **Cốt lõi thương mại điện tử**
- **Thẻ sản phẩm**: Thiết kế hiện đại với hiệu ứng hover
- **Giỏ hàng**: Quản lý số lượng và hệ thống mã giảm giá
- **Yêu thích**: Hệ thống yêu thích với thông báo tuỳ chỉnh
- **Tìm kiếm & Lọc**: Tìm kiếm thông minh

### 🤖 **Tích hợp AI**
- **Gợi ý thông minh**: 3 loại gợi ý (AI, Xu hướng, Yêu thích)
- **Chatbot**: Trợ lý AI tư vấn khoá học
- **Phân tích hành vi**: Phân tích hành vi người dùng

### 🎨 **UI/UX hiện đại**
- **Thiết kế responsive**: Ưu tiên mobile
- **Hiệu ứng tuỳ chỉnh**: Chuyển động mượt mà và hiệu ứng hover
- **Hệ thống thông báo**: Thông báo tuỳ chỉnh với chức năng hoàn tác
- **Trạng thái loading**: Skeleton loading cho trải nghiệm tốt hơn

### 📋 Yêu cầu
- Node.js 18+
- npm 10.9.2+

### ⚙️ Cài đặt

# Cài đặt thư viện
 npm install

# Chạy server phát triển
 npm run dev

# Build cho production
 npm run build

# Chạy server production
 npm start
```

### 🌐 Truy cập
- Phát triển: `http://localhost:3000`

## 🏗️ Cấu trúc dự án

```
education-ecommerce-platform/
├── app/                     # Next.js App Router
│   ├── page.tsx            # Trang chủ - FULL WIDTH LAYOUT
│   ├── cart/page.tsx       # Giỏ hàng
│   ├── favorites/page.tsx  # Trang yêu thích
│   └── api/                # API routes
├── components/             # Các component React
│   ├── ui/                 # Shadcn/ui components
│   ├── CourseCard.tsx      # Thẻ sản phẩm
│   ├── Header.tsx          # Header nhiều lớp
│   ├── ChatBot.tsx         # Chatbot AI
│   ├── SearchFilter.tsx    # Tìm kiếm + 1 bộ lọc giá - FULL WIDTH
│   └── ...
├── hooks/                  # Custom hooks
│   ├── useCourses.ts       # Quản lý khoá học
│   ├── useCart.ts          # Giỏ hàng
│   └── useAISuggestions.ts # Gợi ý AI
├── services/               # Dịch vụ API
├── types/                  # Định nghĩa TypeScript
├── constants/              # Hằng số ứng dụng
└── utils/                  # Hàm tiện ích
```


## 🛒 Tính năng nổi bật

### 🛍️ Trải nghiệm mua sắm
- **Thêm vào giỏ**: Có điều chỉnh số lượng
- **Yêu thích**: Thông báo tuỳ chỉnh
- **So sánh giá**: Giá gốc và giá khuyến mãi
- **Mã giảm giá**: Giảm theo phần trăm hoặc số tiền

### 🔍 Tìm kiếm & Lọc - **FULL WIDTH LAYOUT**
- **Tìm kiếm đa trường**: Tiêu đề, giảng viên, danh mục, tag
- **1 bộ lọc giá**: <500K, 500K-1M, >1M (theo đề bài)
- **Kết quả realtime**: Phản hồi tức thì
- **Hiển thị filter đang áp dụng**: Có chỉ báo trực quan
- **Full Width**: Thanh tìm kiếm và lọc chiếm toàn bộ chiều ngang

### 🤖 Tính năng AI
- **Gợi ý cá nhân hoá**: Dựa trên hành vi người dùng
- **Khoá học xu hướng**: Các khoá học phổ biến
- **Khoá học tương tự**: Dựa trên yêu thích
- **Fallback**: Xử lý lỗi mượt mà

## 🔧 Chi tiết kỹ thuật

### 📚 Công nghệ sử dụng
- **Framework**: Next.js 14 (App Router)
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Icons**: Lucide React
- **HTTP Client**: Axios

### 🎣 Custom Hooks
```typescript
// Quản lý khoá học
const { courses, loading, toggleFavorite } = useCourses()

// Gợi ý AI
const { suggestions, loading, getSuggestions } = useAISuggestions()

// Giỏ hàng
const { cartItems, addToCart, getCartTotal } = useCart()

### 🔧 Dịch vụ
```typescript
// API khoá học
CourseService.getAllCourses()
CourseService.getAISuggestions(userId, behavior)
CourseService.searchCourses(courses, term)
CourseService.filterCoursesByPrice(courses, filter) // Chỉ 1 bộ lọc giá

## 📊 Hiệu năng

### ⚡ Tối ưu
- **Skeleton Loading**: Trạng thái loading mượt mà
- **Tối ưu ảnh**: Sử dụng Next.js Image
- **Tách code**: Tách component theo nhu cầu
- **Error Boundaries**: Xử lý lỗi mượt mà

### 💾 Quản lý dữ liệu
- **Local Storage**: Lưu giỏ hàng, yêu thích
- **State Management**: Custom hooks với TypeScript
- **API**: Axios với xử lý lỗi
- **Mock Data**: Dữ liệu mẫu đầy đủ

## 🚀 Triển khai

### 🌐 Vercel (Khuyến nghị)
```bash
npm i -g vercel
vercel
vercel --prod

**Phát triển với ❤️ cho thị trường giáo dục Việt Nam**


### 🎯 **Hoàn thành yêu cầu đề bài:**
1. ✅ Hiển thị danh sách sản phẩm
2. ✅ Tìm kiếm và lọc (1 bộ lọc giá)
 
## 🎯 **THAY ĐỔI MỚI NHẤT**
### 🎯 **yêu cầu đề bài:**
1. ✅ Hiển thị danh sách sản phẩm
2. ✅ Tìm kiếm và lọc (1 bộ lọc giá)
3. ✅ Gợi ý thông minh AI
4. ✅ Modal chi tiết sản phẩm
5. ✅ Yêu thích + trang riêng
6. ✅ Chatbot AI (bonus)
̃7. ✅trang giỏ hàng

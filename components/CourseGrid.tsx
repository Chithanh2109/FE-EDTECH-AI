import type { Course } from "@/types/course"
import { CourseCard } from "./CourseCard"

interface CourseGridProps {
  courses: Course[]
  onToggleFavorite: (id: string) => void
  onViewDetail: (course: Course) => void
}

export const CourseGrid = ({ courses, onToggleFavorite, onViewDetail }: CourseGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onToggleFavorite={onToggleFavorite} onViewDetail={onViewDetail} />
      ))}
    </div>
  )
}

import type { ReactNode } from "react"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="col-span-full text-center py-12">
      <div className="h-12 w-12 text-gray-300 mx-auto mb-4">{icon}</div>
      <p className="text-gray-500 font-medium">{title}</p>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    </div>
  )
}

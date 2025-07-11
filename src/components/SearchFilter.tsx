"use client"

import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PRICE_FILTERS } from "@/constants/courses"

interface SearchFilterProps {
  searchTerm: string
  priceFilter: string
  onSearchChange: (value: string) => void
  onPriceFilterChange: (value: string) => void
  onClearFilters: () => void
  resultCount: number
}

export const SearchFilter = ({
  searchTerm,
  priceFilter,
  onSearchChange,
  onPriceFilterChange,
  onClearFilters,
  resultCount,
}: SearchFilterProps) => {
  const hasActiveFilters = searchTerm.trim() !== "" || priceFilter !== "all"

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Tìm kiếm & Lọc</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-800 bg-transparent"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên khóa học, giảng viên, danh mục..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-orange-500 rounded-lg"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Price Filter - Chỉ 1 bộ lọc duy nhất */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Khoảng giá:</span>
          <Select value={priceFilter} onValueChange={onPriceFilterChange}>
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-orange-500">
              <SelectValue placeholder="Chọn khoảng giá" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters & Results */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-orange-600">{resultCount}</span> khóa học
          </span>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 ml-4">
              {searchTerm && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Tìm kiếm: "{searchTerm}"
                  <X className="h-3 w-3 ml-1 cursor-pointer hover:text-orange-900" onClick={() => onSearchChange("")} />
                </Badge>
              )}
              {priceFilter !== "all" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Giá: {PRICE_FILTERS.find((f) => f.value === priceFilter)?.label}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-900"
                    onClick={() => onPriceFilterChange("all")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Quick Price Filters */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-gray-500">Nhanh:</span>
          {PRICE_FILTERS.slice(1).map((filter) => (
            <Button
              key={filter.value}
              variant={priceFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => onPriceFilterChange(filter.value)}
              className={`text-xs h-7 ${
                priceFilter === filter.value
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "hover:bg-orange-50 hover:border-orange-200"
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

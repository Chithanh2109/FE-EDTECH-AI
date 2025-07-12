export const formatPrice = (price: number): string => {
  return price.toLocaleString("vi-VN") + " VNĐ"
}

export const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

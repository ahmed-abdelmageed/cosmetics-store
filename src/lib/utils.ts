export function formatPrice(value: number) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getFinalPrice(price: number, discountPercent: number, discountActive: boolean) {
  if (!discountActive || discountPercent <= 0) return price;
  return Math.round(price - (price * discountPercent) / 100);
}

export function slugify(text: string) {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-");
}

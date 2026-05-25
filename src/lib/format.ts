export function formatTry(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(oldPrice: number, price: number): number {
  if (oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

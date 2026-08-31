export function formatIDR(value: number) {
  if (value === 0) return "Complimentary";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

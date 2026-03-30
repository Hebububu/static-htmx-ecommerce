export function formatPrice(price: number): string {
	return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDiscount(original: number, current: number): number {
	return Math.round(((original - current) / original) * 100);
}

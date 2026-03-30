export interface CartItem {
	id: string;
	productId: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
	options?: Record<string, string>;
	inStock: boolean;
}

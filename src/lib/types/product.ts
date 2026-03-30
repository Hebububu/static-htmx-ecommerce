export interface Product {
	id: string;
	name: string;
	price: number;
	originalPrice?: number;
	image: string;
	category: string;
	rating: number;
	reviewCount: number;
	description?: string;
	options?: ProductOption[];
	inStock: boolean;
}

export interface ProductOption {
	name: string;
	values: string[];
}

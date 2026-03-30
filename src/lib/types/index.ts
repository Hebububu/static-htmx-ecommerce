export type { Product, ProductOption } from './product';
export type { CartItem } from './cart';

export interface Category {
	id: string;
	name: string;
	slug: string;
	children?: Category[];
}

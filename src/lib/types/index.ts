export type { Product, ProductOption } from './product';
export type { CartItem } from './cart';

export interface Category {
	id: string;
	name: string;
	slug: string;
	children?: Category[];
}

export interface BoardPost {
	id: string;
	title: string;
	date: string;
	category: 'notice' | 'faq' | 'event';
	content?: string;
}

export interface Order {
	id: string;
	date: string;
	status: 'paid' | 'shipping' | 'delivered' | 'cancelled';
	items: OrderItem[];
	total: number;
}

export interface OrderItem {
	name: string;
	price: number;
	quantity: number;
	image: string;
}

export interface EventItem {
	id: string;
	title: string;
	image: string;
	startDate: string;
	endDate: string;
	description?: string;
}

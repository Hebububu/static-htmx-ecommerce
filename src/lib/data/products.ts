import type { Product } from '$lib/types';

export const products: Product[] = [
	{
		id: 'iphone-15-pro',
		name: 'iPhone 15 Pro',
		price: 1099,
		originalPrice: 1199,
		image: '/products/iphone13.webp',
		category: 'phones',
		rating: 4.8,
		reviewCount: 2847,
		description: 'Powered by the A17 Pro chip. Titanium design, 48MP camera system, USB-C support.',
		options: [
			{
				name: 'Color',
				values: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
			},
			{ name: 'Storage', values: ['128GB', '256GB', '512GB', '1TB'] }
		],
		inStock: true
	},
	{
		id: 'galaxy-s24-ultra',
		name: 'Galaxy S24 Ultra',
		price: 1299,
		originalPrice: 1399,
		image: '/products/iphone13.webp',
		category: 'phones',
		rating: 4.7,
		reviewCount: 1923,
		description: 'Galaxy AI powered. Built-in S Pen, 200MP camera.',
		options: [
			{
				name: 'Color',
				values: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow']
			},
			{ name: 'Storage', values: ['256GB', '512GB', '1TB'] }
		],
		inStock: true
	},
	{
		id: 'airpods-pro-2',
		name: 'AirPods Pro 2',
		price: 249,
		image: '/products/iphone13.webp',
		category: 'accessories',
		rating: 4.9,
		reviewCount: 5621,
		description: 'H2 chip with Active Noise Cancellation. Adaptive Audio, USB-C charging case.',
		options: [],
		inStock: true
	},
	{
		id: 'galaxy-buds3-pro',
		name: 'Galaxy Buds3 Pro',
		price: 229,
		originalPrice: 259,
		image: '/products/iphone13.webp',
		category: 'accessories',
		rating: 4.5,
		reviewCount: 892,
		description: 'Galaxy AI interpreter support. Blade Lights design, 2-way speaker.',
		options: [{ name: 'Color', values: ['White', 'Silver'] }],
		inStock: true
	},
	{
		id: 'magsafe-case',
		name: 'MagSafe Silicone Case',
		price: 49,
		image: '/products/iphone13.webp',
		category: 'accessories',
		rating: 4.3,
		reviewCount: 3201,
		description: 'MagSafe silicone case for iPhone 15 Pro. Soft microtwill lining.',
		options: [
			{ name: 'Color', values: ['Storm Blue', 'Cypress', 'Winter Blue', 'Clay', 'Orange Sorbet'] }
		],
		inStock: true
	},
	{
		id: 'screen-protector',
		name: 'Tempered Glass Screen Protector',
		price: 12,
		image: '/products/iphone13.webp',
		category: 'accessories',
		rating: 4.1,
		reviewCount: 7845,
		description: '9H hardness tempered glass. Anti-fingerprint coating, easy install kit included.',
		options: [{ name: 'Model', values: ['iPhone 15 Pro', 'Galaxy S24 Ultra', 'iPhone 15'] }],
		inStock: false
	}
];

export function getProduct(id: string): Product | undefined {
	return products.find((p) => p.id === id);
}


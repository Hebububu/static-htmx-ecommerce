import type { Category } from '$lib/types';

export const categories: Category[] = [
	{
		id: 'phones',
		name: 'Phones',
		slug: 'phones',
		children: [
			{ id: 'phones-apple', name: 'Apple', slug: 'apple' },
			{ id: 'phones-samsung', name: 'Samsung', slug: 'samsung' },
			{ id: 'phones-google', name: 'Google', slug: 'google' }
		]
	},
	{
		id: 'tablets',
		name: 'Tablets',
		slug: 'tablets',
		children: [
			{ id: 'tablets-ipad', name: 'iPad', slug: 'ipad' },
			{ id: 'tablets-galaxy-tab', name: 'Galaxy Tab', slug: 'galaxy-tab' }
		]
	},
	{
		id: 'accessories',
		name: 'Accessories',
		slug: 'accessories',
		children: [
			{ id: 'acc-cases', name: 'Cases', slug: 'cases' },
			{ id: 'acc-audio', name: 'Audio', slug: 'audio' },
			{ id: 'acc-chargers', name: 'Chargers', slug: 'chargers' }
		]
	},
	{
		id: 'wearables',
		name: 'Wearables',
		slug: 'wearables',
		children: [
			{ id: 'wear-watch', name: 'Smartwatches', slug: 'smartwatch' },
			{ id: 'wear-band', name: 'Smart Bands', slug: 'smartband' }
		]
	}
];

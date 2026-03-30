import { products, getProduct } from '$lib/data/products';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const product = getProduct(params.id);
	if (!product) error(404, 'Product not found');
	return { product };
};

export function entries() {
	return products.map((p) => ({ id: p.id }));
}

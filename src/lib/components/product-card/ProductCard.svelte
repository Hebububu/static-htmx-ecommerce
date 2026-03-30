<script lang="ts">
	import { base } from '$app/paths';
	import type { Product } from '$lib/types';
	import { formatPrice, formatDiscount } from '$lib/utils/format';

	let { product }: { product: Product } = $props();
</script>

<a
	href="{base}/products/{product.id}/"
	class="group bg-white rounded-(--radius-base) overflow-hidden shadow-(--shadow-sm) hover:shadow-(--shadow-base) transition-shadow"
>
	<div class="aspect-square bg-neutral-50 overflow-hidden">
		<img
			src="{base}{product.image}"
			alt={product.name}
			class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
			loading="lazy"
		/>
	</div>
	<div class="p-3 md:p-4">
		<h3 class="text-sm font-medium line-clamp-2 mb-1 group-hover:text-(--color-accent) transition-colors">
			{product.name}
		</h3>
		<div class="flex items-center gap-1 mb-2">
			<span class="text-xs text-amber-500">{'★'.repeat(Math.round(product.rating))}</span>
			<span class="text-xs text-(--color-text-muted)">({product.reviewCount.toLocaleString()})</span>
		</div>
		<div class="flex items-baseline gap-2">
			{#if product.originalPrice}
				<span class="text-xs text-(--color-error) font-bold">
					{formatDiscount(product.originalPrice, product.price)}%
				</span>
			{/if}
			<span class="font-bold text-sm">{formatPrice(product.price)}</span>
			{#if product.originalPrice}
				<span class="text-xs text-(--color-text-muted) line-through">
					{formatPrice(product.originalPrice)}
				</span>
			{/if}
		</div>
		{#if !product.inStock}
			<span class="inline-block mt-2 text-xs text-(--color-error) font-medium">품절</span>
		{/if}
	</div>
</a>

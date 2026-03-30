<script lang="ts">
	import { base } from '$app/paths';
	import { cart } from '$lib/stores/cart.svelte';
	import { formatPrice, formatDiscount } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const product = data.product;

	let selectedOptions = $state<Record<string, string>>({});
	let quantity = $state(1);
	let addedToCart = $state(false);

	const allOptionsSelected = $derived(
		!product.options?.length || product.options.every((opt) => selectedOptions[opt.name])
	);

	function selectOption(name: string, value: string) {
		selectedOptions = { ...selectedOptions, [name]: value };
	}

	function addToCart() {
		if (!allOptionsSelected || !product.inStock) return;
		cart.addItem(
			{
				id: `${product.id}-${Object.values(selectedOptions).join('-')}`,
				productId: product.id,
				name: product.name,
				price: product.price,
				image: product.image,
				options: { ...selectedOptions },
				inStock: product.inStock
			},
			quantity
		);
		addedToCart = true;
		setTimeout(() => (addedToCart = false), 2000);
	}

	function incrementQty() {
		if (quantity < 99) quantity++;
	}

	function decrementQty() {
		if (quantity > 1) quantity--;
	}
</script>

<svelte:head>
	<title>{product.name} — E-Commerce</title>
	<meta property="og:title" content={product.name} />
	<meta property="og:description" content={product.description || ''} />
</svelte:head>

<nav class="max-w-(--container-max) mx-auto px-4 md:px-6 py-3" aria-label="Breadcrumb">
	<ol class="flex items-center gap-2 text-xs text-(--color-text-muted)">
		<li><a href="{base}/" class="hover:text-(--color-accent)">Home</a></li>
		<li>/</li>
		<li><a href="{base}/products/" class="hover:text-(--color-accent)">Products</a></li>
		<li>/</li>
		<li class="text-(--color-text)" aria-current="page">{product.name}</li>
	</ol>
</nav>

<div class="max-w-(--container-max) mx-auto px-4 md:px-6 pb-16">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
		<div class="aspect-square bg-white rounded-(--radius-lg) overflow-hidden shadow-(--shadow-sm)">
			<img
				src="{base}{product.image}"
				alt={product.name}
				class="w-full h-full object-contain p-8"
			/>
		</div>

		<div class="flex flex-col">
			<h1 class="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

			<div class="flex items-center gap-2 mb-4">
				<span class="text-amber-500">{'★'.repeat(Math.round(product.rating))}</span>
				<span class="text-sm text-(--color-text-muted)">
					{product.rating} ({product.reviewCount.toLocaleString()} reviews)
				</span>
			</div>

			<div class="flex items-baseline gap-3 mb-6">
				{#if product.originalPrice}
					<span class="text-lg text-(--color-error) font-bold"
						>{formatDiscount(product.originalPrice, product.price)}%</span
					>
				{/if}
				<span class="text-2xl font-bold">{formatPrice(product.price)}</span>
				{#if product.originalPrice}
					<span class="text-sm text-(--color-text-muted) line-through"
						>{formatPrice(product.originalPrice)}</span
					>
				{/if}
			</div>

			{#if product.description}
				<p class="text-sm text-(--color-secondary) leading-relaxed mb-6">{product.description}</p>
			{/if}

			{#if product.options?.length}
				<div class="space-y-4 mb-6">
					{#each product.options as option (option.name)}
						<div>
							<label class="block text-sm font-medium mb-2">{option.name}</label>
							<div class="flex flex-wrap gap-2">
								{#each option.values as value (value)}
									<button
										class="px-4 py-2 text-sm border rounded-(--radius-sm) transition-colors
											{selectedOptions[option.name] === value
											? 'border-(--color-accent) text-(--color-accent) bg-blue-50'
											: 'border-(--color-border) hover:border-(--color-secondary)'}"
										onclick={() => selectOption(option.name, value)}
									>
										{value}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<div class="flex items-center gap-3 mb-6">
				<span class="text-sm font-medium">Qty</span>
				<div class="flex items-center border border-(--color-border) rounded-(--radius-sm)">
					<button
						class="w-9 h-9 flex items-center justify-center text-lg hover:bg-neutral-50 disabled:opacity-30"
						onclick={decrementQty}
						disabled={quantity <= 1}
						aria-label="Decrease quantity">−</button
					>
					<span class="w-10 text-center text-sm font-medium">{quantity}</span>
					<button
						class="w-9 h-9 flex items-center justify-center text-lg hover:bg-neutral-50 disabled:opacity-30"
						onclick={incrementQty}
						disabled={quantity >= 99}
						aria-label="Increase quantity">+</button
					>
				</div>
			</div>

			<div class="flex gap-3 mt-auto">
				<button
					class="flex-1 py-3 text-sm font-bold text-white bg-(--color-primary) rounded-(--radius-base) hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					onclick={addToCart}
					disabled={!allOptionsSelected || !product.inStock}
				>
					{#if !product.inStock}
						Out of Stock
					{:else if !allOptionsSelected}
						Select Options
					{:else if addedToCart}
						Added to Cart ✓
					{:else}
						Add to Cart
					{/if}
				</button>
				<a
					href="{base}/cart/"
					class="px-6 py-3 text-sm font-medium border border-(--color-border) rounded-(--radius-base) hover:bg-neutral-50 transition-colors"
				>
					Cart
				</a>
			</div>
		</div>
	</div>
</div>

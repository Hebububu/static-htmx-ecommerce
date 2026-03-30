<script lang="ts">
	import { base } from '$app/paths';
	import { products } from '$lib/data/products';
	import { categories } from '$lib/data/categories';
	import ProductCard from '$lib/components/product/Card.svelte';
</script>

<svelte:head>
	<title>E-Commerce — SvelteKit Boilerplate</title>
	<meta property="og:title" content="E-Commerce — SvelteKit Boilerplate" />
</svelte:head>

<!-- Hero Banner -->
<section class="relative overflow-hidden bg-neutral-900 text-white">
	<div class="max-w-(--container-max) mx-auto px-4 md:px-6 py-16 md:py-24">
		<div class="max-w-lg">
			<p class="text-sm font-medium text-(--color-accent) mb-2">New member 10% off</p>
			<h1 class="text-3xl md:text-4xl font-bold leading-tight mb-4">
				Latest Smartphones &<br />Accessories on Sale
			</h1>
			<p class="text-neutral-300 mb-6">Discover premium devices at special prices.</p>
			<a
				href="{base}/products/"
				class="inline-flex items-center gap-2 px-6 py-3 bg-(--color-accent) text-white font-medium rounded-(--radius-base) hover:opacity-90 transition-opacity"
			>
				Shop Now
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
				>
			</a>
		</div>
	</div>
</section>

<!-- Category Grid -->
<section class="max-w-(--container-max) mx-auto px-4 md:px-6 py-10">
	<h2 class="text-xl font-bold mb-6">Categories</h2>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		{#each categories as cat}
			<a
				href="{base}/products/?category={cat.slug}"
				class="flex flex-col items-center gap-3 p-6 bg-white rounded-(--radius-base) shadow-(--shadow-sm) hover:shadow-(--shadow-base) transition-shadow"
			>
				<div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-lg">
					{#if cat.slug === 'phones'}📱{:else if cat.slug === 'tablets'}📋{:else if cat.slug === 'accessories'}🎧{:else}⌚{/if}
				</div>
				<span class="text-sm font-medium">{cat.name}</span>
			</a>
		{/each}
	</div>
</section>

<!-- Featured Products -->
<section class="max-w-(--container-max) mx-auto px-4 md:px-6 py-10">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-bold">Featured Products</h2>
		<a href="{base}/products/" class="text-sm text-(--color-accent) hover:underline">View All</a>
	</div>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		{#each products.slice(0, 4) as product}
			<ProductCard {product} />
		{/each}
	</div>
</section>

<!-- Notice & Service -->
<section class="max-w-(--container-max) mx-auto px-4 md:px-6 py-10">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="bg-white rounded-(--radius-base) p-6 shadow-(--shadow-sm)">
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-bold">Announcements</h3>
				<a
					href="{base}/board/notices/"
					class="text-xs text-(--color-text-muted) hover:text-(--color-accent)">More</a
				>
			</div>
			<ul class="space-y-3 text-sm">
				<li class="flex justify-between">
					<span>[Notice] Shipping delay update</span>
					<span class="text-(--color-text-muted) shrink-0 ml-4">2026.03.28</span>
				</li>
				<li class="flex justify-between">
					<span>[Event] Spring special sale</span>
					<span class="text-(--color-text-muted) shrink-0 ml-4">2026.03.25</span>
				</li>
				<li class="flex justify-between">
					<span>[Notice] Privacy policy update</span>
					<span class="text-(--color-text-muted) shrink-0 ml-4">2026.03.20</span>
				</li>
			</ul>
		</div>
		<div class="bg-white rounded-(--radius-base) p-6 shadow-(--shadow-sm)">
			<h3 class="font-bold mb-4">Customer Service</h3>
			<p class="text-2xl font-bold text-(--color-accent) mb-2">1-800-000-0000</p>
			<p class="text-sm text-(--color-text-muted)">
				Mon-Fri 9:00 AM - 6:00 PM<br />
				Lunch 12:00 - 1:00 PM (Weekends & holidays off)
			</p>
		</div>
	</div>
</section>

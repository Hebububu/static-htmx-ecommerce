<script lang="ts">
	import { base } from '$app/paths';
	import type { CartItem } from '$lib/types';
	import { cart } from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils/format';

	let { item }: { item: CartItem } = $props();

	function increment() {
		if (item.quantity < 99) cart.updateQuantity(item.id, item.quantity + 1);
	}

	function decrement() {
		if (item.quantity > 1) cart.updateQuantity(item.id, item.quantity - 1);
	}

	function remove() {
		cart.removeItem(item.id);
	}
</script>

<div class="flex gap-4 py-4 border-b border-(--color-border) last:border-b-0">
	<div class="w-20 h-20 shrink-0 bg-neutral-50 rounded-(--radius-sm) overflow-hidden">
		<img src="{base}{item.image}" alt={item.name} class="w-full h-full object-contain p-2" />
	</div>

	<div class="flex-1 min-w-0">
		<h3 class="text-sm font-medium truncate">{item.name}</h3>
		{#if item.options}
			<p class="text-xs text-(--color-text-muted) mt-0.5">
				{Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' / ')}
			</p>
		{/if}

		<div class="flex items-center justify-between mt-3">
			<div class="flex items-center border border-(--color-border) rounded-(--radius-sm)">
				<button class="w-7 h-7 flex items-center justify-center text-sm hover:bg-neutral-50 disabled:opacity-30" onclick={decrement} disabled={item.quantity <= 1} aria-label="Decrease quantity">−</button>
				<span class="w-8 text-center text-xs font-medium">{item.quantity}</span>
				<button class="w-7 h-7 flex items-center justify-center text-sm hover:bg-neutral-50 disabled:opacity-30" onclick={increment} disabled={item.quantity >= 99} aria-label="Increase quantity">+</button>
			</div>

			<div class="flex items-center gap-3">
				<span class="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
				<button class="text-xs text-(--color-text-muted) hover:text-(--color-error) transition-colors" onclick={remove} aria-label="Remove {item.name}">
					Remove
				</button>
			</div>
		</div>
	</div>
</div>

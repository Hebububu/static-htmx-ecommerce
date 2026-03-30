<script lang="ts">
	import { base } from '$app/paths';
	import { cart } from '$lib/stores/cart.svelte';
	import { formatPrice } from '$lib/utils/format';
	import CartLineItem from '$lib/components/cart-line-item/CartLineItem.svelte';
</script>

<svelte:head>
	<title>Cart — E-Commerce</title>
</svelte:head>

<div class="max-w-(--container-max) mx-auto px-4 md:px-6 py-8">
	<h1 class="text-2xl font-bold mb-6">Shopping Cart</h1>

	{#if !cart.mounted}
		<div class="animate-pulse space-y-4">
			<div class="h-24 bg-neutral-200 rounded-(--radius-base)"></div>
			<div class="h-24 bg-neutral-200 rounded-(--radius-base)"></div>
		</div>
	{:else if cart.isEmpty}
		<div class="text-center py-20">
			<div class="text-5xl mb-4">🛒</div>
			<h2 class="text-lg font-medium mb-2">Your cart is empty</h2>
			<p class="text-sm text-(--color-text-muted) mb-6">Add some products you love.</p>
			<a
				href="{base}/products/"
				class="inline-flex px-6 py-3 text-sm font-medium text-white bg-(--color-primary) rounded-(--radius-base) hover:opacity-90 transition-opacity"
			>
				Continue Shopping
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				<div class="bg-white rounded-(--radius-base) shadow-(--shadow-sm) p-4 md:p-6">
					<div class="flex items-center justify-between pb-3 border-b border-(--color-border) mb-2">
						<span class="text-sm text-(--color-text-muted)"
							>{cart.items.length} item{cart.items.length > 1 ? 's' : ''}</span
						>
						<button
							class="text-xs text-(--color-text-muted) hover:text-(--color-error) transition-colors"
							onclick={() => cart.clear()}
						>
							Clear All
						</button>
					</div>
					{#each cart.items as item (item.id)}
						<CartLineItem {item} />
					{/each}
				</div>
			</div>

			<div>
				<div class="bg-white rounded-(--radius-base) shadow-(--shadow-sm) p-6 sticky top-20">
					<h2 class="font-bold mb-4">Order Summary</h2>
					<dl class="space-y-3 text-sm">
						<div class="flex justify-between">
							<dt class="text-(--color-text-muted)">Subtotal</dt>
							<dd class="font-medium">{formatPrice(cart.subtotal)}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-(--color-text-muted)">Shipping</dt>
							<dd class="font-medium">
								{#if cart.shipping === 0}
									<span class="text-(--color-success)">Free</span>
								{:else}
									{formatPrice(cart.shipping)}
								{/if}
							</dd>
						</div>
						<div class="flex justify-between pt-3 border-t border-(--color-border)">
							<dt class="font-bold">Total</dt>
							<dd class="text-lg font-bold text-(--color-accent)">{formatPrice(cart.total)}</dd>
						</div>
					</dl>
					<a
						href="{base}/checkout/"
						class="block w-full mt-6 py-3 text-center text-sm font-bold text-white bg-(--color-primary) rounded-(--radius-base) hover:opacity-90 transition-opacity"
					>
						Checkout
					</a>
					<a
						href="{base}/products/"
						class="block w-full mt-2 py-3 text-center text-sm font-medium text-(--color-text-muted) hover:text-(--color-text) transition-colors"
					>
						Continue Shopping
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>

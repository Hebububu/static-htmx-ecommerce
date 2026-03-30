<script lang="ts">
	import { resolve, asset } from '$app/paths';
	import type { Product } from '$lib/types';
	import { formatPrice, formatDiscount } from '$lib/utils/format';

	let { product }: { product: Product } = $props();
</script>

<article class="product-card">
	<a
		class="product-card__media"
		href={resolve(`/products/${product.id}/`)}
		aria-label="View {product.name} details"
	>
		<img class="product-card__image" src={asset(product.image)} alt={product.name} loading="lazy" />
	</a>

	<div class="product-card__body">
		<div class="product-card__meta">
			<h3 class="product-card__title">{product.name}</h3>
			<p
				class="product-card__rating"
				aria-label="Rated {product.rating} out of 5 from {product.reviewCount} reviews"
			>
				<span class="product-card__stars" aria-hidden="true"
					>{'★'.repeat(Math.round(product.rating))}</span
				>
				<span>({product.reviewCount.toLocaleString()})</span>
			</p>
		</div>

		{#if product.description}
			<p class="product-card__description">{product.description}</p>
		{/if}

		<div class="product-card__footer">
			{#if product.originalPrice}
				<div class="product-card__pricing">
					<span class="product-card__original-price">{formatPrice(product.originalPrice)}</span>
					<span class="product-card__discount"
						>{formatDiscount(product.originalPrice, product.price)}%</span
					>
					<strong class="product-card__price">{formatPrice(product.price)}</strong>
				</div>
			{:else}
				<strong class="product-card__price">{formatPrice(product.price)}</strong>
			{/if}
			<button class="product-card__wish" type="button" aria-label="Add {product.name} to wishlist">
				<i class="ph ph-heart" aria-hidden="true"></i>
			</button>
		</div>

		{#if !product.inStock}
			<span class="product-card__out-of-stock">Out of Stock</span>
		{/if}
	</div>
</article>

<style>
	.product-card {
		display: grid;
		gap: var(--spacing-5);
		padding: var(--spacing-4);
		border: 1px solid rgba(58, 52, 46, 0.08);
		border-radius: 28px;
		background: linear-gradient(180deg, #fffdfa 0%, #ffffff 100%);
		box-shadow: 0 20px 45px rgba(84, 69, 55, 0.08);
		transition: transform var(--transition-base);
	}
	.product-card:hover {
		transform: translateY(-4px);
	}

	.product-card__media {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1 / 1;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		border-radius: 24px;
		background: #f4f2ee;
		overflow: hidden;
	}
	.product-card__image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 16px 32px rgba(67, 57, 46, 0.12));
	}

	.product-card__body {
		display: grid;
		gap: var(--spacing-3);
	}
	.product-card__meta {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--spacing-4);
	}
	.product-card__title {
		font-size: clamp(1.25rem, 2vw, 1.75rem);
		font-weight: 700;
		line-height: 1.25;
		color: #171411;
	}
	.product-card__rating {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding-top: 0.2rem;
		font-size: var(--font-size-sm);
		color: #65603d;
		white-space: nowrap;
	}
	.product-card__stars {
		letter-spacing: 0.1em;
		color: #d4a017;
	}
	.product-card__description {
		max-width: 28ch;
		font-size: 1.02rem;
		color: #5f594d;
	}

	.product-card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-4);
		padding-top: var(--spacing-3);
	}
	.product-card__price {
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 700;
		line-height: 1;
		color: #171411;
	}
	.product-card__pricing {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.product-card__pricing .product-card__price {
		font-size: clamp(1.25rem, 2.5vw, 1.5rem);
	}
	.product-card__original-price {
		font-size: var(--font-size-xs);
		color: #999;
		text-decoration: line-through;
		line-height: 1;
	}
	.product-card__discount {
		font-size: var(--font-size-sm);
		font-weight: 700;
		color: #c0392b;
		line-height: 1;
	}

	.product-card__wish {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		border: 1px solid rgba(45, 39, 33, 0.14);
		border-radius: 18px;
		background-color: rgba(255, 255, 255, 0.86);
		color: #312a23;
		box-shadow: 0 10px 24px rgba(58, 52, 46, 0.08);
		transition:
			transform var(--transition-fast),
			color var(--transition-fast);
	}
	.product-card__wish:hover {
		transform: translateY(-2px);
		color: #a04545;
	}
	.product-card__wish :global(i) {
		font-size: 1.4rem;
	}

	.product-card__out-of-stock {
		font-size: var(--font-size-xs);
		font-weight: 500;
		color: #c0392b;
	}

	@media (max-width: 640px) {
		.product-card {
			padding: var(--spacing-3);
			border-radius: 24px;
		}
		.product-card__meta {
			flex-direction: column;
			gap: var(--spacing-2);
		}
		.product-card__description {
			max-width: none;
		}
	}
</style>

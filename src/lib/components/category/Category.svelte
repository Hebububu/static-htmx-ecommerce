<script lang="ts">
	import { resolve } from '$app/paths';

	interface CategoryItem {
		slug: string;
		label: string;
		icon: string;
	}

	const defaultItems: CategoryItem[] = [
		{ slug: 'clothing', label: 'Clothing', icon: 'ph ph-t-shirt' },
		{ slug: 'shoes', label: 'Shoes', icon: 'ph ph-sneaker' },
		{ slug: 'watches', label: 'Watches', icon: 'ph ph-watch' },
		{ slug: 'phones', label: 'Phones', icon: 'ph ph-device-mobile' },
		{ slug: 'laptops', label: 'Laptops', icon: 'ph ph-laptop' },
		{ slug: 'audio', label: 'Audio', icon: 'ph ph-headphones' },
		{ slug: 'cameras', label: 'Cameras', icon: 'ph ph-camera' },
		{ slug: 'gaming', label: 'Gaming', icon: 'ph ph-game-controller' }
	];

	let { items = defaultItems }: { items?: CategoryItem[] } = $props();
</script>

<div class="category">
	<h2 class="category__heading">Shop by Category</h2>

	<div class="category__list">
		{#each items as item (item.slug)}
			<a class="category__item" href="{resolve('/products/')}?category={item.slug}">
				<div class="category__icon">
					<i class={item.icon} aria-hidden="true"></i>
				</div>
				<span class="category__label">{item.label}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.category__heading {
		text-align: center;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: #171411;
		margin-bottom: var(--spacing-8);
	}

	.category__list {
		display: flex;
		justify-content: center;
		gap: clamp(1.5rem, 4vw, 3rem);
	}

	.category__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-3);
		cursor: pointer;
	}

	.category__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		font-size: 1.75rem;
		color: #3a342e;
		transition: transform 0.2s;
	}

	.category__item:hover .category__icon {
		transform: translateY(-2px);
	}

	.category__label {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #5f594d;
		white-space: nowrap;
	}

	.category__item:hover .category__label {
		color: #171411;
	}

	@media (max-width: 959px) {
		.category__list {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: var(--spacing-4);
		}
		.category__icon {
			width: 64px;
			height: 64px;
			font-size: 1.5rem;
		}
	}

	@media (max-width: 639px) {
		.category__list {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: var(--spacing-4) var(--spacing-2);
		}
		.category__icon {
			width: 52px;
			height: 52px;
			font-size: 1.25rem;
		}
		.category__label {
			font-size: var(--font-size-xs);
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { EmblaCarouselType } from 'embla-carousel';
	import type { Product } from '$lib/types';
	import Card from './Card.svelte';

	let { heading = 'New Arrivals', products = [] as Product[] } = $props();

	let viewportEl: HTMLElement;
	let emblaApi: EmblaCarouselType | null = null;

	onMount(() => {
		let api: EmblaCarouselType;

		(async () => {
			const [{ default: EmblaCarousel }, { default: Autoplay }] = await Promise.all([
				import('embla-carousel'),
				import('embla-carousel-autoplay')
			]);

			api = EmblaCarousel(viewportEl, { loop: true, align: 'start' }, [Autoplay({ delay: 4500 })]);
			emblaApi = api;
		})();

		return () => api?.destroy();
	});

	function scrollPrev(): void {
		emblaApi?.scrollPrev();
	}

	function scrollNext(): void {
		emblaApi?.scrollNext();
	}
</script>

<div class="product-carousel">
	<div class="product-carousel__header">
		<h2 class="product-carousel__heading">{heading}</h2>
		<div class="product-carousel__nav">
			<button
				class="product-carousel__prev"
				type="button"
				aria-label="Previous product"
				onclick={scrollPrev}
			>
				<i class="ph ph-caret-left" aria-hidden="true"></i>
			</button>
			<button
				class="product-carousel__next"
				type="button"
				aria-label="Next product"
				onclick={scrollNext}
			>
				<i class="ph ph-caret-right" aria-hidden="true"></i>
			</button>
		</div>
	</div>

	<div class="product-carousel__viewport" bind:this={viewportEl}>
		<div class="product-carousel__container">
			{#each products as product (product.id)}
				<div class="product-carousel__slide">
					<Card {product} />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.product-carousel__viewport {
		overflow: hidden;
	}

	.product-carousel__container {
		display: flex;
		touch-action: pan-y pinch-zoom;
		gap: var(--spacing-3, 0.75rem);
	}

	.product-carousel__slide {
		flex: 0 0 calc((100% - var(--spacing-3, 0.75rem) * 3) / 4);
		min-width: 0;
		display: flex;
	}

	@media (max-width: 959px) {
		.product-carousel__slide {
			flex: 0 0 calc((100% - var(--spacing-3, 0.75rem)) / 2);
		}
	}

	.product-carousel__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-6, 1.5rem);
	}

	.product-carousel__heading {
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: #171411;
	}

	.product-carousel__nav {
		display: flex;
		gap: var(--spacing-2, 0.5rem);
	}

	.product-carousel__prev,
	.product-carousel__next {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 50%;
		background: none;
		color: #171411;
		font-size: 1.25rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.product-carousel__prev:hover,
	.product-carousel__next:hover {
		opacity: 0.7;
	}

	/* Card overrides — compact sizing, inset shadow to avoid Embla overflow clipping */
	.product-carousel__slide :global(.product-card) {
		height: 100%;
		padding: var(--spacing-3);
		gap: var(--spacing-3);
		border-radius: 16px;
		background: #fff;
		border-color: transparent;
		box-shadow: inset 0 2px 8px rgba(84, 69, 55, 0.08);
	}

	.product-carousel__slide :global(.product-card__body) {
		grid-template-rows: 1fr auto;
	}

	.product-carousel__slide :global(.product-card:hover) {
		transform: none;
		box-shadow: inset 0 4px 16px rgba(84, 69, 55, 0.12);
	}

	.product-carousel__slide :global(.product-card__media) {
		border-radius: 12px;
	}

	.product-carousel__slide :global(.product-card__title) {
		font-size: var(--font-size-base);
	}

	.product-carousel__slide :global(.product-card__price) {
		font-size: var(--font-size-xl);
	}

	.product-carousel__slide :global(.product-card__wish) {
		width: 40px;
		height: 40px;
		border-radius: 12px;
	}

	.product-carousel__slide :global(.product-card__wish i) {
		font-size: 1.2rem;
	}
</style>

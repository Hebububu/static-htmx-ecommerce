<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';
	import type { EmblaCarouselType } from 'embla-carousel';

	interface Slide {
		image: string;
		alt: string;
	}

	let {
		slides = [
			{ image: '/banner/banner-1.webp', alt: 'Banner slide 1' },
			{ image: '/banner/banner-2.webp', alt: 'Banner slide 2' },
			{ image: '/banner/banner-3.webp', alt: 'Banner slide 3' }
		]
	}: { slides?: Slide[] } = $props();

	const PARALLAX_FACTOR = 0.5;

	let viewportEl: HTMLElement;
	let emblaApi: EmblaCarouselType | null = null;
	let selectedIndex = $state(0);
	let scrollSnaps = $state<number[]>([]);

	onMount(() => {
		let api: EmblaCarouselType;

		(async () => {
			const [{ default: EmblaCarousel }, { default: Autoplay }] = await Promise.all([
				import('embla-carousel'),
				import('embla-carousel-autoplay')
			]);

			api = EmblaCarousel(viewportEl, { loop: true }, [Autoplay({ delay: 4500 })]);
			emblaApi = api;

			scrollSnaps = api.scrollSnapList();
			setupParallax(api);

			api.on('select', () => {
				selectedIndex = api.selectedScrollSnap();
			});

			api.on('reInit', () => {
				scrollSnaps = api.scrollSnapList();
				selectedIndex = api.selectedScrollSnap();
			});
		})();

		return () => api?.destroy();
	});

	function setupParallax(api: EmblaCarouselType): void {
		const tweenNodes = api
			.slideNodes()
			.map(
				(slide: HTMLElement) => slide.querySelector('.banner-carousel__parallax') as HTMLElement
			);
		const tweenFactor = PARALLAX_FACTOR * api.scrollSnapList().length;

		function tweenParallax(): void {
			const engine = api.internalEngine();
			const scrollProgress = api.scrollProgress();
			const slidesInView = api.slidesInView();

			api.scrollSnapList().forEach((_scrollSnap: number, snapIndex: number) => {
				let diffToTarget = _scrollSnap - scrollProgress;
				const slidesInSnap = engine.slideRegistry[snapIndex];

				slidesInSnap.forEach((slideIndex: number) => {
					if (!slidesInView.includes(slideIndex)) return;

					if (engine.options.loop) {
						engine.slideLooper.loopPoints.forEach(
							(loopItem: { target: () => number; index: number }) => {
								const target = loopItem.target();
								if (slideIndex === loopItem.index && target !== 0) {
									const sign = Math.sign(target);
									if (sign === -1) diffToTarget = _scrollSnap - (1 + scrollProgress);
									if (sign === 1) diffToTarget = _scrollSnap + (1 - scrollProgress);
								}
							}
						);
					}

					const translate = diffToTarget * (-1 * tweenFactor) * 100;
					tweenNodes[slideIndex].style.transform = `translateX(${translate}%)`;
				});
			});
		}

		tweenParallax();
		api.on('scroll', tweenParallax).on('slideFocus', tweenParallax).on('reInit', tweenParallax);
	}

	function scrollPrev(): void {
		emblaApi?.scrollPrev();
	}

	function scrollNext(): void {
		emblaApi?.scrollNext();
	}

	function scrollTo(index: number): void {
		emblaApi?.scrollTo(index);
	}
</script>

<div class="banner-carousel">
	<div class="banner-carousel__viewport" bind:this={viewportEl}>
		<div class="banner-carousel__container">
			{#each slides as slide, i (slide.image)}
				<div class="banner-carousel__slide banner-carousel__slide--{i + 1}">
					<div class="banner-carousel__parallax">
						<img src={asset(slide.image)} alt={slide.alt} />
					</div>
				</div>
			{/each}
		</div>
	</div>

	<button
		class="banner-carousel__prev"
		type="button"
		aria-label="Previous slide"
		onclick={scrollPrev}
	>
		<i class="ph ph-caret-left" aria-hidden="true"></i>
	</button>
	<button class="banner-carousel__next" type="button" aria-label="Next slide" onclick={scrollNext}>
		<i class="ph ph-caret-right" aria-hidden="true"></i>
	</button>

	<div class="banner-carousel__dots">
		{#each scrollSnaps as _snap, i (i)}
			<button
				class="banner-carousel__dot"
				class:banner-carousel__dot--active={i === selectedIndex}
				type="button"
				aria-label="Go to slide {i + 1}"
				onclick={() => scrollTo(i)}
			></button>
		{/each}
	</div>
</div>

<style>
	.banner-carousel {
		position: relative;
	}

	.banner-carousel__viewport {
		overflow: hidden;
	}

	.banner-carousel__container {
		display: flex;
		touch-action: pan-y pinch-zoom;
	}

	.banner-carousel__slide {
		flex: 0 0 100%;
		min-width: 0;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		max-height: 600px;
		border-radius: 0;
	}

	.banner-carousel__parallax {
		width: 100%;
		height: 100%;
	}
	.banner-carousel__parallax img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Slide fallback gradients */
	.banner-carousel__slide--1 {
		background: linear-gradient(135deg, #0f172d, #3e8cab);
	}
	.banner-carousel__slide--2 {
		background: linear-gradient(135deg, #2c1f22, #d2996a);
	}
	.banner-carousel__slide--3 {
		background: linear-gradient(135deg, #11212f, #84a9b4);
	}

	/* Navigation */
	.banner-carousel__prev,
	.banner-carousel__next {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: none;
		color: rgba(255, 255, 255, 0.85);
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		font-size: 2.5rem;
		padding: 0.5rem;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.2s;
	}
	.banner-carousel__prev {
		left: 1rem;
	}
	.banner-carousel__next {
		right: 1rem;
	}
	.banner-carousel__prev:hover,
	.banner-carousel__next:hover {
		opacity: 1;
	}

	/* Dots */
	.banner-carousel__dots {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
		display: flex;
		gap: 0.5rem;
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.5rem 0.75rem;
		border-radius: 1rem;
	}
	.banner-carousel__dot {
		width: 10px;
		height: 10px;
		border: none;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.4);
		padding: 0;
		cursor: pointer;
	}
	.banner-carousel__dot--active {
		background-color: #fff;
	}
</style>

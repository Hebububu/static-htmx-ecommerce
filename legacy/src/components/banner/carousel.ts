import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

const PARALLAX_FACTOR = 0.5;

function setupTweenParallax(emblaApi: EmblaCarouselType): void {
	let tweenNodes: HTMLElement[] = [];
	let tweenFactor = 0;

	function setNodes(): void {
		tweenNodes = emblaApi
			.slideNodes()
			.map((slide) => slide.querySelector('.banner-carousel__parallax') as HTMLElement);
	}

	function setFactor(): void {
		tweenFactor = PARALLAX_FACTOR * emblaApi.scrollSnapList().length;
	}

	function tweenParallax(): void {
		const engine = emblaApi.internalEngine();
		const scrollProgress = emblaApi.scrollProgress();
		const slidesInView = emblaApi.slidesInView();

		emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
			let diffToTarget = scrollSnap - scrollProgress;
			const slidesInSnap = engine.slideRegistry[snapIndex];

			slidesInSnap.forEach((slideIndex: number) => {
				if (!slidesInView.includes(slideIndex)) return;

				if (engine.options.loop) {
					engine.slideLooper.loopPoints.forEach((loopItem) => {
						const target = loopItem.target();
						if (slideIndex === loopItem.index && target !== 0) {
							const sign = Math.sign(target);
							if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
							if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
						}
					});
				}

				const translate = diffToTarget * (-1 * tweenFactor) * 100;
				tweenNodes[slideIndex].style.transform = `translateX(${translate}%)`;
			});
		});
	}

	setNodes();
	setFactor();
	tweenParallax();

	emblaApi
		.on('reInit', setNodes)
		.on('reInit', setFactor)
		.on('reInit', tweenParallax)
		.on('scroll', tweenParallax)
		.on('slideFocus', tweenParallax);
}

function setupDots(emblaApi: EmblaCarouselType, dotsNode: HTMLElement): void {
	let dotNodes: HTMLButtonElement[] = [];

	function createDots(): void {
		const snaps = emblaApi.scrollSnapList();
		dotsNode.innerHTML = '';
		dotNodes = snaps.map((_, i) => {
			const btn = document.createElement('button');
			btn.className = 'banner-carousel__dot';
			btn.type = 'button';
			btn.ariaLabel = `Go to slide ${i + 1}`;
			btn.addEventListener('click', () => emblaApi.scrollTo(i));
			dotsNode.appendChild(btn);
			return btn;
		});
		updateDots();
	}

	function updateDots(): void {
		const selected = emblaApi.selectedScrollSnap();
		dotNodes.forEach((dot, i) => {
			dot.classList.toggle('banner-carousel__dot--active', i === selected);
		});
	}

	createDots();
	emblaApi.on('select', updateDots);
	emblaApi.on('reInit', () => {
		createDots();
	});
}

function mountCarousel(wrapper: HTMLElement): void {
	const viewport = wrapper.querySelector<HTMLElement>('.banner-carousel__viewport');
	const prevBtn = wrapper.querySelector<HTMLElement>('.banner-carousel__prev');
	const nextBtn = wrapper.querySelector<HTMLElement>('.banner-carousel__next');
	const dotsNode = wrapper.querySelector<HTMLElement>('.banner-carousel__dots');

	if (!viewport || !prevBtn || !nextBtn || !dotsNode) return;

	const emblaApi = EmblaCarousel(viewport, { loop: true }, [
		Autoplay({
			delay: 4500,
			rootNode: () => wrapper
		})
	]);

	setupTweenParallax(emblaApi);
	prevBtn.addEventListener('click', () => emblaApi.scrollPrev());
	nextBtn.addEventListener('click', () => emblaApi.scrollNext());
	setupDots(emblaApi, dotsNode);
	emblaApi.plugins().autoplay?.play();
}

export function initBannerCarousel(root: ParentNode = document): void {
	const elements =
		root instanceof HTMLElement && root.matches('.js-banner-carousel')
			? [root]
			: Array.from(root.querySelectorAll<HTMLElement>('.js-banner-carousel'));

	elements.forEach((el) => {
		if (el.dataset.carouselInit) return;
		el.dataset.carouselInit = 'true';

		setTimeout(() => {
			if (document.contains(el)) mountCarousel(el);
		}, 0);
	});
}

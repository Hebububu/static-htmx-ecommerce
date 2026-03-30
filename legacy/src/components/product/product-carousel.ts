import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

function mountCarousel(wrapper: HTMLElement): void {
	const viewport = wrapper.querySelector<HTMLElement>('.product-carousel__viewport');
	const prevBtn = wrapper.querySelector<HTMLElement>('.product-carousel__prev');
	const nextBtn = wrapper.querySelector<HTMLElement>('.product-carousel__next');

	if (!viewport || !prevBtn || !nextBtn) return;

	const emblaApi = EmblaCarousel(viewport, { loop: true, align: 'start' }, [
		Autoplay({
			delay: 4500,
			rootNode: () => wrapper
		})
	]);

	prevBtn.addEventListener('click', () => emblaApi.scrollPrev());
	nextBtn.addEventListener('click', () => emblaApi.scrollNext());
	emblaApi.plugins().autoplay?.play();
}

export function initProductCarousel(root: ParentNode = document): void {
	const elements =
		root instanceof HTMLElement && root.matches('.js-product-carousel')
			? [root]
			: Array.from(root.querySelectorAll<HTMLElement>('.js-product-carousel'));

	elements.forEach((el) => {
		if (el.dataset.carouselInit) return;
		el.dataset.carouselInit = 'true';

		setTimeout(() => {
			if (document.contains(el)) mountCarousel(el);
		}, 0);
	});
}

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

function mountSwiper(element: HTMLElement): void {
  const container = element.closest('.banner-swiper');
  if (!container) return;

  const pagination = container.querySelector<HTMLElement>('.js-banner-swiper-pagination');
  const nextButton = container.querySelector<HTMLElement>('.js-banner-swiper-next');
  const prevButton = container.querySelector<HTMLElement>('.js-banner-swiper-prev');

  if (!pagination || !nextButton || !prevButton) return;

  new Swiper(element, {
    modules: [Autoplay, Navigation, Pagination],
    initialSlide: 0,
    centeredSlides: true,
    slidesPerView: 1.08,
    loop: true,
    loopAdditionalSlides: 1,
    speed: 800,
    spaceBetween: 20,
    grabCursor: true,
    watchSlidesProgress: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      stopOnLastSlide: false,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
    breakpoints: {
      768: {
        slidesPerView: 1.12,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 1.18,
        spaceBetween: 28,
      },
    },
  });
}

function getBannerElements(root: ParentNode): HTMLElement[] {
  const banners = Array.from(root.querySelectorAll<HTMLElement>('.js-banner-swiper'));

  if (root instanceof HTMLElement && root.matches('.js-banner-swiper')) {
    banners.unshift(root);
  }

  return banners;
}

export function initBannerSwipers(root: ParentNode = document): void {
  getBannerElements(root).forEach((element) => {
    if (element.dataset.initialized === 'true') return;

    // Mark immediately so repeated htmx:load firings for child elements
    // do not schedule multiple mounts for the same Swiper instance.
    element.dataset.initialized = 'true';

    // Always defer to a macrotask (setTimeout 0) so that:
    // 1. The current htmx swap callback stack fully completes.
    // 2. The browser commits a full layout pass with correct dimensions.
    // 3. Swiper measures real widths, not mid-swap partial values.
    // This is the correct fix for "stuck on last slide on first load".
    setTimeout(() => {
      // Element may have been removed from DOM if the page navigated away.
      if (!document.contains(element)) return;
      mountSwiper(element);
    }, 0);
  });
}

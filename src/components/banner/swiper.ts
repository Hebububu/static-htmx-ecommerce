import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function mountSwiper(el: HTMLElement): void {
  new Swiper(el, {
    modules: [Autoplay, Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: el.querySelector<HTMLElement>('.swiper-pagination'),
      clickable: true,
    },
    navigation: {
      nextEl: el.querySelector<HTMLElement>('.swiper-button-next'),
      prevEl: el.querySelector<HTMLElement>('.swiper-button-prev'),
    },
  });
}

export function initBannerSwipers(root: ParentNode = document): void {
  const elements = root instanceof HTMLElement && root.matches('.js-banner-swiper')
    ? [root]
    : Array.from(root.querySelectorAll<HTMLElement>('.js-banner-swiper'));

  elements.forEach((el) => {
    if (el.dataset.swiperInit) return;
    el.dataset.swiperInit = 'true';

    setTimeout(() => {
      if (document.contains(el)) mountSwiper(el);
    }, 0);
  });
}

function bindArrows(header: HTMLElement, scrollContainer: HTMLElement): void {
  const prev = header.querySelector<HTMLElement>('.review__prev');
  const next = header.querySelector<HTMLElement>('.review__next');
  if (!prev || !next) return;

  const getCardWidth = (): number => {
    const card = scrollContainer.querySelector<HTMLElement>('.review__card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(scrollContainer).gap) || 0;
    return card.offsetWidth + gap;
  };

  prev.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
  });
}

export function initReviewCarousel(root: ParentNode = document): void {
  const reviews = root instanceof HTMLElement && root.matches('.review')
    ? [root]
    : Array.from(root.querySelectorAll<HTMLElement>('.review'));

  reviews.forEach((review) => {
    const headers = review.querySelectorAll<HTMLElement>('.review__header');
    const containers = review.querySelectorAll<HTMLElement>('.review__best, .review__grid');

    headers.forEach((header, i) => {
      const container = containers[i];
      if (container && !header.dataset.arrowInit) {
        header.dataset.arrowInit = 'true';
        bindArrows(header, container);
      }
    });
  });
}

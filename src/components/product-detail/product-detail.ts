import EmblaCarousel from 'embla-carousel';

export function initProductDetail(root: HTMLElement): void {
  const container = root.querySelector?.('.product-detail');
  if (!container) return;

  initGallery(container as HTMLElement);
  initOptions(container as HTMLElement);
  initAddons(container as HTMLElement);
}

/* ── Gallery ── */

function initGallery(container: HTMLElement): void {
  const viewport = container.querySelector<HTMLElement>('#pd-thumbs-viewport');
  const mainImg = container.querySelector<HTMLImageElement>('#pd-main-img');
  const thumbs = container.querySelectorAll<HTMLButtonElement>('.product-detail__thumb');
  if (!viewport || !mainImg || !thumbs.length) return;

  EmblaCarousel(viewport, {
    containScroll: 'trimSnaps',
    dragFree: true,
    align: 'start',
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const img = thumb.querySelector<HTMLImageElement>('img');
      if (!img) return;

      mainImg.src = img.src;
      mainImg.alt = img.alt;

      thumbs.forEach((t) => t.classList.remove('product-detail__thumb--active'));
      thumb.classList.add('product-detail__thumb--active');
    });
  });
}

/* ── Options (Storage → Color) ── */

function initOptions(container: HTMLElement): void {
  const storageSelect = container.querySelector<HTMLSelectElement>('#pd-storage');
  const colorWrap = container.querySelector<HTMLElement>('#pd-color-wrap');
  const priceEl = container.querySelector<HTMLElement>('#pd-price');
  if (!storageSelect || !colorWrap || !priceEl) return;

  storageSelect.addEventListener('change', () => {
    // Show color dropdown
    colorWrap.classList.remove('product-detail__option--hidden');

    // Update base price
    const selected = storageSelect.selectedOptions[0];
    const basePrice = Number(selected?.dataset.price ?? 999);
    priceEl.textContent = formatPrice(basePrice);

    updateTotal(container);
  });
}

/* ── Add-ons ── */

function initAddons(container: HTMLElement): void {
  const addons = container.querySelectorAll<HTMLElement>('.product-detail__addon');

  addons.forEach((addon) => {
    const checkbox = addon.querySelector<HTMLInputElement>('.product-detail__addon-check');
    const variant = addon.querySelector<HTMLElement>('.product-detail__addon-variant');
    if (!checkbox) return;

    checkbox.addEventListener('change', () => {
      // Toggle variant dropdown visibility
      if (variant) {
        variant.classList.toggle('product-detail__addon-variant--hidden', !checkbox.checked);
      }
      updateTotal(container);
    });
  });
}

/* ── Total price ── */

function updateTotal(container: HTMLElement): void {
  const storageSelect = container.querySelector<HTMLSelectElement>('#pd-storage');
  const totalEl = container.querySelector<HTMLElement>('#pd-total');
  if (!totalEl) return;

  // Base price from storage selection
  const selected = storageSelect?.selectedOptions[0];
  let total = Number(selected?.dataset.price ?? 999);

  // Add checked add-ons
  container.querySelectorAll<HTMLElement>('.product-detail__addon').forEach((addon) => {
    const checkbox = addon.querySelector<HTMLInputElement>('.product-detail__addon-check');
    if (checkbox?.checked) {
      total += Number(addon.dataset.addonPrice ?? 0);
    }
  });

  totalEl.textContent = formatPrice(total);
}

function formatPrice(cents: number): string {
  return `$${cents.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

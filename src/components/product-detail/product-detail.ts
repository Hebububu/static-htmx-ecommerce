import EmblaCarousel from 'embla-carousel';
import { showAlert, showLightbox } from '../modal/modal';

export function initProductDetail(root: HTMLElement): void {
  const wrap = root.matches?.('.product-detail-wrap')
    ? root
    : root.querySelector<HTMLElement>('.product-detail-wrap');
  if (!wrap) return;

  initGallery(wrap);
  initOptions(wrap);
  initAddons(wrap);
  initTabs(wrap);
  initReviews(wrap);

  // Start with addons disabled (no main product selected yet)
  setAddonsDisabled(wrap, true);
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

/* ── Options (Storage → Color → create row) ── */

function initOptions(container: HTMLElement): void {
  const storageSelect = container.querySelector<HTMLSelectElement>('#pd-storage');
  const colorWrap = container.querySelector<HTMLElement>('#pd-color-wrap');
  const colorSelect = container.querySelector<HTMLSelectElement>('#pd-color');
  const priceEl = container.querySelector<HTMLElement>('#pd-price');
  if (!storageSelect || !colorWrap || !colorSelect || !priceEl) return;

  storageSelect.addEventListener('change', () => {
    colorWrap.classList.remove('product-detail__option--hidden');

    const selected = storageSelect.selectedOptions[0];
    const basePrice = Number(selected?.dataset.price ?? 999);
    priceEl.textContent = formatPrice(basePrice);
  });

  colorSelect.addEventListener('change', () => {
    const storageOpt = storageSelect.selectedOptions[0];
    const colorOpt = colorSelect.selectedOptions[0];
    if (!storageOpt?.value || !colorOpt?.value) return;

    const unitPrice = Number(storageOpt.dataset.price ?? 999);
    const storageLabel = storageOpt.textContent?.replace(/\s*\(.*\)/, '') ?? '';
    const colorLabel = colorOpt.textContent ?? '';
    const key = `main-${storageOpt.value}-${colorOpt.value}`;
    const name = `iPhone 15 Pro / ${storageLabel} / ${colorLabel}`;

    addOrIncrementRow(container, key, name, unitPrice);

    // Enable addons now that a main product row exists
    setAddonsDisabled(container, false);

    // Reset both dropdowns
    storageSelect.selectedIndex = 0;
    colorSelect.selectedIndex = 0;
    colorWrap.classList.add('product-detail__option--hidden');
    priceEl.textContent = formatPrice(999);

    updateTotal(container);
  });
}

/* ── Add-ons (click card to toggle) ── */

function initAddons(container: HTMLElement): void {
  const addons = container.querySelectorAll<HTMLElement>('.product-detail__addon');

  addons.forEach((card) => {
    const index = card.dataset.addonIndex!;
    const nameEl = card.querySelector<HTMLElement>('.product-detail__addon-name');
    const addonName = nameEl?.textContent ?? '';
    const unitPrice = Number(card.dataset.addonPrice ?? 0);
    const variantSelect = card.querySelector<HTMLSelectElement>('[data-addon-select]');

    if (variantSelect) {
      // Dropdown-based: selecting a variant creates/increments a row
      variantSelect.addEventListener('change', async () => {
        if (!hasMainRow(container)) {
          variantSelect.selectedIndex = 0;
          await showAlert('Please select product options first.');
          container.querySelector<HTMLElement>('#pd-storage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        const variant = variantSelect.selectedOptions[0];
        if (!variant?.value) return;

        const variantLabel = variant.textContent ?? '';
        const key = `addon-${index}-${variant.value}`;
        const fullName = `${addonName} / ${variantLabel}`;

        addOrIncrementRow(container, key, fullName, unitPrice);
        card.classList.add('product-detail__addon--selected');

        // Reset dropdown to placeholder
        variantSelect.selectedIndex = 0;

        updateTotal(container);
      });
    } else {
      // No dropdown: + button adds/increments row
      const addBtn = card.querySelector<HTMLButtonElement>('.product-detail__addon-add');
      addBtn?.addEventListener('click', async () => {
        if (!hasMainRow(container)) {
          await showAlert('Please select product options first.');
          container.querySelector<HTMLElement>('#pd-storage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        const key = `addon-${index}`;
        addOrIncrementRow(container, key, addonName, unitPrice);
        card.classList.add('product-detail__addon--selected');
        updateTotal(container);
      });
    }
  });
}

/* ── Tabs ── */

function initTabs(wrap: HTMLElement): void {
  const btns = wrap.querySelectorAll<HTMLButtonElement>('.product-detail-tabs__btn');
  const tabBar = wrap.querySelector<HTMLElement>('.product-detail-tabs');
  const sections = wrap.querySelectorAll<HTMLElement>('.product-detail-section');
  if (!btns.length || !tabBar || !sections.length) return;

  // Measure header height and set CSS variables for sticky offsets
  function measureOffsets(): void {
    const headerH = document.querySelector('header')?.offsetHeight ?? 0;
    const tabH = tabBar!.offsetHeight;
    wrap.style.setProperty('--_header-h', `${headerH}px`);
    wrap.style.setProperty('--_scroll-offset', `${headerH + tabH}px`);
  }

  // Defer measurement to ensure header is rendered
  requestAnimationFrame(measureOffsets);

  function setActive(targetId: string): void {
    btns.forEach((btn) => {
      btn.classList.toggle('product-detail-tabs__btn--active', btn.dataset.tabTarget === targetId);
    });
  }

  // Click → scroll to section
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tabTarget;
      if (!targetId) return;
      const section = wrap.querySelector<HTMLElement>(`#${targetId}`);
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(targetId);
    });
  });

  // IntersectionObserver → update active tab on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
          break;
        }
      }
    },
    { rootMargin: '-40% 0px -60% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ── Reviews ── */

function initReviews(wrap: HTMLElement): void {
  // Photo grid → lightbox
  const stripThumbs = wrap.querySelectorAll<HTMLButtonElement>('.product-review-summary__photo');
  const stripImages = Array.from(stripThumbs).map((t) => t.dataset.lightboxSrc ?? '');

  stripThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      showLightbox(stripImages, i);
    });
  });

  // Filter: All / Photo Reviews
  const filterBtns = wrap.querySelectorAll<HTMLButtonElement>('.product-review-filter__btn');
  const reviewItems = wrap.querySelectorAll<HTMLElement>('.product-review-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.reviewFilter;
      filterBtns.forEach((b) => b.classList.toggle('product-review-filter__btn--active', b === btn));

      reviewItems.forEach((item) => {
        if (filter === 'photo') {
          item.classList.toggle('product-review-item--hidden', !item.hasAttribute('data-has-photo'));
        } else {
          item.classList.remove('product-review-item--hidden');
        }
      });
    });
  });

  // "Read more" toggles
  wrap.querySelectorAll<HTMLButtonElement>('.product-review-item__more').forEach((btn) => {
    btn.addEventListener('click', () => {
      const body = btn.previousElementSibling as HTMLElement | null;
      if (!body) return;

      const isClamped = body.classList.contains('product-review-item__body--clamped');
      body.classList.toggle('product-review-item__body--clamped');
      btn.textContent = isClamped ? 'Show less' : 'Read more';
    });
  });

  // Photo thumbnail → lightbox
  wrap.querySelectorAll<HTMLElement>('.product-review-item__photos').forEach((container) => {
    const thumbs = container.querySelectorAll<HTMLButtonElement>('.product-review-item__thumb');
    const images = Array.from(thumbs).map((t) => t.dataset.lightboxSrc ?? '');

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        showLightbox(images, i);
      });
    });
  });
}

/* ── Addon gating ── */

function hasMainRow(container: HTMLElement): boolean {
  return !!container.querySelector('#pd-selected [data-sel-key^="main-"]');
}

function setAddonsDisabled(container: HTMLElement, disabled: boolean): void {
  container.querySelectorAll<HTMLElement>('.product-detail__addon').forEach((card) => {
    card.classList.toggle('product-detail__addon--disabled', disabled);
  });
}

/* ── Row management ── */

function addOrIncrementRow(container: HTMLElement, key: string, name: string, unitPrice: number): void {
  const selectedEl = container.querySelector<HTMLElement>('#pd-selected');
  if (!selectedEl) return;

  const existing = selectedEl.querySelector<HTMLElement>(`[data-sel-key="${key}"]`);
  if (existing) {
    // Increment qty
    const qtyEl = existing.querySelector<HTMLElement>('.product-detail__qty-value')!;
    const newQty = Number(qtyEl.textContent) + 1;
    qtyEl.textContent = String(newQty);
    updateLineTotal(existing, unitPrice, newQty);
  } else {
    createSelRow(container, key, name, unitPrice);
  }
}

function createSelRow(container: HTMLElement, key: string, name: string, unitPrice: number): void {
  const selectedEl = container.querySelector<HTMLElement>('#pd-selected');
  if (!selectedEl) return;

  const row = document.createElement('div');
  row.className = 'product-detail__sel-row';
  row.dataset.selKey = key;
  row.dataset.unitPrice = String(unitPrice);

  row.innerHTML = `
    <span class="product-detail__sel-name">${name}</span>
    <div class="product-detail__sel-controls">
      <div class="product-detail__qty">
        <button class="product-detail__qty-btn" type="button" data-action="dec">&minus;</button>
        <span class="product-detail__qty-value">1</span>
        <button class="product-detail__qty-btn" type="button" data-action="inc">+</button>
      </div>
      <span class="product-detail__sel-line-total">${formatPrice(unitPrice)}</span>
      <button class="product-detail__sel-remove" type="button" aria-label="Remove">&times;</button>
    </div>
  `;

  // Stepper events
  row.querySelector('[data-action="dec"]')!.addEventListener('click', () => {
    const qtyEl = row.querySelector<HTMLElement>('.product-detail__qty-value')!;
    const qty = Number(qtyEl.textContent);
    if (qty <= 1) {
      removeRow(container, key);
    } else {
      qtyEl.textContent = String(qty - 1);
      updateLineTotal(row, unitPrice, qty - 1);
      updateTotal(container);
    }
  });

  row.querySelector('[data-action="inc"]')!.addEventListener('click', () => {
    const qtyEl = row.querySelector<HTMLElement>('.product-detail__qty-value')!;
    const qty = Number(qtyEl.textContent) + 1;
    qtyEl.textContent = String(qty);
    updateLineTotal(row, unitPrice, qty);
    updateTotal(container);
  });

  // Remove button
  row.querySelector('.product-detail__sel-remove')!.addEventListener('click', () => {
    removeRow(container, key);
  });

  selectedEl.appendChild(row);
}

function removeRow(container: HTMLElement, key: string): void {
  const selectedEl = container.querySelector<HTMLElement>('#pd-selected');
  const row = selectedEl?.querySelector<HTMLElement>(`[data-sel-key="${key}"]`);
  if (row) row.remove();

  // If it's an addon, deselect the card when no rows remain for that addon
  if (key.startsWith('addon-')) {
    const parts = key.split('-');
    const index = parts[1];
    const remaining = selectedEl?.querySelectorAll(`[data-sel-key^="addon-${index}"]`);
    if (!remaining?.length) {
      const card = container.querySelector<HTMLElement>(`.product-detail__addon[data-addon-index="${index}"]`);
      card?.classList.remove('product-detail__addon--selected');
    }
  }

  // Re-disable addons if no main rows remain
  if (!hasMainRow(container)) {
    setAddonsDisabled(container, true);
  }

  updateTotal(container);
}

function updateLineTotal(row: HTMLElement, unitPrice: number, qty: number): void {
  const lineTotalEl = row.querySelector<HTMLElement>('.product-detail__sel-line-total');
  if (lineTotalEl) {
    lineTotalEl.textContent = formatPrice(unitPrice * qty);
  }
}

/* ── Total price ── */

function updateTotal(container: HTMLElement): void {
  const totalEl = container.querySelector<HTMLElement>('#pd-total');
  if (!totalEl) return;

  let total = 0;
  container.querySelectorAll<HTMLElement>('.product-detail__sel-row').forEach((row) => {
    const unitPrice = Number(row.dataset.unitPrice ?? 0);
    const qty = Number(row.querySelector<HTMLElement>('.product-detail__qty-value')?.textContent ?? 0);
    total += unitPrice * qty;
  });

  totalEl.textContent = formatPrice(total);
}

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

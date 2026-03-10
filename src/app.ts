import { initBannerCarousel } from './components/banner/carousel';
import { initProductCarousel } from './components/product/product-carousel';

// htmx types are resolved globally via src/types/htmx.d.ts (included in tsconfig.json)

// ============================================================
// CSS deduplication
// ============================================================

/**
 * Prevents duplicate component CSS from being inserted into the DOM.
 * Each component HTML includes a <link data-component-style="name"> tag.
 * When the same component is loaded more than once, this removes the duplicate.
 */
function deduplicateComponentStyles(): void {
  const seen = new Set<string>();

  document.querySelectorAll<HTMLLinkElement>('link[data-component-style]').forEach((link) => {
    const styleId = link.dataset.componentStyle;
    if (!styleId) return;

    if (seen.has(styleId)) {
      link.remove();
    } else {
      seen.add(styleId);
    }
  });
}

// ============================================================
// Error handling
// ============================================================

/**
 * Replaces a failed component's content area with an inline error state.
 * Includes a retry button that re-fires the original htmx request (Option A).
 */
function showComponentError(target: HTMLElement, path: string): void {
  target.innerHTML = `
    <div class="error-state" role="alert" aria-live="assertive">
      <p class="error-state__message">콘텐츠를 불러오지 못했습니다.</p>
      <button class="error-state__retry" type="button">다시 시도</button>
    </div>
  `;

  const retryBtn = target.querySelector<HTMLButtonElement>('.error-state__retry');
  retryBtn?.addEventListener('click', () => {
    target.innerHTML = '';
    window.htmx.ajax('GET', path, { target, swap: 'innerHTML' });
  });
}

let networkBanner: HTMLElement | null = null;
let networkBannerPath: string | null = null;

/**
 * Shows a fixed top banner for network-wide failures.
 * - Auto-dismisses when the browser comes back online.
 * - Manual X button also dismisses.
 * - Retry button re-fires the failed htmx request.
 */
function showNetworkBanner(path: string): void {
  // Only show one banner at a time
  if (networkBanner) return;

  networkBannerPath = path;

  const banner = document.createElement('div');
  banner.className = 'network-banner';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'assertive');
  banner.innerHTML = `
    <p class="network-banner__message">네트워크 연결을 확인해 주세요.</p>
    <div class="network-banner__actions">
      <button class="network-banner__retry" type="button">다시 시도</button>
      <button class="network-banner__dismiss" type="button" aria-label="닫기">&times;</button>
    </div>
  `;

  document.body.prepend(banner);
  networkBanner = banner;

  // Force reflow then add visible class for CSS transition
  requestAnimationFrame(() => {
    banner.classList.add('network-banner--visible');
  });

  function dismiss(): void {
    if (!networkBanner) return;
    networkBanner.classList.remove('network-banner--visible');
    networkBanner.addEventListener('transitionend', () => networkBanner?.remove(), { once: true });
    networkBanner = null;
    networkBannerPath = null;
    window.removeEventListener('online', onOnline);
  }

  function onOnline(): void {
    dismiss();
  }

  // Auto-dismiss when network comes back
  window.addEventListener('online', onOnline);

  // Manual dismiss
  banner.querySelector('.network-banner__dismiss')?.addEventListener('click', dismiss);

  // Retry: re-fire original request
  banner.querySelector('.network-banner__retry')?.addEventListener('click', () => {
    if (networkBannerPath) {
      const savedPath = networkBannerPath;
      dismiss();
      // Re-trigger the failed request targeting the main content area as fallback
      const target = document.getElementById('content');
      if (target) {
        window.htmx.ajax('GET', savedPath, { target, swap: 'innerHTML' });
      }
    }
  });
}

// ============================================================
// htmx event listeners
// ============================================================

document.body.addEventListener('htmx:afterSwap', () => {
  deduplicateComponentStyles();
});

document.body.addEventListener('htmx:load', (event) => {
  const loadedEl = (event as HtmxLoadEvent).detail.elt;

  if (loadedEl instanceof HTMLElement) {
    initBannerCarousel(loadedEl);
    initProductCarousel(loadedEl);
  }
});

/**
 * Non-2xx response (404, 500, etc.) — component-level error.
 * Replace the failed component area with an inline error state.
 */
document.body.addEventListener('htmx:responseError', (event) => {
  const { target, requestConfig } =
    (event as HTMLElementEventMap['htmx:responseError']).detail as unknown as {
      target: HTMLElement;
      requestConfig: HtmxRequestConfig;
    };

  if (target instanceof HTMLElement) {
    showComponentError(target, requestConfig.path);
  }
});

/**
 * Network-level failure (offline, timeout) — global banner.
 */
document.body.addEventListener('htmx:sendError', (event) => {
  const { requestConfig } = (event as HTMLElementEventMap['htmx:sendError']).detail;
  showNetworkBanner(requestConfig.path);
});

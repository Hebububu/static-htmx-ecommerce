const CONTAINER_ID = 'modal-container';
let cssLoaded = false;

function ensureCSS(): void {
  if (cssLoaded) return;
  cssLoaded = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/components/modal/modal.css';
  link.dataset.componentStyle = 'modal';
  document.head.appendChild(link);
}

function getContainer(): HTMLElement {
  return document.getElementById(CONTAINER_ID) ?? document.body;
}

function createBackdrop(message: string, buttons: string): HTMLElement {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'alertdialog');
  backdrop.setAttribute('aria-modal', 'true');

  backdrop.innerHTML = `
    <div class="modal-card">
      <p class="modal-card__message">${message}</p>
      <div class="modal-card__actions">${buttons}</div>
    </div>
  `;

  return backdrop;
}

function open(backdrop: HTMLElement): void {
  const container = getContainer();
  container.appendChild(backdrop);
  document.body.style.overflow = 'hidden';

  // Trigger enter animation
  requestAnimationFrame(() => {
    backdrop.classList.add('modal-backdrop--visible');
  });

  // Focus first button
  backdrop.querySelector<HTMLButtonElement>('.modal-card__btn')?.focus();
}

function close(backdrop: HTMLElement): void {
  backdrop.classList.remove('modal-backdrop--visible');
  document.body.style.overflow = '';
  backdrop.addEventListener('transitionend', () => backdrop.remove(), { once: true });
}

export function showAlert(message: string): Promise<void> {
  ensureCSS();
  return new Promise((resolve) => {
    const backdrop = createBackdrop(
      message,
      '<button class="modal-card__btn modal-card__btn--primary" data-action="ok">OK</button>',
    );

    function dismiss(): void {
      close(backdrop);
      resolve();
    }

    backdrop.querySelector('[data-action="ok"]')!.addEventListener('click', dismiss);

    // Backdrop click dismisses
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) dismiss();
    });

    // Escape key dismisses
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        dismiss();
      }
    }
    document.addEventListener('keydown', onKey);

    open(backdrop);
  });
}

export function showConfirm(message: string): Promise<boolean> {
  ensureCSS();
  return new Promise((resolve) => {
    const backdrop = createBackdrop(
      message,
      `<button class="modal-card__btn modal-card__btn--secondary" data-action="cancel">Cancel</button>
       <button class="modal-card__btn modal-card__btn--primary" data-action="confirm">Confirm</button>`,
    );

    let resolved = false;

    function dismiss(result: boolean): void {
      if (resolved) return;
      resolved = true;
      close(backdrop);
      resolve(result);
    }

    backdrop.querySelector('[data-action="confirm"]')!.addEventListener('click', () => dismiss(true));
    backdrop.querySelector('[data-action="cancel"]')!.addEventListener('click', () => dismiss(false));

    // Backdrop click = cancel
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) dismiss(false);
    });

    // Escape = cancel
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        dismiss(false);
      }
    }
    document.addEventListener('keydown', onKey);

    open(backdrop);
  });
}

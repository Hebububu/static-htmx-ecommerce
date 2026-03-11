export function initEventListCountdown(): void {
  const cards = document.querySelectorAll<HTMLElement>('.event-list__featured[data-end]');
  if (!cards.length) return;

  function update(): void {
    const now = Date.now();

    cards.forEach((card) => {
      const end = new Date(card.dataset.end!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        card.querySelectorAll<HTMLElement>('[data-unit]').forEach((el) => {
          el.textContent = '0';
        });
        return;
      }

      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);

      card.querySelector<HTMLElement>('[data-unit="d"]')!.textContent = String(d);
      card.querySelector<HTMLElement>('[data-unit="h"]')!.textContent = String(h).padStart(2, '0');
      card.querySelector<HTMLElement>('[data-unit="m"]')!.textContent = String(m).padStart(2, '0');
      card.querySelector<HTMLElement>('[data-unit="s"]')!.textContent = String(s).padStart(2, '0');
    });
  }

  update();
  setInterval(update, 1_000);
}

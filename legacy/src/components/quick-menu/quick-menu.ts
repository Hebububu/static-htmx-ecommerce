const SCROLL_THRESHOLD = 150;

export function initQuickMenu(root: ParentNode = document): void {
	const menus =
		root instanceof HTMLElement && root.matches('.js-quick-menu')
			? [root]
			: Array.from(root.querySelectorAll<HTMLElement>('.js-quick-menu'));

	menus.forEach((menu) => {
		if (menu.dataset.quickMenuInit) return;
		menu.dataset.quickMenuInit = 'true';

		let ticking = false;

		function updateVisibility(): void {
			menu.classList.toggle('quick-menu--visible', window.scrollY > SCROLL_THRESHOLD);
		}

		window.addEventListener(
			'scroll',
			() => {
				if (ticking) return;
				ticking = true;
				requestAnimationFrame(() => {
					updateVisibility();
					ticking = false;
				});
			},
			{ passive: true }
		);

		updateVisibility();

		const topBtn = menu.querySelector<HTMLElement>('.js-quick-menu-top');
		topBtn?.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});
}

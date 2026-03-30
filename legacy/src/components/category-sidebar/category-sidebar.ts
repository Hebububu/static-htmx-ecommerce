/**
 * Initializes the category sidebar mobile drawer toggle.
 * On mobile (<960px), the sidebar slides in from the left when the filter button is clicked.
 */
export function initCategorySidebar(root: HTMLElement): void {
	const sidebar = root.querySelector<HTMLElement>('#category-sidebar');
	if (!sidebar) return;

	const backdrop = root.querySelector<HTMLElement>('.category-sidebar__backdrop');
	const closeBtn = sidebar.querySelector<HTMLButtonElement>('.category-sidebar__close');

	// The filter button lives outside the sidebar fragment, in the product list header
	const filterBtn = document.querySelector<HTMLButtonElement>('.product-list__filter-btn');

	function open(): void {
		sidebar!.classList.add('is-open');
		backdrop?.classList.add('is-visible');
		document.body.style.overflow = 'hidden';
	}

	function close(): void {
		sidebar!.classList.remove('is-open');
		backdrop?.classList.remove('is-visible');
		document.body.style.overflow = '';
	}

	filterBtn?.addEventListener('click', open);
	closeBtn?.addEventListener('click', close);
	backdrop?.addEventListener('click', close);
}

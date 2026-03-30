declare const __BASE_PATH__: string;

// ============================================================
// Types
// ============================================================

interface NavChild {
	label: string;
	href: string;
}

interface NavItem {
	label: string;
	href: string;
	children?: NavChild[];
	separator?: boolean;
}

// ============================================================
// Nav data
// ============================================================

const navItems: NavItem[] = [
	{
		label: 'Smartphones',
		href: `${__BASE_PATH__}pages/product/list.html?category=smartphones`,
		children: [
			{ label: 'iPhone', href: `${__BASE_PATH__}pages/product/list.html?category=iphone` },
			{ label: 'Galaxy', href: `${__BASE_PATH__}pages/product/list.html?category=galaxy` },
			{ label: 'Pixel', href: `${__BASE_PATH__}pages/product/list.html?category=pixel` }
		]
	},
	{
		label: 'Tablets',
		href: `${__BASE_PATH__}pages/product/list.html?category=tablets`,
		children: [
			{ label: 'iPad', href: `${__BASE_PATH__}pages/product/list.html?category=ipad` },
			{ label: 'Galaxy Tab', href: `${__BASE_PATH__}pages/product/list.html?category=galaxy-tab` }
		]
	},
	{
		label: 'Laptops',
		href: `${__BASE_PATH__}pages/product/list.html?category=laptops`,
		children: [
			{ label: 'MacBook', href: `${__BASE_PATH__}pages/product/list.html?category=macbook` },
			{
				label: 'Galaxy Book',
				href: `${__BASE_PATH__}pages/product/list.html?category=galaxy-book`
			},
			{ label: 'Surface', href: `${__BASE_PATH__}pages/product/list.html?category=surface` }
		]
	},
	{
		label: 'Wearables',
		href: `${__BASE_PATH__}pages/product/list.html?category=wearables`,
		children: [
			{
				label: 'Apple Watch',
				href: `${__BASE_PATH__}pages/product/list.html?category=apple-watch`
			},
			{
				label: 'Galaxy Watch',
				href: `${__BASE_PATH__}pages/product/list.html?category=galaxy-watch`
			},
			{ label: 'AirPods', href: `${__BASE_PATH__}pages/product/list.html?category=airpods` }
		]
	},
	{
		label: 'Accessories',
		href: `${__BASE_PATH__}pages/product/list.html?category=accessories`,
		children: [
			{ label: 'Cases', href: `${__BASE_PATH__}pages/product/list.html?category=cases` },
			{ label: 'Chargers', href: `${__BASE_PATH__}pages/product/list.html?category=chargers` },
			{ label: 'Cables', href: `${__BASE_PATH__}pages/product/list.html?category=cables` },
			{
				label: 'Screen Protectors',
				href: `${__BASE_PATH__}pages/product/list.html?category=screen-protectors`
			}
		]
	},
	{
		label: 'Audio',
		href: `${__BASE_PATH__}pages/product/list.html?category=audio`,
		children: [
			{ label: 'Headphones', href: `${__BASE_PATH__}pages/product/list.html?category=headphones` },
			{ label: 'Speakers', href: `${__BASE_PATH__}pages/product/list.html?category=speakers` },
			{ label: 'Earbuds', href: `${__BASE_PATH__}pages/product/list.html?category=earbuds` }
		]
	},
	{
		label: 'Event',
		href: `${__BASE_PATH__}pages/event/list.html`,
		separator: true
	},
	{
		label: 'Board',
		href: `${__BASE_PATH__}pages/board/list.html`,
		children: [
			{ label: 'Notice', href: `${__BASE_PATH__}pages/board/notices.html` },
			{ label: 'FAQ', href: `${__BASE_PATH__}pages/board/list.html?type=faq` }
		]
	},
	{
		label: 'Service',
		href: `${__BASE_PATH__}pages/service/faq.html`
	}
];

// ============================================================
// Render
// ============================================================

/**
 * Injects desktop nav items into #header-nav-list.
 * Items with children get a dropdown rendered via CSS :hover.
 */
function renderNav(): void {
	const list = document.getElementById('header-nav-list');
	if (!list) return;

	list.innerHTML = navItems
		.map((item) => {
			const hasChildren = item.children && item.children.length > 0;
			const dropdownHtml = hasChildren
				? `<ul class="header__nav-dropdown" role="menu">
            ${item
							.children!.map(
								(child) =>
									`<li class="header__nav-dropdown-item" role="none">
                    <a class="header__nav-dropdown-link" href="${child.href}" role="menuitem">
                      ${child.label}
                    </a>
                  </li>`
							)
							.join('')}
          </ul>`
				: '';

			const classes = ['header__nav-item'];
			if (hasChildren) classes.push('header__nav-item--has-children');
			if (item.separator) classes.push('header__nav-item--separator');

			return `
        <li class="${classes.join(' ')}">
          <a class="header__nav-link" href="${item.href}">
            ${item.label}
            ${hasChildren ? '<i class="ph ph-caret-down header__nav-caret" aria-hidden="true"></i>' : ''}
          </a>
          ${dropdownHtml}
        </li>
      `;
		})
		.join('');
}

/**
 * Injects mobile drawer nav items into #header-drawer-nav-list.
 * Items with children get an accordion toggle on click.
 */
function renderDrawerNav(): void {
	const list = document.getElementById('header-drawer-nav-list');
	if (!list) return;

	list.innerHTML = navItems
		.map((item) => {
			const hasChildren = item.children && item.children.length > 0;
			const childrenHtml = hasChildren
				? `<ul class="header__drawer-nav-children">
            ${item
							.children!.map(
								(child) =>
									`<li>
                    <a class="header__drawer-nav-child-link" href="${child.href}">
                      ${child.label}
                    </a>
                  </li>`
							)
							.join('')}
          </ul>`
				: '';

			const classes = ['header__drawer-nav-item'];
			if (hasChildren) classes.push('header__drawer-nav-item--has-children');
			if (item.separator) classes.push('header__drawer-nav-item--separator');

			return `
        <li class="${classes.join(' ')}">
          <a class="header__drawer-nav-link" href="${hasChildren ? '#' : item.href}"
             ${hasChildren ? 'aria-expanded="false"' : ''}>
            <span>${item.label}</span>
            ${hasChildren ? '<i class="ph ph-caret-down header__drawer-nav-caret" aria-hidden="true"></i>' : ''}
          </a>
          ${childrenHtml}
        </li>
      `;
		})
		.join('');

	// Bind accordion toggle for items with children
	list.querySelectorAll<HTMLElement>('.header__drawer-nav-item--has-children').forEach((item) => {
		const link = item.querySelector<HTMLAnchorElement>('.header__drawer-nav-link');
		link?.addEventListener('click', (e) => {
			e.preventDefault();
			const isOpen = item.classList.contains('header__drawer-nav-item--open');
			item.classList.toggle('header__drawer-nav-item--open', !isOpen);
			link.setAttribute('aria-expanded', String(!isOpen));
		});
	});
}

// ============================================================
// Behaviors
// ============================================================

/**
 * Toggles the expandable search bar on tablet/mobile.
 * - Search icon click: show/hide .header__search-expand
 * - ESC key: close
 * - Click outside: close
 */
function initMobileSearch(): void {
	const searchBtn = document.querySelector<HTMLButtonElement>('.header__action-btn--search');
	const searchExpand = document.getElementById('header-search-expand');
	const searchInput = searchExpand?.querySelector<HTMLInputElement>('.header__search-expand-input');

	if (!searchBtn || !searchExpand) return;

	function openSearch(): void {
		searchExpand!.removeAttribute('hidden');
		searchBtn!.setAttribute('aria-expanded', 'true');
		searchInput?.focus();
	}

	function closeSearch(): void {
		searchExpand!.setAttribute('hidden', '');
		searchBtn!.setAttribute('aria-expanded', 'false');
	}

	searchBtn.addEventListener('click', () => {
		const isOpen = !searchExpand.hasAttribute('hidden');
		if (isOpen) {
			closeSearch();
		} else {
			openSearch();
		}
	});

	// Close on ESC
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !searchExpand.hasAttribute('hidden')) {
			closeSearch();
			searchBtn.focus();
		}
	});

	// Close on click outside
	document.addEventListener('click', (e) => {
		const target = e.target as Node;
		if (
			!searchExpand.hasAttribute('hidden') &&
			!searchExpand.contains(target) &&
			!searchBtn.contains(target)
		) {
			closeSearch();
		}
	});
}

/**
 * Handles the mobile/tablet hamburger drawer.
 * - Hamburger click: open drawer
 * - Backdrop click / close button click / ESC: close drawer
 * - Locks body scroll while open
 */
function initHamburger(): void {
	const hamburgerBtn = document.querySelector<HTMLButtonElement>('.header__action-btn--hamburger');
	const drawer = document.getElementById('header-drawer');
	const backdrop = drawer?.querySelector<HTMLElement>('.header__drawer-backdrop');
	const closeBtn = drawer?.querySelector<HTMLButtonElement>('.header__drawer-close');
	const header = document.getElementById('site-header');

	if (!hamburgerBtn || !drawer) return;

	function openDrawer(): void {
		drawer!.setAttribute('aria-hidden', 'false');
		hamburgerBtn!.setAttribute('aria-expanded', 'true');
		header?.classList.add('header--menu-open');
		document.body.style.overflow = 'hidden';
	}

	function closeDrawer(): void {
		drawer!.setAttribute('aria-hidden', 'true');
		hamburgerBtn!.setAttribute('aria-expanded', 'false');
		header?.classList.remove('header--menu-open');
		document.body.style.overflow = '';
	}

	hamburgerBtn.addEventListener('click', openDrawer);
	backdrop?.addEventListener('click', closeDrawer);
	closeBtn?.addEventListener('click', closeDrawer);

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
			closeDrawer();
			hamburgerBtn.focus();
		}
	});

	// Enable transitions after the initial paint is committed — prevents flash on page load.
	// Double rAF ensures the first frame has been painted before the class is added.
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			drawer.classList.add('header__drawer--ready');
		});
	});
}

// ============================================================
// Entry point
// Module scripts are deferred and execute after the DOM is ready,
// so top-level calls are safe. DOMContentLoaded would never fire
// inside a module loaded by an htmx fragment.
// ============================================================

renderNav();
renderDrawerNav();
initMobileSearch();
initHamburger();

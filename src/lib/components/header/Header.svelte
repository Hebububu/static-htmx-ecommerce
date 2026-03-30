<script lang="ts">
	import { resolve, asset } from '$app/paths';
	import { cart } from '$lib/stores/cart.svelte';
	import { categories } from '$lib/data/categories';

	let drawerOpen = $state(false);
	let searchExpanded = $state(false);
	let openCategory = $state<string | null>(null);

	function toggleDrawer() {
		drawerOpen = !drawerOpen;
		if (!drawerOpen) openCategory = null;
	}

	function toggleSearch() {
		searchExpanded = !searchExpanded;
	}

	function toggleCategory(id: string) {
		openCategory = openCategory === id ? null : id;
	}
</script>

<div class="header">
	<!-- Promo banner -->
	<div class="header__banner" aria-label="Promotions">
		<div class="header__banner-track" aria-hidden="true">
			<div class="header__banner-slide">Free shipping on all orders over $50 — shop now</div>
			<div class="header__banner-slide">Sign up today and receive an exclusive welcome coupon</div>
			<div class="header__banner-slide">Refer a friend and both of you earn store credit</div>
			<div class="header__banner-slide">Follow our channel for the latest deals and discounts</div>
		</div>
	</div>

	<!-- Top utility bar (desktop) -->
	<div class="header__topbar">
		<div class="header__topbar-inner container">
			<nav class="header__topbar-nav" aria-label="Utility navigation">
				<a href={resolve('/auth/login/')} class="header__topbar-link">Sign in</a>
				<a href={resolve('/my/orders/')} class="header__topbar-link">Orders</a>
				<a href={resolve('/my/')} class="header__topbar-link">Coupons</a>
			</nav>
		</div>
	</div>

	<!-- Main row -->
	<div class="header__main">
		<div class="header__main-inner container">
			<button
				class="header__action-btn header__action-btn--hamburger"
				type="button"
				aria-label="Open menu"
				aria-expanded={drawerOpen}
				onclick={toggleDrawer}
			>
				<i class="ph ph-list" aria-hidden="true"></i>
			</button>

			<a href={resolve('/')} class="header__logo" aria-label="Go to homepage">Logo</a>

			<form class="header__search" role="search" action={resolve('/search/')} method="get">
				<input
					class="header__search-input"
					type="search"
					name="q"
					placeholder="Search..."
					aria-label="Search products"
					autocomplete="off"
				/>
				<button class="header__search-btn" type="submit" aria-label="Submit search">
					<i class="ph ph-magnifying-glass" aria-hidden="true"></i>
				</button>
			</form>

			<div class="header__actions">
				<button
					class="header__action-btn header__action-btn--search"
					type="button"
					aria-label="Search"
					aria-expanded={searchExpanded}
					onclick={toggleSearch}
				>
					<i class="ph ph-magnifying-glass" aria-hidden="true"></i>
				</button>
				<a
					class="header__action-btn header__action-btn--my"
					href={resolve('/my/')}
					aria-label="My page"
				>
					<i class="ph ph-user" aria-hidden="true"></i>
				</a>
				<a
					class="header__action-btn header__action-btn--cart"
					href={resolve('/cart/')}
					aria-label="Cart"
				>
					<i class="ph ph-shopping-cart" aria-hidden="true"></i>
					{#if cart.mounted && cart.count > 0}
						<span class="header__cart-badge" aria-hidden="true">{cart.count}</span>
					{/if}
				</a>
			</div>
		</div>

		{#if searchExpanded}
			<div class="header__search-expand">
				<form
					class="header__search-expand-form container"
					role="search"
					action={resolve('/search/')}
					method="get"
				>
					<input
						class="header__search-expand-input"
						type="search"
						name="q"
						placeholder="Search..."
						aria-label="Search products"
						autocomplete="off"
					/>
					<button class="header__search-expand-btn" type="submit" aria-label="Submit search">
						<i class="ph ph-magnifying-glass" aria-hidden="true"></i>
					</button>
				</form>
			</div>
		{/if}
	</div>

	<!-- Category nav (desktop) -->
	<nav class="header__nav" aria-label="Main navigation">
		<div class="header__nav-inner container">
			<ul class="header__nav-list">
				{#each categories as cat}
					<li class="header__nav-item" class:header__nav-item--has-children={cat.children?.length}>
						<a href="{resolve('/products/')}?category={cat.slug}" class="header__nav-link">
							{cat.name}
							{#if cat.children?.length}
								<i class="ph ph-caret-down header__nav-caret" aria-hidden="true"></i>
							{/if}
						</a>
						{#if cat.children?.length}
							<div class="header__nav-dropdown">
								{#each cat.children as child}
									<a
										href="{resolve('/products/')}?category={child.slug}"
										class="header__nav-dropdown-link">{child.name}</a
									>
								{/each}
							</div>
						{/if}
					</li>
				{/each}
				<li class="header__nav-item header__nav-item--separator">
					<a href={resolve('/event/')} class="header__nav-link">Events</a>
				</li>
				<li class="header__nav-item">
					<a href={resolve('/board/notices/')} class="header__nav-link">Notice</a>
				</li>
			</ul>
		</div>
	</nav>
</div>

<!-- Mobile drawer -->
{#if drawerOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="header__drawer" aria-hidden="false">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="header__drawer-backdrop" onclick={toggleDrawer}></div>
		<div class="header__drawer-inner" role="dialog" aria-modal="true" aria-label="Navigation menu">
			<button
				class="header__drawer-close"
				type="button"
				aria-label="Close menu"
				onclick={toggleDrawer}
			>
				<i class="ph ph-x" aria-hidden="true"></i>
			</button>
			<nav class="header__drawer-nav" aria-label="Mobile navigation">
				<ul class="header__drawer-nav-list">
					{#each categories as cat}
						<li
							class="header__drawer-nav-item"
							class:header__drawer-nav-item--open={openCategory === cat.id}
						>
							{#if cat.children?.length}
								<button class="header__drawer-nav-link" onclick={() => toggleCategory(cat.id)}>
									{cat.name}
									<i class="ph ph-caret-down header__drawer-nav-caret" aria-hidden="true"></i>
								</button>
								<div class="header__drawer-nav-children">
									{#each cat.children as child}
										<a
											href="{resolve('/products/')}?category={child.slug}"
											class="header__drawer-nav-child-link"
											onclick={toggleDrawer}>{child.name}</a
										>
									{/each}
								</div>
							{:else}
								<a
									href="{resolve('/products/')}?category={cat.slug}"
									class="header__drawer-nav-link"
									onclick={toggleDrawer}>{cat.name}</a
								>
							{/if}
						</li>
					{/each}
					<li class="header__drawer-nav-item header__drawer-nav-item--separator">
						<a href={resolve('/event/')} class="header__drawer-nav-link" onclick={toggleDrawer}
							>Events</a
						>
					</li>
					<li class="header__drawer-nav-item">
						<a
							href={resolve('/board/notices/')}
							class="header__drawer-nav-link"
							onclick={toggleDrawer}>Notice</a
						>
					</li>
				</ul>
			</nav>
			<div class="header__drawer-utils">
				<a href={resolve('/auth/login/')} class="header__drawer-util-link" onclick={toggleDrawer}
					>Sign in</a
				>
				<a href={resolve('/my/orders/')} class="header__drawer-util-link" onclick={toggleDrawer}
					>Orders</a
				>
				<a href={resolve('/my/')} class="header__drawer-util-link" onclick={toggleDrawer}>Coupons</a
				>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes banner-scroll {
		0%,
		22% {
			transform: translateY(0);
		}
		25%,
		47% {
			transform: translateY(-25%);
		}
		50%,
		72% {
			transform: translateY(-50%);
		}
		75%,
		97% {
			transform: translateY(-75%);
		}
		100% {
			transform: translateY(0);
		}
	}

	.header {
		--color-background: #f9f8f6;
		background-color: var(--color-background);
		min-width: 320px;
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: var(--z-sticky, 200);
	}

	/* Promo banner */
	.header__banner {
		height: 40px;
		overflow: hidden;
		background-color: #1a1a1a;
		color: #fff;
	}
	.header__banner-track {
		height: 160px;
		animation: banner-scroll 13.6s infinite;
		will-change: transform;
	}
	@media (prefers-reduced-motion: reduce) {
		.header__banner-track {
			animation: none;
		}
	}
	.header__banner-slide {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		font-size: var(--font-size-sm);
		text-align: center;
		padding-inline: var(--spacing-4);
	}

	/* Top utility bar */
	.header__topbar {
		display: none;
		background-color: var(--color-background);
		border-bottom: 1px solid var(--color-border);
	}
	.header__topbar-inner {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 36px;
	}
	.header__topbar-nav {
		display: flex;
		align-items: center;
	}
	.header__topbar-link {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		padding-inline: var(--spacing-3);
		transition: color var(--transition-fast);
	}
	.header__topbar-link:hover {
		color: var(--color-accent);
	}
	.header__topbar-link + .header__topbar-link::before {
		content: '|';
		color: var(--color-border);
		margin-right: var(--spacing-3);
		pointer-events: none;
	}

	/* Main row */
	.header__main-inner {
		display: flex;
		align-items: center;
		height: 64px;
		gap: var(--spacing-2);
	}
	.header__logo {
		font-size: var(--font-size-xl);
		font-weight: 700;
		color: var(--color-primary);
		flex-shrink: 0;
		margin-right: auto;
		transition: opacity var(--transition-fast);
	}
	.header__logo:hover {
		opacity: 0.8;
	}

	/* Desktop search */
	.header__search {
		display: none;
		max-width: 480px;
		align-items: center;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		height: 44px;
		padding-inline: var(--spacing-4);
		transition: border-color var(--transition-fast);
	}
	.header__search:focus-within {
		border-color: var(--color-accent);
	}
	.header__search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: var(--font-size-sm);
		background: transparent;
		color: var(--color-text);
		min-width: 0;
	}
	.header__search-input::placeholder {
		color: var(--color-text-muted);
	}
	.header__search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
		flex-shrink: 0;
	}
	.header__search-btn:hover {
		color: var(--color-accent);
	}

	/* Expandable search (mobile) */
	.header__search-expand {
		border-top: 1px solid var(--color-border);
		padding-block: var(--spacing-3);
	}
	.header__search-expand-form {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
	}
	.header__search-expand-input {
		flex: 1;
		height: 44px;
		padding-inline: var(--spacing-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		font-size: var(--font-size-sm);
		color: var(--color-text);
		background-color: var(--color-background);
		outline: none;
		transition: border-color var(--transition-fast);
	}
	.header__search-expand-input:focus {
		border-color: var(--color-accent);
	}
	.header__search-expand-input::placeholder {
		color: var(--color-text-muted);
	}
	.header__search-expand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		color: var(--color-text-muted);
		flex-shrink: 0;
		transition: color var(--transition-fast);
	}
	.header__search-expand-btn:hover {
		color: var(--color-accent);
	}

	/* Action icons */
	.header__actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		flex-shrink: 0;
	}
	.header__action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		font-size: 1.25rem;
		color: var(--color-text);
		transition: color var(--transition-fast);
		flex-shrink: 0;
	}
	.header__action-btn:hover {
		color: var(--color-accent);
	}
	.header__action-btn--cart {
		position: relative;
	}
	.header__cart-badge {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 18px;
		height: 18px;
		border-radius: var(--radius-full);
		background-color: var(--color-accent);
		color: #fff;
		font-size: var(--font-size-xs);
		font-weight: 700;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Category nav */
	.header__nav {
		display: none;
	}
	.header__nav-list {
		display: flex;
		gap: var(--spacing-6);
		padding-block: var(--spacing-4);
		list-style: none;
	}
	.header__nav-item {
		position: relative;
	}
	.header__nav-item--separator {
		margin-left: auto;
	}
	.header__nav-link {
		display: flex;
		align-items: center;
		gap: var(--spacing-1);
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--color-text);
		padding-block: var(--spacing-3);
		transition: color var(--transition-fast);
		white-space: nowrap;
	}
	.header__nav-link:hover {
		color: var(--color-accent);
	}
	.header__nav-caret {
		font-size: 0.75rem;
		transition: transform var(--transition-fast);
		display: inline-flex;
	}
	.header__nav-item--has-children:hover .header__nav-caret {
		transform: rotate(180deg);
	}
	.header__nav-dropdown {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 160px;
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-base);
		box-shadow: var(--shadow-base);
		padding-block: var(--spacing-2);
		z-index: 100;
	}
	.header__nav-item--has-children:hover .header__nav-dropdown {
		display: block;
	}
	.header__nav-dropdown-link {
		display: block;
		padding: var(--spacing-2) var(--spacing-4);
		font-size: var(--font-size-sm);
		color: var(--color-text);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
		white-space: nowrap;
	}
	.header__nav-dropdown-link:hover {
		background-color: var(--color-surface);
		color: var(--color-accent);
	}

	/* Drawer */
	.header__drawer {
		position: fixed;
		inset: 0;
		z-index: 400;
	}
	.header__drawer-backdrop {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.header__drawer-inner {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 300px;
		max-width: 85vw;
		background-color: #f9f8f6;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}
	.header__drawer-close {
		align-self: flex-end;
		padding: var(--spacing-4);
		font-size: 1.25rem;
		color: var(--color-text);
		transition: color var(--transition-fast);
	}
	.header__drawer-close:hover {
		color: var(--color-accent);
	}
	.header__drawer-nav {
		flex: 1;
		padding-inline: var(--spacing-4);
	}
	.header__drawer-nav-list {
		list-style: none;
	}
	.header__drawer-nav-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding-block: var(--spacing-4);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--font-size-base);
		color: var(--color-text);
		transition: color var(--transition-fast);
		text-align: left;
	}
	.header__drawer-nav-link:hover {
		color: var(--color-accent);
	}
	.header__drawer-nav-item--separator {
		margin-top: var(--spacing-4);
	}
	.header__drawer-nav-caret {
		font-size: 0.875rem;
		transition: transform var(--transition-fast);
		flex-shrink: 0;
		display: inline-flex;
	}
	.header__drawer-nav-item--open .header__drawer-nav-caret {
		transform: rotate(180deg);
	}
	.header__drawer-nav-children {
		display: none;
		padding-left: var(--spacing-4);
	}
	.header__drawer-nav-item--open .header__drawer-nav-children {
		display: block;
	}
	.header__drawer-nav-child-link {
		display: block;
		padding-block: var(--spacing-3);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
	}
	.header__drawer-nav-child-link:hover {
		color: var(--color-accent);
	}
	.header__drawer-utils {
		padding: var(--spacing-4);
		border-top: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}
	.header__drawer-util-link {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
	}
	.header__drawer-util-link:hover {
		color: var(--color-text);
	}

	/* Desktop breakpoint */
	@media (min-width: 1200px) {
		.header__topbar {
			display: block;
		}
		.header__main-inner {
			display: grid;
			grid-template-columns: 160px 1fr 160px;
			gap: var(--spacing-4);
		}
		.header__logo {
			margin-right: 0;
		}
		.header__search {
			display: flex;
			width: 100%;
			margin-inline: auto;
		}
		.header__actions {
			justify-content: flex-end;
		}
		.header__action-btn--hamburger {
			display: none;
		}
		.header__action-btn--search {
			display: none;
		}
		.header__nav {
			display: block;
		}
	}
</style>

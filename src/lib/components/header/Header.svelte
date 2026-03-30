<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { cart } from '$lib/stores/cart.svelte';
	import { categories } from '$lib/data/categories';

	let mobileMenuOpen = $state(false);

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function isActive(path: string): boolean {
		return page.url.pathname.startsWith(path);
	}
</script>

<header class="sticky top-0 z-(--z-sticky) bg-white border-b border-(--color-border)">
	<!-- Top bar -->
	<div class="hidden md:flex justify-end gap-4 px-6 py-1.5 bg-neutral-100 text-xs text-(--color-text-muted)">
		<a href="{base}/auth/login/" class="hover:text-(--color-text)">Sign In</a>
		<a href="{base}/auth/register/" class="hover:text-(--color-text)">Register</a>
		<a href="{base}/my/" class="hover:text-(--color-text)">My Page</a>
		<a href="{base}/board/notices/" class="hover:text-(--color-text)">Support</a>
	</div>

	<!-- Main header -->
	<div class="flex items-center justify-between gap-4 px-4 md:px-6 h-14 max-w-(--container-max) mx-auto">
		<a href="{base}/" class="text-lg font-bold tracking-tight shrink-0">E-Commerce</a>

		<!-- Desktop nav -->
		<nav class="hidden md:flex items-center gap-6 text-sm" aria-label="Main navigation">
			{#each categories as cat}
				<a
					href="{base}/products/?category={cat.slug}"
					class="py-1 hover:text-(--color-accent) transition-colors duration-(--transition-fast)"
					class:text-accent={isActive(`${base}/products`)}
				>
					{cat.name}
				</a>
			{/each}
			<a href="{base}/event/" class="py-1 hover:text-(--color-accent) transition-colors duration-(--transition-fast)">Events</a>
		</nav>

		<!-- Actions -->
		<div class="flex items-center gap-3">
			<a href="{base}/search/" class="p-2 hover:bg-neutral-100 rounded-(--radius-base)" aria-label="Search">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
			</a>

			<a href="{base}/cart/" class="relative p-2 hover:bg-neutral-100 rounded-(--radius-base)" aria-label="Cart">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
				{#if cart.mounted && cart.count > 0}
					<span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-(--color-accent) rounded-full px-1">
						{cart.count}
					</span>
				{/if}
			</a>

			<button
				class="md:hidden p-2 hover:bg-neutral-100 rounded-(--radius-base)"
				onclick={toggleMenu}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
				{/if}
			</button>
		</div>
	</div>

	{#if mobileMenuOpen}
		<nav class="md:hidden border-t border-(--color-border) bg-white" aria-label="Mobile navigation">
			<div class="py-2">
				{#each categories as cat}
					<a href="{base}/products/?category={cat.slug}" class="block px-6 py-3 text-sm hover:bg-neutral-50" onclick={toggleMenu}>{cat.name}</a>
				{/each}
				<a href="{base}/event/" class="block px-6 py-3 text-sm hover:bg-neutral-50" onclick={toggleMenu}>Events</a>
				<div class="border-t border-(--color-border) mt-2 pt-2">
					<a href="{base}/auth/login/" class="block px-6 py-3 text-sm hover:bg-neutral-50" onclick={toggleMenu}>Sign In</a>
					<a href="{base}/my/" class="block px-6 py-3 text-sm hover:bg-neutral-50" onclick={toggleMenu}>My Page</a>
				</div>
			</div>
		</nav>
	{/if}
</header>

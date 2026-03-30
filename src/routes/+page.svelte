<script lang="ts">
	import Category from '$lib/components/category/Category.svelte';
</script>

<svelte:head>
	<title>E-Commerce — SvelteKit Boilerplate</title>
	<meta property="og:title" content="E-Commerce — SvelteKit Boilerplate" />
</svelte:head>

<section class="home-category container">
	<Category />
</section>

<style>
	.home-category {
		padding-block: clamp(2rem, 5vw, 3rem);
	}
</style>

<script lang="ts">
	import BannerCarousel from '$lib/components/banner/Carousel.svelte';
	import Category from '$lib/components/category/Category.svelte';
</script>

<svelte:head>
	<title>E-Commerce — SvelteKit Boilerplate</title>
	<meta property="og:title" content="E-Commerce — SvelteKit Boilerplate" />
</svelte:head>

<section class="home-banner-slot">
	<BannerCarousel />
</section>

<section class="home-category container">
	<Category />
</section>

<style>
	.home-banner-slot {
		background-color: #f9f8f6;
	}
	.home-category {
		padding-block: clamp(2rem, 5vw, 3rem);
	}
</style>

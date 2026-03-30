<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="E-Commerce frontend boilerplate — SvelteKit + Tailwind CSS" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="E-Commerce" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

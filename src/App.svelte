<script>
	import Header from './components/Header.svelte';
	import Menu from './components/Menu.svelte';
</script>

<Menu />

<main>
	<Header />
</main>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
	body {
		padding: 0;
	}
</style>

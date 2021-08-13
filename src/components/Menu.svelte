<script>
	import { menu } from '../stores/menu';
</script>

<div id="menu" class="menu" class:open={$menu}>
	<div
		class="
						absolute
						top-0
						right-0
						cursor-pointer
						flex flex-col
						p-6
					"
		on:click={menu.toggle}
	>
		<svg class="fill-current text-gray-50 h-8" viewBox="0 0 24 24">
			<path
				d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"
			/>
		</svg>
	</div>
	<div class="text-gray-50 flex flex-col text-4xl space-y-8">
		<h2><a href="">Proyects</a></h2>
		<h2><a href="">About me</a></h2>
		<h2><a href="">Contact me</a></h2>
	</div>
	<div class="text-gray-50 flex flex-col text-2xl space-y-6">
		<h3><a href="">Behance</a></h3>
		<h3><a href="">LinkedIn</a></h3>
		<h3><a href="">Polywork</a></h3>
	</div>
</div>

<style>
	.menu {
		@apply w-0 h-0 overflow-hidden fixed  z-40 overflow-x-hidden whitespace-nowrap right-0 bg-black;
		transition: width 0.5s cubic-bezier(0.22, 0.68, 0, 1.71),
			height 0.4s cubic-bezier(0.22, 0.68, 0, 1.71);
	}

	.open {
		@apply w-full;
		height: 100vh;
	}
</style>

<script>
	import { menu } from '$lib/stores/menu';
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

	<div class=" flex flex-col md:flex-row md:justify-between ">
		<div
			class=" flex flex-col mt-40 md:mt-28 text-gray-50 font-serif font-semibold"
		>
			<div class=" text-4xl lg:text-5xl space-y-8 ml-8 ">
				<h2>Proyects</h2>
				<h2>About me</h2>
				<h2>Contact me</h2>
			</div>
			<div class=" text-2xl lg:text-3xl space-y-6 ml-8 mt-8 ">
				<h3>Behance</h3>
				<h3>LinkedIn</h3>
				<h3>Polywork</h3>
			</div>
		</div>

		<div class=" flex justify-end m-12 md:mt-28">
			<img
				class=" object-contain h-36 w-36 animate-spin-slow"
				src="/assets/stamp.svg"
				alt="Stamp"
			/>
		</div>
	</div>
</div>

<style>
	.menu {
		@apply w-0 h-0 overflow-hidden fixed  z-40 overflow-x-hidden whitespace-nowrap right-0 bg-gray-900;
		transition: width 0.5s cubic-bezier(0.22, 0.68, 0, 1.71),
			height 0.4s cubic-bezier(0.22, 0.68, 0, 1.71);
	}

	.open {
		@apply w-full;
		height: 100vh;
	}
</style>

<!-- Title and filters -->
<script context="module">
	import { types, work } from '$lib/posts/work';

	export const load = ({ page }) => {
		console.log(page);
		let filter = page.params.filter;
		return {
			props: {
				filter,
				posts:
					filter === 'all' ? work : work.filter((post) => post.type === filter),
			},
		};
	};
</script>

<script>
	export let filter, posts;
</script>

<div class=" md:grid md:grid-cols-3 md:justify-between ">
	<!-- First Object (Pocky Pop) -->
	{#each posts as { title, type, img: { src, alt } }, i (i)}<div
			class=" flex flex-col text-center font-serif text-lg lg:text-xl mt-8"
		>
			<img class="object-cover h-96 md:h-64 lg:h-80 m-8" {src} {alt} />
			<h2 class="font-bold ">{title}</h2>
			<h2 class="">{types[type]}</h2>
		</div>{/each}
</div>

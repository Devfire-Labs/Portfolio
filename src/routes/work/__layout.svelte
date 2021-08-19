<script>
  import { each } from "svelte/internal";
  const options = [
    { name: "All", value: "all" },
    { name: "UI/UX", value: "ui-ux" },
    { name: "Branding", value: "branding" },
    { name: "Web", value: "web" },
  ];
  let active = "all";
  const changeActive = (value) => (active = value);
</script>

<header>
  <div class=" flex flex-col ml-8 my-20 font-serif">
    <h1 class=" text-5xl md:text-6xl lg:text-7xl font-semibold text-red-400">
      Work
    </h1>
    <div class=" flex flex-row text-2xl mt-4">
      {#each options as { name, value }, i (i)}
        <a
          on:click={() => changeActive(value)}
          id={value}
          href="/work/{value}"
          class:text-red-400={active === value}
          class:ml-4={i > 0}>{name}</a
        >
      {/each}
    </div>
  </div>
</header>

<slot />

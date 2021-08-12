<script>
  import Header from "./components/Header.svelte";
  import Menu from "./components/Menu.svelte";
  export let name;
</script>

<main>
  <Menu />
  <Header />
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

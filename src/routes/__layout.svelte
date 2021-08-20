<script>
  import "../app.postcss";
  import Menu from "$lib/components/Menu.svelte";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<Menu />

<main>
  <Header />
  <slot />
  <Footer />
</main>

<style lang="postcss" global>
  body {
    @apply bg-gray-50 transition duration-700 ease-in-out;
  }
</style>

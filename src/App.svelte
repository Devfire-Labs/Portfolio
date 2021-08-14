<script>
  import Header from "./components/Header.svelte";
  import Menu from "./components/Menu.svelte";
  import Home from "./pages/Home.svelte";
  import Footer from "./components/Footer.svelte";
</script>

<Menu />

<main>
  <Header />
  <Home />
  <Footer />
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  body {
    padding: 0;
  }
</style>

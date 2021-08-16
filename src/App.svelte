<script>
  import Header from "./components/Header.svelte";
  import Menu from "./components/Menu.svelte";
  import Home from "./pages/Home.svelte";
  import Footer from "./components/Footer.svelte";
  import Work from "./pages/Work.svelte";
  import About from "./pages/About.svelte";
  import Contact from "./pages/Contact.svelte";
</script>

<Menu />

<main>
  <Header />
  <Work />
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

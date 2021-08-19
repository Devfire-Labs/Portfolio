<!-- Title and filters -->
<script context="module">
  import { work } from "$lib/posts/work";

  export const load = ({ page }) => {
    console.log(page);
    let filter = page.params.filter;
    return {
      props: {
        filter,
        posts:
          filter === "" ? work : work.filter((post) => post.type === filter),
      },
    };
  };
</script>

<script>
  export let filter, posts;
  console.log("Posts:", posts);
</script>

<div class=" md:grid md:grid-cols-3 md:justify-between ">
  <!-- First Object (Pocky Pop) -->
  <div class=" flex flex-col text-center font-serif text-lg lg:text-xl mt-8">
    <img
      class="object-cover h-96 md:h-64 lg:h-80 m-8"
      src="/assets/img1.png"
      alt="Pocky Pop"
    />
    <h2 class="font-bold ">Pocky Pop</h2>
    <h2>Branding</h2>
  </div>

  <!-- Second Object (House App) -->
  <div class=" flex flex-col text-center font-serif text-lg lg:text-xl mt-8">
    <img
      class="object-cover h-96 md:h-64 lg:h-80 m-8"
      src="/assets/img2.png"
      alt="House Marketplace"
    />
    <h2 class="font-bold ">House Marketplace App</h2>
    <h2>UI/UX Design</h2>
  </div>

  <!-- Third Object (Pouf Co) -->
  <div class=" flex flex-col text-center font-serif text-lg lg:text-xl mt-8">
    <img
      class="object-cover h-96 md:h-64 lg:h-80 m-8"
      src="/assets/img5.png"
      alt="Pouf Co Website"
    />
    <h2 class="font-bold ">Pouf Co Website</h2>
    <h2>UI Design, Web Design</h2>
  </div>

  <!-- Fourth Object (Silvestre) -->
  <div class=" flex flex-col text-center font-serif text-lg lg:text-xl mt-8">
    <img
      class="object-cover h-96 md:h-64 lg:h-80 m-8"
      src="/assets/img6.png"
      alt="Silvestre Meat Packing"
    />
    <h2 class="font-bold ">Meat Packing by Silvestre</h2>
    <h2>Branding</h2>
  </div>

  <!-- Fifth Object (Wendy) -->
  <div
    class=" flex flex-col text-center font-serif text-lg mt-8 lg:text-xl mb-12"
  >
    <img
      class="object-cover h-96 md:h-64 lg:h-80 m-8"
      src="/assets/img7.png"
      alt="Pouf Co Website"
    />
    <h2 class="font-bold ">Doña Wendy Bocadillos</h2>
    <h2>Branding</h2>
  </div>
</div>

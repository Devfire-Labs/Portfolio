<script>
  import { menu } from "../stores/menu";
</script>

<!-- Title -->
<header>
  <div
    class=" flex flex-col text-5xl ml-8 my-20 font-serif font-semibold text-red-400"
  >
    <h1>UI/UX & Branding</h1>
  </div>
</header>

<!-- First Object (Pocky Pop) -->
<div>
  <div class=" flex flex-col text-center font-serif text-lg">
    <img class="object-cover h-96 m-8" src="/assets/img1.png" alt="Pocky Pop" />
    <h2 class="font-bold ">Pocky Pop</h2>
    <h2>Branding</h2>
  </div>

  <!-- Second Object (App) -->
  <div class=" flex flex-col text-center font-serif text-lg mt-8">
    <img
      class="object-cover h-96 m-8"
      src="/assets/img2.png"
      alt="House Marketplace"
    />
    <h2 class="font-bold ">House Marketplace</h2>
    <h2>UI/UX Design</h2>
  </div>

  <!-- Third Object (Web) -->
  <div class=" flex flex-col text-center font-serif text-lg mt-8">
    <img
      class="object-cover h-96 m-8"
      src="/assets/img5.png"
      alt="Pouf Co Website"
    />
    <h2 class="font-bold ">Pouf Co Website</h2>
    <h2>UI Design, Web Design</h2>
  </div>

  <!-- More Button Circle -->
  <div class="flex justify-center mt-4">
    <div
      class=" flex flex-col text-center rounded-full h-32 w-32 justify-center border-red-400 border-2 font-serif font-bold m-8"
    >
      More
    </div>
  </div>

  <!-- About Object -->
  <div class="flex flex-col mx-8 my-8 font-serif">
    <h1 class=" text-5xl font-semibold text-gray-900 ">Why Prota?</h1>
    <p class=" text-lg my-2 ">
      I’m a creative soul, specialized in Branding and UI/UX design. I always
      focus on the user experience first
    </p>
    <div class=" flex">
      <h2 class=" text-2xl font-semibold text-red-400">Get to know me more</h2>
      <svg
        class="fill-current text-red-400 h-8 w-6 ml-1 "
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.17 13L15.59 15.59L17 17L22 12L17 7L15.59 8.41L18.17 11H2V13H18.17Z"
        />
      </svg>
    </div>
    <img class=" object-cover h-40 my-4" src="/assets/img3.png" alt="Me" />
  </div>

  <!-- Contact Object -->
  <div class="flex flex-col mx-8 mt-8 mb-12 font-serif">
    <img
      class=" object-cover h-40 my-4"
      src="/assets/img4.png"
      alt="Contact Me"
    />
    <h1 class=" text-4xl font-semibold text-gray-900 ">
      Tell me about your project
    </h1>
    <div class=" flex my-2">
      <h2 class=" text-2xl font-semibold text-red-400">If you want to ;)</h2>
      <svg
        class="fill-current text-red-400 h-8 w-6 ml-1 "
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.17 13L15.59 15.59L17 17L22 12L17 7L15.59 8.41L18.17 11H2V13H18.17Z"
        />
      </svg>
    </div>
  </div>
</div>

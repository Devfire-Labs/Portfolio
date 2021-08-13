<script>
  import { menu } from "../stores/menu";
</script>

<header class="bg-gray-50 relative h-24 flex justify-between pt-6">
  <div
    class="mx-4 my-4 px-4 flex items-center space-x-2 modal-open"
    on:click={menu.toggle}
  >
    <svg
      viewBox="0 0 80 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="fill-current text-ProtaBlack h-4"
    >
      <path
        d="M79.5746 57H0V42.75H79.5746V57ZM48.6289 14.25H0V0H48.6289V14.25Z"
      />
    </svg>
    <a class="text-gray-900" href="">Menu</a>
  </div>
  <div class="mx-4 my-4 px-4 text-center flex items-center">
    <img
      class=" object-contain h-10 w-full"
      src="/assets/logo1.svg"
      alt="Logo"
    />
  </div>
</header>

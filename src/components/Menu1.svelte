<script>
  import { menu } from "../stores/menu";
  // var openmodal = document.querySelectorAll(".modal-open");
  // for (var i = 0; i < openmodal.length; i++) {
  //   openmodal[i].addEventListener("click", function (event) {
  //     event.preventDefault();
  //     toggleModal();
  //   });
  // }

  // const overlay = document.querySelector(".modal-overlay");
  // overlay.addEventListener("click", toggleModal);

  // var closemodal = document.querySelectorAll(".modal-close");
  // for (var i = 0; i < closemodal.length; i++) {
  //   closemodal[i].addEventListener("click", toggleModal);
  // }

  // document.onkeydown = function (evt) {
  //   evt = evt || window.event;
  //   var isEscape = false;
  //   if ("key" in evt) {
  //     isEscape = evt.key === "Escape" || evt.key === "Esc";
  //   } else {
  //     isEscape = evt.keyCode === 27;
  //   }
  //   if (isEscape && document.body.classList.contains("modal-active")) {
  //     toggleModal();
  //   }
  // };

  // function toggleModal() {
  //   const body = document.querySelector("body");
  //   const modal = document.querySelector(".modal");
  //   modal.classList.toggle("opacity-0");
  //   modal.classList.toggle("pointer-events-none");
  //   body.classList.toggle("modal-active");
  // }
</script>

<div
  class="
				modal
				fixed
				w-full
				h-full
				top-0
				left-0
				flex
				items-center
				justify-center
			"
  class:opacity-0={!$menu}
  class:pointers-events-none={!$menu}
>
  <div
    class="modal-overlay absolute w-full h-full bg-gray-900 opacity-100"
    on:click={menu.toggle}
  />

  <div
    class="
					modal-container
					fixed
					w-full
					h-full
					z-50
					overflow-y-auto overflow-x-hidden
				"
  >
    <div
      class="
						modal-close
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

    <div class="modal-content container ml-4 my-4 pl-4 pt-24 space-y-8">
      <!-- Menu content -->
      <div class="text-gray-50 flex flex-col text-4xl space-y-8">
        <h2><a href="">Proyects</a></h2>
        <h2><a href="">About me</a></h2>
        <h2><a href="">Contact me</a></h2>
      </div>

      <div class="text-gray-50 flex flex-col text-2xl space-y-6">
        <h3><a href="">Behance</a></h3>
        <h3><a href="">LinkedIn</a></h3>
        <h3><a href="">Polywork</a></h3>
      </div>

      <div class="flex justify-end mr-8 pr-2">
        <img
          class=" object-contain h-20 w-full animate-spin "
          src="/assets/stamp.svg "
          alt="Stamp"
        />
      </div>
    </div>
  </div>
</div>

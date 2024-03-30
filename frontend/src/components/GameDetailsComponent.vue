<template>
    <div v-if="selectedGame" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
      <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
          <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
            viewBox="0 0 18 18">
            <path
              d="M18 1.5L16.5 0 9 7.5 1.5 0 0 1.5 7.5 9 0 16.5 1.5 18 9 10.5 16.5 18 18 16.5 10.5 9 18 1.5z" />
          </svg>
          <span class="text-sm">(esc)</span>
        </div>
  
        <!-- Add your game details here -->
        <div class="modal-content py-4 text-left px-6">
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold">Game Technical Sheet</p>
            <div class="modal-close cursor-pointer z-50">
              <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                viewBox="0 0 18 18">
                <path
                  d="M18 1.5L16.5 0 9 7.5 1.5 0 0 1.5 7.5 9 0 16.5 1.5 18 9 10.5 16.5 18 18 16.5 10.5 9 18 1.5z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">{{ selectedGame.nombre }}</h3>
            <p class="text-gray-700">{{ selectedGame.descripcion }}</p>
            <p class="mt-4 text-gray-700">Price: {{ selectedGame.price }} SOL</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      selectedGame: {
        type: Object,
        default: null
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      }
    },
    mounted() {
      // Close modal on pressing ESC key
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      });
    },
    beforeUnmount() {
      // Remove event listener before component unmounts
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      });
    }
  }
  </script>
  
  <style scoped>
  /* Add your custom styles for the modal here */
  .modal {
    z-index: 1000;
  }
  
  .modal-overlay {
    z-index: 1001;
  }
  
  .modal-container {
    z-index: 1002;
  }
  
  .modal-close {
    z-index: 1003;
  }
  </style>
  
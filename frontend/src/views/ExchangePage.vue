<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">

    <div class="w-full max-w-3xl mt-20 flex flex-col items-center gap-6"> 
      <h2 class="text-lg font-semibold" style="color: #7eacb5; font-family: 'Poppins', sans-serif;font-size: 23px;">
        Seleziona uno dei tuoi oggetti da scambiare
      </h2>

     <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

  <router-link to="/NewListing" class="rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200"
    style="background-color: #7eacb5">
    <div class="w-full aspect-square flex flex-col items-center justify-end p-9.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24"
        stroke="rgb(255, 244, 234)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <!-- <h3 class="text-sm font-medium text-center" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
        Aggiungi nuovo listing
      </h3> -->
    </div>
  </router-link>

  <div v-for="(listing, index) in myListings" :key="index" @click="selectListing(index)"
    class="rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200" :style="{
      'border': selectedIndex === index ? '3px solid #c96868' : '3px solid transparent',
      'background-color': '#7eacb5'
    }">
    <img :src="listing.image" class="w-full aspect-square object-cover" :alt="listing.title" />
    <div class="p-2">
      <h3 class="text-sm font-medium truncate" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
        {{ listing.title }}
      </h3>
    </div>
  </div>
</div>

      <button
        @click="proposeExchange"
        :disabled="selectedIndex === null"
        class="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: #c96868; color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 500;"
      >
        Proponi Scambio
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock data - lista dei propri listing
const myListings = ref([
  { 
    id: 1,
    title: 'Sedia vintage 1', 
    image: 'https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg',
    description: 'Sedia in legno con tessuto originale anni 60' 
  },
  { 
    id: 2,
    title: 'Lampada industriale 1', 
    image: 'https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg',
    description: 'Lampada stile industriale in metallo' 
  },
  { 
    id: 3,
    title: 'Vaso in ceramica 1', 
    image: 'https://www.artelegnoshop.it/wp-content/uploads/2020/10/CL32.11-ciotola1-in-legno-di-ulivo.jpg',
    description: 'Vaso artigianale dipinto a mano' 
  },

  { 
    id: 5,
    title: 'Sedia vintage 2', 
    image: 'https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg',
    description: 'Sedia in legno con tessuto originale anni 60' 
  },
  { 
    id: 6,
    title: 'Lampada industriale', 
    image: 'https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg',
    description: 'Lampada stile industriale in metallo' 
  },
  { 
    id: 7,
    title: 'Vaso in ceramica', 
    image: 'https://www.artelegnoshop.it/wp-content/uploads/2020/10/CL32.11-ciotola1-in-legno-di-ulivo.jpg',
    description: 'Vaso artigianale dipinto a mano' 
  },
 
  
]);

const selectedIndex = ref(null);

const selectListing = (index) => {
  selectedIndex.value = index;
};

const proposeExchange = () => {
  if (selectedIndex.value !== null) {
    const selectedListing = myListings.value[selectedIndex.value];
    // console.log('Proposta di scambio con:', selectedListing);
    
  }
};


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>
<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <!-- Pulsanti fissi in alto -->
    <div class="fixed top-22 left-1 right-1 z-50">
      <!-- Tasto Home a sinistra -->
      <div class="absolute left-4">
        <router-link to="/">
          <button class="p-2 rounded-full" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </router-link>
      </div>
      
      <!-- Tasti a destra (Edit Profile e Settings) -->
      <div class="absolute right-4 flex flex-col gap-2">
        <!-- Tasto Settings (3 puntini verticali) -->
        <router-link to="/Settings">
          <button class="p-2 rounded-full" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </router-link>
        <!-- Tasto Edit Profile -->
        <router-link to="/EditProfile">
          <button class="p-2 rounded-full" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </router-link>
        
        
      </div>
    </div>

    <!-- Container principale centrato -->
    <div class="w-full max-w-4xl rounded-xl shadow-xl overflow-hidden mt-16" style="background-color: #7eacb5">
      <!-- Sezione superiore -->
      <div class="p-6 flex flex-col md:flex-row gap-24">
        <!-- Colonna sinistra (foto e username) -->
        <div class="flex flex-col items-center md:items-start w-full md:w-1/3 ml-15">
          <div class="relative md:-ml-4 -mt-16">
            <img
              :src="profilePhoto"
              class="w-32 h-32 rounded-full border-4 shadow-lg"
              style="border-color: rgb(255, 244, 234);"
              alt="Foto profilo"
            />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-center md:text-left" 
              style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">
            {{ username }}
          </h2>
        </div>

        <!-- Colonna destra (statistiche e note) -->
        <div class="w-full md:w-2/3">
          <!-- Statistiche -->
          <div class="flex justify-center mb-3">
            <div class="text-center" style="margin-right: 60px;">
              <p class="text-3xl font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">42</p>
              <p class="text-sm" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">Scambi</p>
            </div>
            <div class="text-center" style="margin-right: 60px;">
              <p class="text-3xl font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">128</p>
              <p class="text-sm" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">Followers</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">75</p>
              <p class="text-sm" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">Seguiti</p>
            </div>
          </div>

          <!-- Note -->
          <div class="mb-6">
            <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 500;">Note</label>
            <textarea
              class="w-full p-3 border rounded-lg focus:outline-none"
              style="border-color: rgb(255, 244, 234); min-height: 100px; background-color: rgba(255, 244, 234, 0.2); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
              placeholder="Scrivi qualcosa su di te..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Menu di navigazione -->
      <div class="flex justify-center border-t mt-6" style="border-color: rgba(255, 244, 234, 0.3)">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-3 font-medium transition-colors"
            :class="{
              'text-white border-b-2 border-white': activeTab === tab.id,
              'text-white/70 hover:text-white': activeTab !== tab.id
            }"
            style="font-family: 'Poppins', sans-serif"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sezione inferiore -->
    <div class="w-full max-w-4xl px-6 py-8">
     <!-- Vetrina -->
<div v-if="activeTab === 'showcase'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5 justify-items-center">
  <!-- Pulsante Aggiungi -->
  <router-link to="/NewListing" class="w-full aspect-square max-w-[200px] sm:max-w-[240px]">
    <div class="h-full flex items-center justify-center rounded-lg shadow-md transition-transform hover:transform hover:-translate-y-1 cursor-pointer" 
         style="background-color: #7eacb5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </div>
  </router-link>

  <!-- Listings esistenti -->
  <div 
    v-for="listing in listings" 
    :key="listing._id" 
    class="w-full aspect-square max-w-[200px] sm:max-w-[240px] rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1" 
    style="background-color: #7eacb5"
  >
    <img 
      :src="listing.images[0]" 
      class="w-full h-full object-cover" 
      :alt="listing.title"
    />
  </div>
</div>

      <!-- Recensioni -->
      <div v-if="activeTab === 'reviews'" class="flex flex-col gap-y-4">
        <div v-if="reviews.length === 0" class="text-center py-8">
          <p style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Nessuna recensione disponibile</p>
        </div>
        <div 
          v-for="review in reviews" 
          :key="review._id" 
          @click="openReview(review)"
          class="p-5 rounded-lg shadow cursor-pointer hover:shadow-lg transition-all mb-6"
          style="background-color: #7eacb5"
        >
          <div class="flex items-center mb-2">
            <span class="font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 600;">{{ review.author }}</span>
          </div>
          <p style="color: rgba(255, 244, 234, 0.8); font-family: 'Poppins', sans-serif; font-weight: 300;">{{ review.comment }}</p>
        </div>
      </div>

      <!-- Preferiti -->
      <div v-if="activeTab === 'favorites'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        <div v-if="favorites.length === 0" class="col-span-full text-center py-8">
          <p style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Nessun preferito disponibile</p>
        </div>
        <div
          v-for="fav in favorites"
          :key="fav._id"
          @click="openFavorite(fav)"
    class="w-full aspect-square max-w-[240px] sm:max-w-[240px] rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1" 
          style="background-color: #7eacb5"
        >
          <img :src="fav.images[0]" class="w-full h-full object-cover" />
          <div >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Aggiunge il font Poppins al documento
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

// Dati utente
const username = ref('Username')
const profilePhoto = ref('https://preview.redd.it/the-tiger-from-kpop-demon-hunter-v0-g0nozaxp258f1.jpg?width=640&crop=smart&auto=webp&s=2f60188b633d591fb9baac139d10ffb679351525') 

// Tab attiva
const tabs = [
  { id: 'showcase', label: 'Vetrina' },
  { id: 'reviews', label: 'Recensioni' },
  { id: 'favorites', label: 'Preferiti' }
]
const activeTab = ref('showcase')

// Dati mock 
//se le vuoi togliere metti [] non togliere tutto
const listings = ref([
  { _id: '1', title: 'Prodotto 1', description: 'Descrizione prodotto 1', images: ['https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg'] },
  { _id: '2', title: 'Prodotto 2', description: 'Descrizione prodotto 2', images: ['https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg'] },
  { _id: '3', title: 'Prodotto 3', description: 'Descrizione prodotto 3', images: ['https://www.artelegnoshop.it/wp-content/uploads/2020/10/CL32.11-ciotola1-in-legno-di-ulivo.jpg'] }
])

const reviews = ref([
  { _id: '1', author: 'Utente 1', comment: 'Ottimo scambio! Persona molto affidabile e prodotto come descritto.' },
  { _id: '2', author: 'Utente 2', comment: 'Consigliatissimo. Tutto perfetto e tempi di consegna rapidi.' },
  { _id: '3', author: 'Utente 3', comment: 'Buon scambio, ma potrebbe migliorare la comunicazione' }
])

const favorites = ref([
  { _id: '1', title: 'Sedia design', description: 'Sedia in legno con tessuto elegante', images: ['https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg'] },
  { _id: '2', title: 'Tavolo moderno', description: 'Tavolo in legno massello con finitura lucida', images: ['https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg'] }
])

// Verifica se l'utente è il proprietario del profilo
function isAuthor() {
  return localStorage.getItem('userId') === route.params.id
}

function openReview(review) {
  console.log('Apri recensione:', review)
}

function openFavorite(favorite) {
  console.log('Apri preferiti:', favorite)
}

onMounted(() => {
  console.log('ID utente dalla route:', route.params.id)
})
</script>

<style scoped>
/* Transizioni per i tab */
button {
  transition: all 0.2s ease;
}

/* Stile per le card */
.rounded-lg {
  transition: transform 0.2s ease;
}
.cursor-pointer {
  cursor: pointer;
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
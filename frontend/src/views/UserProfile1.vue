<template>
  <div class="min-h-screen flex flex-col items-center p-4" style="background-color: rgb(255, 244, 234)">
    <!-- Container principale centrato -->
    <div class="w-full max-w-4xl rounded-xl shadow-xl overflow-hidden" style="background-color: #7eacb5">
      <!-- Sezione superiore - Riduciamo il gap a 4 (gap-4) -->
      <div class="p-6 flex flex-col md:flex-row gap-24"> <!-- Modificato da gap-24 a gap-4 -->
        <!-- Colonna sinistra (foto e username) - Aggiustiamo il margine negativo -->
        <div class="flex flex-col items-center md:items-start w-full md:w-1/3 ml-15">
          <div class="relative md:-ml-4 -mt-16"> <!-- Aggiunto md:-ml-4 per avvicinare a destra -->
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

          <!-- Pulsante modifica -->
          <div v-if="isAuthor()" class="flex justify-end">
            <router-link to="/EditProfile">
              <button
                class="px-4 py-2 rounded-lg font-bold transition duration-300 hover:opacity-90"
                style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;"
              >
                Modifica Profilo
              </button>
            </router-link>
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
      <div v-if="activeTab === 'showcase'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        <div v-for="listing in listings" :key="listing._id" class="w-full max-w-xs rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1" style="background-color: #7eacb5">
          <img :src="listing.listing_url[0]" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h3 class="font-bold text-center" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">{{ listing.title }}</h3>
            <p class="text-sm text-center" style="color: rgba(255, 244, 234, 0.8); font-family: 'Poppins', sans-serif;">{{ listing.description }}</p>
          </div>
        </div>
      </div>

      <!-- Recensioni -->
      <div v-if="activeTab === 'reviews'" class="space-y-4">
        <div v-if="reviews.length === 0" class="text-center py-8">
          <p style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Nessuna recensione disponibile</p>
        </div>
        <div 
          v-for="review in reviews" 
          :key="review._id" 
          @click="openReview(review)"
          class="p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-all"
          style="background-color: #7eacb5"
        >
          <div class="flex items-center mb-2">
            <span class="font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 600;">{{ review.author }}</span>
            <span class="ml-2" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">★ {{ review.rating }}/5</span>
          </div>
          <p style="color: rgba(255, 244, 234, 0.8); font-family: 'Poppins', sans-serif; font-weight: 300;">{{ review.comment }}</p>
          <div class="mt-2 text-sm" style="color: rgba(255, 244, 234, 0.6); font-family: 'Poppins', sans-serif;">
            {{ formatDate(review.date) }}
          </div>
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
          class="w-full max-w-xs rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1 cursor-pointer"
          style="background-color: #7eacb5"
        >
          <img :src="fav.images[0]" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h3 class="font-bold text-center" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 600;">{{ fav.title }}</h3>
            <p class="text-sm text-center" style="color: rgba(255, 244, 234, 0.8); font-family: 'Poppins', sans-serif; font-weight: 300;">{{ fav.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from "axios"

const route = useRoute()

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const USERS_URL = API_URL + '/users'

// Aggiunge il font Poppins al documento
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

// Dati utente
const username = ref('Username')
const name = ref('Nome')
const surname = ref('Cognome')
const userId = ref('')
const description = ref('')
const profilePhoto = ref('https://preview.redd.it/the-tiger-from-kpop-demon-hunter-v0-g0nozaxp258f1.jpg?width=640&crop=smart&auto=webp&s=2f60188b633d591fb9baac139d10ffb679351525') 
const error = ref('')

// Tab attiva
const tabs = [
  { id: 'showcase', label: 'Vetrina' },
  { id: 'reviews', label: 'Recensioni' },
  { id: 'favorites', label: 'Preferiti' }
]
const activeTab = ref('showcase')

// Dati mock (sostituire con chiamate API)
const listings = ref([
//   { _id: '1', title: 'Prodotto 1', description: 'Descrizione prodotto 1', images: ['https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg'] },
//   { _id: '2', title: 'Prodotto 2', description: 'Descrizione prodotto 2', images: ['https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg'] },
//   { _id: '3', title: 'Prodotto 3', description: 'Descrizione prodotto 3', images: ['https://www.artelegnoshop.it/wp-content/uploads/2020/10/CL32.11-ciotola1-in-legno-di-ulivo.jpg'] },
//   { _id: '4', title: 'Prodotto 4', description: 'Descrizione prodotto 4', images: ['https://via.placeholder.com/300'] }
])

const reviews = ref([
  { _id: '1', author: 'Utente 1', rating: 4, comment: 'Ottimo scambio! Persona molto affidabile e prodotto come descritto.', date: '2023-05-15' },
  { _id: '2', author: 'Utente 2', rating: 5, comment: 'Consigliatissimo. Tutto perfetto e tempi di consegna rapidi.', date: '2023-06-22' },
  { _id: '3', author: 'Utente 3', rating: 3, comment: 'Buon scambio, ma potrebbe migliorare la comunicazione', date: '2023-07-10' },
  { _id: '4', author: 'Utente 4', rating: 2, comment: 'Non sono soddisfatto dello scambio, prodotto diverso dalle aspettative', date: '2023-08-05' }
])

const favorites = ref([
  { _id: '1', title: 'Sedia design', description: 'Sedia in legno con tessuto elegante', images: ['https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg'] },
  { _id: '2', title: 'Tavolo moderno', description: 'Tavolo in legno massello con finitura lucida', images: ['https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg'] }
])

// Verifica se l'utente è il proprietario del profilo
function isAuthor() {
  return localStorage.getItem('userId') === userId.value
}

function openReview(review) {
  console.log('Apri recensione:', review)
  // Puoi aggiungere qui la logica per aprire una modal o navigare
}

function openFavorite(favorite){

}

async function fetchFavorites(userId) {
  try{
    const id = route.params.userId
    console.log(id)

    const listingsGet = await axios.get(API_URL+`/users/${userId}/favorites`)
    console.log(listingsGet)
    
    favorites.value = listingsGet.data
    console.log("favorites: "+ favorites.value)
  }catch(error){
    error.value = ("Errore con il caricamento degli annunci prefriti")
  }
  // Puoi aggiungere qui la logica per aprire il dettaglio
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('it-IT', options)
}

async function fetchUserData(userId){
    try{
        console.log(userId)
        const user = await axios.get(USERS_URL+`/${userId}`);
        console.log(user)
        if(!user){
            console.error("User ID not found");
            return;
        }else{
            //const response = await axios.get(USERS_URL+`/${userId}`);
            username.value = user.data.username;
            name.value = user.data.name;
            surname.value = user.data.surname;
            description.value = user.data.description;
            profilePhoto.value = user.data.profile_url
        }
    }catch(error){
        console.error("Error fetching user data:", error);
        return;
    }
}

async function fetchUserListings(userId){
  try{
    const id = route.params.userId
    console.log(id)
    const listingsGet = await axios.get(API_URL+`/listings/user/${userId}`)
    console.log(JSON.stringify(listingsGet.data))
    listings.value = JSON.stringify(listingsGet.data)

    console.log("listings: "+ listings.value)


  
  }catch(error){
    error.value = ("Errore con il caricamento degli annunci")
  }
}

onMounted(() => {
  console.log(route.params.userId)
  userId.value = route.params.userId;
  fetchUserData(userId.value) // Chiamata per ottenere i dati dell'utente
  fetchUserListings(userId.value)
  fetchFavorites(userId.value)
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
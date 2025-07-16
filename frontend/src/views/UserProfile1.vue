<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <!-- Pulsanti fissi in alto -->
    <div class="fixed top-22 left-1 right-1 z-50">
      <!-- Tasto Home a sinistra -->
      <div class="absolute left-4">
        <router-link to="/">
          <button class="p-2 rounded-full hover:cursor-pointer" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </router-link>
      </div>

      <!-- Tasti a destra -->
      <div class="absolute right-4 flex flex-col gap-2">
        <!-- Tasto Settings  -->
        <router-link to="/Settings">
          <button class="p-2 rounded-full hover:cursor-pointer" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </router-link>
        <!-- Tasto Edit Profile -->
        <router-link to="/EditProfile">
          <button class="p-2 rounded-full hover:cursor-pointer" style="background-color: #7eacb5">
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
        <div class="flex flex-col items-center md:items-center w-full md:w-1/3 ml-15">
          <div class="relative md:-ml-4 -mt-16">
            <img
              :src="profilePhoto"
              class="w-32 h-32 rounded-full border-4 shadow-lg"
              style="border-color: rgb(255, 244, 234);"
              alt=""
            />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-center" 
              style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">
            {{ username }}
          </h2>
        </div>

        <!-- Colonna destra (statistiche e note) -->
        <div class="w-full md:w-2/3">
          <!-- Statistiche -->
          <div class="flex justify-center mb-3">
            <div class="text-center" style="margin-right: 60px;">
              <p class="text-3xl font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">{{ n_exchange }}</p>
              <p class="text-sm" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">Scambi</p>
            </div>
            <div class="text-center" style="margin-right: 60px;">
              <p class="text-3xl font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">{{ n_follower }}</p>
              <p class="text-sm" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">Followers</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">{{ n_following }}</p>
              <p class="text-sm" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">Seguiti</p>
            </div>
          </div>

          <!-- Note -->
          <div class="mb-6">
            <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 500;">Note</label>
            <textarea
              class="w-full p-3 border rounded-lg focus:outline-none"
              style="border-color: rgb(255, 244, 234); min-height: 100px; background-color: rgba(255, 244, 234, 0.2); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
              placeholder=""
              readonly
              v-model="userNotes"
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
          @click="selectListing(listing)"
          class="w-full aspect-square max-w-[200px] sm:max-w-[240px] rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1" 
          style="background-color: #7eacb5"
        >
          <img 
            :src="listing.listing_url[0]" 
            class="w-full h-full object-cover" 
            :alt="listing.title"
          />
        </div>
      </div>

      <ListingTable2 
        v-if="selectedListing"
        :listing="selectedListing"
        @close="selectedListing = null"
      />

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
            <span class="font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 600;">{{ review.reviewer }}</span>
          </div>
          <p style="color: rgba(255, 244, 234, 0.8); font-family: 'Poppins', sans-serif; font-weight: 300;">{{ review.text }}</p>
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
          <img :src="fav.listing_url[0]" class="w-full h-full object-cover" />
        </div>
      </div>

      <ListingTable 
        v-if="selectedFavorite"
        :listing="selectedFavorite"
        @close="selectedFavorite = null"
      />
      <!-- Archivio -->
      <div v-if="activeTab === 'archive'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        <div v-if="archivedListings.length === 0" class="col-span-full text-center py-8">
          <p style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Nessun elemento in archivio</p>
        </div>
        <div
          v-for="item in archivedListings"
          :key="item._id"
          @click="openArchived(item)"
          class="w-full aspect-square max-w-[240px] sm:max-w-[240px] rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1 relative"
          style="background-color: #7eacb5"
        >
          <img :src="item.listing_url[0]" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <p class=" text-sm" style="font-family: 'Poppins', sans-serif; color:#fff4ea;">Archiviato</p>
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
import ListingTable2 from '@/components/ListingTable2.vue'
import ListingTable from '@/components/ListingTable.vue' 


const route = useRoute()
const userNotes = ref('') 
const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const USERS_URL = API_URL + '/users'

const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)


const username = ref('Username')
const name = ref('Nome')
const surname = ref('Cognome')
const userId = ref('')
const description = ref('')
const profilePhoto = ref('') 
const n_exchange =ref(0)
const n_following = ref()
const n_follower = ref()

const selectedListing = ref(null)
const selectedFavorite = ref(null)
const tabs = [
  { id: 'showcase', label: 'Vetrina' },
  { id: 'reviews', label: 'Recensioni' },
  { id: 'favorites', label: 'Preferiti' },
  { id: 'archive', label: 'Archivio' } 
]
const activeTab = ref('showcase')

const listings = ref([])


const reviews = ref([])

const favorites = ref([])
const archivedListings = ref([]);

function isAuthor() {
  return localStorage.getItem('userId') === route.params.id
}

function openReview(review) {
  console.log('Apri recensione:', review)
}
function selectListing(listing) {
  selectedListing.value = listing
  selectedFavorite.value = null 
}
function openFavorite(favorite){
selectedFavorite.value = favorite
  selectedListing.value = null
}
function deselectListing() {
  selectedListing.value = null
  selectedFavorite.value = null
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('it-IT', options)
}

async function fetchUserData(userId){
    try{
        console.log(userId)
        const user = await axios.get(USERS_URL+`/${userId}`);
        console.log(user.data)
        if(!user){
            console.error("User ID not found");
            return;
        }else{
            username.value = user.data.username;
            name.value = user.data.name;
            surname.value = user.data.surname;
            userNotes.value = user.data.description;
            profilePhoto.value = user.data.profile_url
            n_follower.value = user.data.n_followers;
            n_following.value = user.data.n_followed;
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
    if(listingsGet.data){
      console.log(JSON.stringify(listingsGet.data))
      listings.value = listingsGet.data

      console.log("listings: "+ listings.value)
    }else{
      console.log("No LISTINGS")
    }
  }catch(error){
    console.error("Error fetching user listings:", error);
    return;
  }
}

async function fetchUserReviews(userId) {
  try {
    const id = route.params.userId
    console.log(id)
    const response = await axios.get(API_URL + `/reviews/${userId}`)
    if (response.data) {
      const reviewsWithAuthors = await Promise.all(
        response.data.map(async (review) => {
          let reviewerUsername = ''
          try {
            const userRes = await axios.get(USERS_URL + `/${review.reviewer}`)
            reviewerUsername = userRes.data.username
          } catch (e) {
            reviewerUsername = 'Utente sconosciuto'
          }
          return {
            ...review,
            reviewer: reviewerUsername
          }
        })
      )
      reviews.value = reviewsWithAuthors
      console.log("RECENSIONI: " + JSON.stringify(reviews.value))
    } else {
      console.log("No Reviews")
    }
  } catch (error) {
    console.error("Error fetching user reviews:", error)
    return
  }
}

async function fetchFavorites(userId) {
  try{
    const id = route.params.userId
    console.log(id)

    const listingsGet = await axios.get(API_URL+`/users/${userId}/favorites`)
    console.log(listingsGet)
    
    favorites.value = listingsGet.data
    console.log("favorites: "+ favorites.value)
  }catch(e){
    console.error("Failed to fetchFavorites", e)
    this.error.value = ("Errore con il caricamento degli annunci preferiti")
  }
}






onMounted(async () => {
  console.log(route.params.userId)
  userId.value = route.params.userId;
  fetchUserData(userId.value) 
  fetchUserListings(userId.value)
  fetchFavorites(userId.value)
  fetchUserReviews(userId.value)
})
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}

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
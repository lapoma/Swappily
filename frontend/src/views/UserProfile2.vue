<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <div class="fixed top-22 left-1 right-1 z-50">
      <div class="absolute left-4">
        <router-link to="/">
          <button class="p-2 rounded-full" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </router-link>
      </div>

      <div class="absolute right-4 flex flex-col gap-2 ">
        <button @click="blockUser" class="p-2 rounded-full hover:cursor-pointer" style="background-color: #7eacb5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-7" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </button>
        <router-link to="/NewReport">
          <button @click="reportUser" class="p-2 rounded-full hover:cursor-pointer" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5h.01" />
            </svg>
          </button>
        </router-link>
        <button @click="shareProfile" class="p-2 rounded-full hover:cursor-pointer" style="background-color: #7eacb5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <router-link :to="'/NewReview/' + userId">
          <button class="p-2 rounded-full hover:cursor-pointer" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </router-link>
      </div>
    </div>

    <div class="w-full max-w-4xl rounded-xl shadow-xl overflow-hidden mt-16" style="background-color: #7eacb5">
      <div class="p-6 flex flex-col md:flex-row gap-8">
        <div class="flex flex-col items-center md:items-center w-full md:w-1/3 ml-15">
          <div class="relative md:-ml-4 -mt-16">
            <img
              :src="profilePhoto"
              class="w-32 h-32 rounded-full border-4 shadow-lg"
              style="border-color: rgb(255, 244, 234);"
              alt=""
            />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-center md:text-left"
              style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">
            {{ username }}
          </h2>
        </div>

        <div class="w-full md:w-2/3 flex flex-col justify-between">
          <div class="flex justify-center mb-3 items-center gap-6">
            <div class="text-center">
              <p class="text-3xl font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700;">42</p>
              <p class="text-sm" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 400;">Scambi</p>
            </div>
            <button @click="toggleFollow" class="p-2 rounded-full" :style="{ backgroundColor: '#7eacb5', border: '2px solid rgb(255, 244, 234)', color: isFollowing ? 'red' : 'rgb(255, 244, 234)' }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="isFollowing ? 'red' : 'none'" viewBox="0 0 24 24" :stroke="isFollowing ? 'red' : 'rgb(255, 244, 234)'">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <router-link to="/MessagePage">
              <button class="p-2 rounded-full" style="background-color: #7eacb5; border: 2px solid rgb(255, 244, 234);">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </router-link>
          </div>

          <div class="mb-6">
            <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 500;">Note</label>
            <textarea
              class="w-full p-3 border rounded-lg focus:outline-none"
              style="border-color: rgb(255, 244, 234); min-height: 100px; background-color: rgba(255, 244, 234, 0.2); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
              placeholder="Nessuna nota disponibile..."
              readonly
              v-model="userNotes"
            ></textarea>
          </div>
        </div>
      </div>

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

    <div class="w-full max-w-4xl px-6 py-8">
      <div v-if="activeTab === 'showcase'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        <div v-if="listings.length === 0" class="col-span-full text-center py-8">
          <p style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Nessun articolo in vetrina.</p>
        </div>
        <div v-for="listing in listings" 
    :key="listing._id" 
    @click="selectListing(listing)"
    class="w-full aspect-square max-w-[200px] sm:max-w-[240px] rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1" 
    style="background-color: #7eacb5">
          <img :src="listing.listing_url[0]" class="w-full h-full object-cover" />
        </div>
      </div>

      <ListingTable 
    v-if="selectedListing"
    :listing="selectedListing"
    @close="selectedListing = null"
    />

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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from "axios"
import ListingTable from '@/components/ListingTable.vue'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const USERS_URL = API_URL + '/users'

const route = useRoute()

// Aggiunge il font Poppins al documento
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

// Dati utente (questi potrebbero provenire da un'API per il profilo dell'altro utente)
const username = ref('NomeUtenteAltro')
const profilePhoto = ref('https://gadgetforentertainment.com/cdn/shop/collections/bloom1.png?v=1738755382&width=1500')
const userNotes = ref('Ciao! Sono un utente che ama scambiare oggetti unici e rari. Contattami per qualsiasi proposta!') // Note dell'altro utente
const isFollowing = ref(false) // Stato per il tasto "Segui"
const isBlocked = ref(false)
const selectedListing = ref(null)

// Tab attiva
const tabs = [
  { id: 'showcase', label: 'Vetrina' },
  { id: 'reviews', label: 'Recensioni' },
]
const activeTab = ref('showcase')

// Dati mock (questi dovrebbero essere caricati dinamicamente per l'altro utente)
//se le vuoi togliere metti ref([]) non togliere tutto 
const listings = ref([
  // { _id: '1', images: ['https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg'] },
  // { _id: '2', images: ['https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg'] },
  // { _id: '3', images: ['https://www.artelegnoshop.it/wp-content/uploads/2020/10/CL32.11-ciotola1-in-legno-di-ulivo.jpg'] }
])

//se le vuoi togliere metti ref([]) non togliere tutto 
const reviews = ref([
  // { _id: '1', author: 'Tu', comment: 'Ottimo scambio con questo utente! Veloce e affidabile.' },
  // { _id: '2', author: 'Un Altro Utente', comment: 'Prodotto come descritto, transazione liscia.' },
  // { _id: '3', author: 'Terzo Utente', comment: 'Disponibile e preciso, lo consiglio.' }
])

// Funzioni per i nuovi pulsanti
async function blockUser() {
  if(!localStorage.getItem("token")) {
                alert('You should log in first');
                return;
            }
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem('userId');

            console.log(token)

            try{
                const userGet = await axios.get(API_URL+`/users/${userId}`);

                console.log("USER"+JSON.stringify(userGet))

                const newBlockList = userGet.data.blocklist.includes(route.params.userId);

                console.log(newBlockList)

                if(newBlockList){
                    await axios.put(API_URL+`/users/${userId}`, {
                      username: userGet.data.username,
                      name: userGet.data.name,
                      surname: userGet.data.surname,
                      email: userGet.data.email,
                      blocklist: userGet.data.blocklist.filter(id => id !== route.params.userId)
                    }, {
                        headers: {
                            Authorization: ` ${token}`
                        }
                    });
                    isBlocked.value = false;
                } else {
                    await axios.put(API_URL+`/users/${userId}`, {
                      username: userGet.data.username,
                      name: userGet.data.name,
                      surname: userGet.data.surname,
                      email: userGet.data.email,
                      blocklist: [...userGet.data.blocklist, route.params.userId]
                    }, {
                        headers: {
                            Authorization: ` ${token}`
                        }
                    });
                    isBlocked.value = true;
                }

                localStorage.setItem('user', JSON.stringify({
                    ...userGet.data,
                    blocklist: newBlockList
                }));

                alert('Utente bloccato')

            }catch(error){
                console.error('Failed to block user: ', error);
                alert("Errore nell'aggiornamento degli utenti bloccati.");
            }
}

function reportUser() {
 
}
//questa funziona fr
function shareProfile() {
  console.log('Condividi profilo')
  if (navigator.share) {
    navigator.share({
      title: `Profilo di ${username.value}`,
      text: `Guarda il profilo di ${username.value} su SwapEase`,
      url: window.location.href
    }).catch(err => console.log('Errore nella condivisione:', err))
  } else {
    // Fallback per browser che non supportano l'API Web Share
    console.log('Web Share API non supportata')
  }
}

async function toggleFollow() {
  if(!localStorage.getItem("token")) {
                alert('You should log in first');
                return;
            }
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem('userId');

            console.log(token)

            try{
                const userGet = await axios.get(API_URL+`/users/${userId}`);

                console.log("USER"+JSON.stringify(userGet))

                const newFollowList = userGet.data.followed.includes(route.params.userId);

                console.log(newFollowList)

                if(newFollowList){
                    await axios.put(API_URL+`/users/${userId}`, {
                      username: userGet.data.username,
                      name: userGet.data.name,
                      surname: userGet.data.surname,
                      email: userGet.data.email,
                      followed: userGet.data.followed.filter(id => id !== route.params.userId)
                    }, {
                        headers: {
                            Authorization: ` ${token}`
                        }
                    });
                    isFollowing.value = false;
                } else {
                    await axios.put(API_URL+`/users/${userId}`, {
                      username: userGet.data.username,
                      name: userGet.data.name,
                      surname: userGet.data.surname,
                      email: userGet.data.email,
                      followed: [...userGet.data.followed, route.params.userId],
                      n_followed: userGet.data.n_followed+1
                    }, {
                        headers: {
                            Authorization: ` ${token}`
                        }
                    });
                    isFollowing.value = true;
                }

                localStorage.setItem('user', JSON.stringify({
                    ...userGet.data,
                    followed: newFollowList
                }));
            }catch(error){
                console.error('Failed to toggle favorite: ', error);
                alert('An error occurred while updating favorites.');
            }
}

async function checkFollow() {
  if (!localStorage.getItem("token")) {
    isFollowing.value = false;
    return;
  }

  const userId = localStorage.getItem('userId');

  try {
    const userGet = await axios.get(API_URL + `/users/${userId}`);
    isFollowing.value = userGet.data.followed.includes(route.params.userId);
  } catch (error) {
    console.error('Errore con il caricamento dei follow: ', error);
  }
}

  async function checkBlocked(){
      if(!localStorage.getItem("token")) {
                this.isBlocked = false
      }
      const userId = localStorage.getItem('userId');

      try{
            const userGet = await axios.get(API_URL+`/users/${userId}`);

            const check = userGet.data.blocklist.includes(route.params.userId);

                console.log(check)

                if(check){
                  isBlocked = true;
                } else {
                  isBlocked= false;
                }
            }catch(error){
                console.error('Errore con il caricamento: ', error);
            }
    }

function openReview(review) {
  console.log('Apri recensione:', review)
}

function selectListing(listing){
  selectedListing.value = listing
}

function deselectListing() {
      selectedListing.value = null;
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
            username.value = user.data.username;
            userNotes.value = user.data.description;
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
      listings.value = listingsGet.data
      console.log("listings: "+ listings.value)
  }catch(error){
    console.error("Error fetching user listings:", error);
    return;
  }
}

async function fetchUserReviews(userId){
  try{
    const id = route.params.userId
    console.log(id)
    const response = await axios.get(API_URL+`/reviews/${userId}`)
    if(response.data){
      console.log(JSON.stringify(response.data))
      reviews.value = response.data

      console.log("reviews: "+ reviews.value)
    }else{
      console.log("No Reviews")
    }
  }catch(error){
    console.error("Error fetching user reviews:", error);
    return;
  }
}

onMounted(() => {
  console.log('ID utente dalla route:', route.params.userId)
  checkFollow()
  checkBlocked()
  fetchUserData(route.params.userId)
  fetchUserListings(route.params.userId)
  fetchUserReviews(route.params.userId)
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
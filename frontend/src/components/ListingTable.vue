<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(0px);">

    <button 
      @click="$emit('close')" 
      class="absolute top-4 right-4 z-50 rounded-full p-2 shadow-md hover:bg-gray-100"
      style="background-color: rgb(255, 244, 234)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative" style="background-color: #7eacb5">
      
      <div class="w-full md:w-1/2 relative">
        <img 
          :src="listing.listing_url[currentImageIndex]" 
          :alt="listing.title"
          class="w-full h-64 md:h-full object-cover rounded-l-xl"
        >

        <button 
          @click="toggleFavorite"
          class="absolute top-4 right-4 rounded-full p-2 shadow-md hover:bg-gray-100"
          style="background-color: rgb(126, 172, 181)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6" 
               :class="isFavorite ? 'text-red-500 fill-current' : 'text-white-500 fill-none'"
               viewBox="0 0 24 24" 
               stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <button 
          @click="prevImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-gray-100"
          style="background-color: rgb(126, 172, 181)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-gray-100"
          style="background-color: rgb(126, 172, 181)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="absolute bottom-0 left-0 right-0 p-4">
          <div class="flex space-x-2 overflow-x-auto py-2">
            <button 
              v-for="(img, index) in listing.listing_url"
              :key="index"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-12 h-12 rounded border-2"
              :class="currentImageIndex === index ? 'border-white' : 'border-transparent'"
            >
              <img 
                :src="img" 
                :alt="`Thumbnail ${index + 1}`"
                class="w-full h-full object-cover rounded-sm"
              >
            </button>
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2 p-8 flex flex-col justify-between" style="color: rgb(255, 244, 234); max-height: 90vh;">
        
        <div class="flex items-center justify-between mb-4"> 
          <h2 class="text-3xl font-bold flex-grow" style="font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: bold;">{{ listing.title }}</h2>
          <div class="flex items-center space-x-4 mb-5 mt-5 gap-5">
          <router-link :to="`/NewReport`" 
                       class="flex-shrink-0 rounded-full p-2 shadow-md hover:transform hover:translate-y-[-2px]"
                       style="background-color: rgb(255, 244, 234);">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#7eacb5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5h.01" />
              </svg>
            
          </router-link>
          <button @click="shareProfile" class="p-2 rounded-full hover:cursor-pointer" style="background-color: rgb(255, 244, 234)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#7eacb5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        </div>
        </div>

        <div class="flex flex-col gap-10 overflow-y-auto"> 
          <router-link
            :to="`/UserProfile2/${listing.userId}`"
            class="text-red-300 hover:underline font-bold"
            style="font-size: 130%;"
          >
            {{ 'User: ' + listing.username }}
          </router-link>
          <div>
            <h3 class="text-xl font-semibold mb-3" style="font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 500;">Descrizione:</h3>
            <p class="whitespace-pre-line" style="font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 250;">{{ listing.description }}</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3" style="font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 500;">Condizione:</h3>
            <div class="flex items-center">
              <span class="inline-block px-4 py-2 rounded-full text-sm font-medium" 
                    :class="statusClasses[listing.status]">
                {{ statusLabels[listing.status] }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-between gap-6 pt-6">
          <button 
            @click="contactSeller"
            class="flex-1 py-3 px-6 rounded-lg font-bold transition"
              style="background-color: rgb(255, 244, 234); color: #7eacb5; font-family: 'Poppins', sans-serif; font-size: 1.4rem; font-weight: 1000;"
          >
            CONTATTA
          </button>

          <button 
            @click="startExchange"
            class="flex-1 py-3 px-6 rounded-lg font-bold transition"
            style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 1.4rem; font-weight: 700;"
          >
            SCAMBIA
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

export default {
  name: 'ListingTable',
  props: {
    listing: {
      type: Object,
      required: true,
      default: () => ({
        listing_url: [],
        title: '',
        description: '',
        status: ''
      })
    } 
  },
  data() {
    return {
      currentImageIndex: 0,
      isFavorite: false,
      statusLabels: {
        'As new': 'Come nuovo',
        'Good': 'Buono',
        'Ok': 'Discreto',
        'Not Good': 'Non buono'
      },
      statusClasses: {
        'As new': 'bg-green-100 text-green-800',
        'Good': 'bg-blue-100 text-blue-800',
        'Ok': 'bg-yellow-100 text-yellow-800',
        'Not Good': 'bg-red-100 text-red-800'
      }
    }
  },
  computed: {
    isLoggedIn(){
      return !!localStorage.getItem("token") 
    }  
  },
  methods: {
     shareProfile() {
  console.log('Condividi profilo')
  if (navigator.share) {
    navigator.share({
      title: `Listing su Swappily`,
      text: `Guarda questo listing!`,
      url: window.location.href
    }).catch(err => console.log('Errore nella condivisione:', err))
  } else {
    
  }
},
    async toggleFavorite(){
            if(!this.isLoggedIn) {
                alert('You should log in first');
                return;
            }
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem('userId');

            console.log(token)

            try{
                const userGet = await axios.get(API_URL+`/users/${userId}`);

                console.log("USER"+JSON.stringify(userGet))

                const newFavList = userGet.data.favorite.includes(this.listing.id);

                console.log(newFavList)

                if(newFavList){
                    await axios.put(API_URL+`/users/${userId}`, {
                      username: userGet.data.username,
                      name: userGet.data.name,
                      surname: userGet.data.surname,
                      email: userGet.data.email,
                      favorite: userGet.data.favorite.filter(id => id !== this.listing.id)
                    }, {
                        headers: {
                            Authorization: ` ${token}`
                        }
                    });
                    this.isFavorite = false;
                } else {
                    await axios.put(API_URL+`/users/${userId}`, {
                      username: userGet.data.username,
                      name: userGet.data.name,
                      surname: userGet.data.surname,
                      email: userGet.data.email,
                      favorite: [...userGet.data.favorite, this.listing.id]
                    }, {
                        headers: {
                            Authorization: ` ${token}`
                        }
                    });
                    this.isFavorite = true;
                }

                localStorage.setItem('user', JSON.stringify({
                    ...userGet.data,
                    favorite: newFavList
                }));
            }catch(error){
                console.error('Failed to toggle favorite: ', error);
                alert('An error occurred while updating favorites.');
            }
        },
    contactSeller() {
      this.$router.push('/MessagePage')
    },
    startExchange() {
      if(this.listing.userId === localStorage.getItem("userId")) {
        alert('You cannot exchange your own listing');
        return;
      }

      this.$router.push(`/ExchangePage/${this.listing.id}`)
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.listing.listing_url.length) % this.listing.listing_url.length
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.listing.listing_url.length
    },
    async checkFavorite(){
      if(!this.isLoggedIn) {
                this.isFavorite = false
      }
      const userId = localStorage.getItem('userId');

      try{
            const userGet = await axios.get(API_URL+`/users/${userId}`);

            const isFav = userGet.data.favorite.includes(this.listing.id);

                console.log(isFav)

                if(isFav){
                  this.isFavorite = true;
                } else {
                  this.isFavorite = false;
                }
            }catch(error){
                console.error('Errore con il caricamento: ', error);
            }
    }
  },
  mounted() {
    // Font Poppins
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  this.checkFavorite()

  console.log('DEBUG - Condizione ricevuta:', this.listing.status)
  }
}
</script>

<style scoped>

img {
  transition: opacity 0.3s ease;
}


button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
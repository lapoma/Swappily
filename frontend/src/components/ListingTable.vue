export default {
  props: {
    mockData: Object,
    mockUser: Object
  },
  mounted() {
    if (this.mockData) {
      this.listing = this.mockData
      if (this.mockUser?.favoriteList.includes(this.mockData.id)) {
        this.isFavorite = true
      }
    } else {
      this.fetchListingData()
    }
  },
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER (rimane invariato) -->
    <header class="bg-white shadow-sm">
      <div
        class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative"
      >
        <img
          src="../assets/safebites_logo.png"
          alt="Logo"
          class="h-24 w-50"
          @click="navigateTo('/Home')"
        />
        <!-- USER ICON -->
        <div class="flex items-center space-x-2">
          <img
            src="../assets/user_icon.png"
            alt="User"
            class="h-14 w-14 mt-4"
            @click="navigateTo('/userPage')"
          />
        </div>
      </div>
    </header>

    <!-- Immagine e dettagli del ristorante -->
    <div
      class="relative w-4/6 h-[50vh] flex items-center justify-center mx-auto mt-5"
    >
      <img
        :src="restaurant.profile_url"
        alt="Restaurant"
        class="w-full h-full object-cover rounded-2xl"
      />
      <div
        class="absolute left-28 top-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <button @click="toggleFavorite" class="absolute top-2 right-2">
          <svg
            v-if="isFavorite"
            class="w-6 h-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 17.75l-6.518 3.738 1.244-7.26L2 9.51l7.289-1.06L12 2.5l2.711 5.95L22 9.51l-4.726 4.717 1.244 7.26z"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </button>
        <h2 class="text-3xl font-bold text-gray-800">{{ restaurant.name }}</h2>
        <p class="text-gray-600">{{ restaurant.address }}</p>
        <p class="text-gray-600">Category: {{ restaurant.category }}</p>
        <p class="text-gray-600">Price: {{ priceRange }}</p>
        <p class="text-gray-600">Status: {{ isOpen ? "Open" : "Closed" }}</p>
        <p class="text-gray-600">Rating: {{ currentRating.toFixed(1) }} ⭐ ({{ totalRatings }} ratings)</p>
      </div>
    </div>

    <!-- Sezione MENU -->
    <section class="max-w-7xl mx-auto mt-10">
      <h2 class="text-2xl font-bold text-red-700 mb-4">MENU:</h2>
      <div class="grid grid-cols-5 gap-4">
        <!-- Uso del componente MenuCard per ogni piatto -->
        <MenuCard
          v-for="dish in restaurant.dishes"
          :key="dish.name"
          :dish="dish"
        />
      </div>
    </section>
    <section class="max-w-7xl mx-auto mt-10">
      <h2 class="text-2xl font-bold text-red-700 mb-4">
        RATE THIS RESTAURANT:
      </h2>

      <!-- Stelle di valutazione -->
      <div class="flex items-center mb-2">
        <div class="flex items-center">
          <span
            v-for="star in 5"
            :key="star"
            class="cursor-pointer"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
          >
            <svg
              class="w-8 h-8 transition-colors duration-200"
              :class="[
                (hoverRating || newRating || currentRating) >= star
                  ? 'text-red-500 fill-current'
                  : 'text-gray-300 fill-transparent',
                'stroke-current stroke-2',
              ]"
              viewBox="0 0 24 24"
            >
              <path
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </span>
        </div>
        <span class="ml-2 text-gray-600">
          {{ currentRating.toFixed(1) }} ({{ totalRatings }} ratings)
        </span>
      </div>
    
    </section>
  </div>
</template>


<script>
import axios from 'axios';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`


export default{
    name: 'ListingTable',
    data(){
        return{
            listing: {
                id: '',
                title: '',
                description: '',
                status: '',
                user_id:'',
                available: true
            },
            isFavorite: false
        }
    },
    methods:{
        async fetchListingData(){
            try{
                const response = await axios.get(API_URL+`/listings/${this.$route.params.id}`);
                this.listing = response.data;

                if(this.listing.user_id === JSON.parse(localStorage.getItem('user')).id){
                    const user = JSON.parse(localStorage.getItem('user'));
                    const userGet = await axios.get(API_URL+`/users/${user.id}`);
                    this.isFavorite= userGet.data.favoriteList.includes(this.listing.id);
                }
            }catch(error){
                console.error('Falied to fetch listing data: ',error);
            }
        },
        async toggleFavorite(){
            if(!this.listing.user_id === JSON.parse(localStorage.getItem('userId'))) {
                alert('You should log in first');
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.get('token');

            try{
                const userGet = await axios.get(API_URL+`/users/${user.id}`);
                const newFavList = userGet.data.favoriteList.includes(this.listing.id);

                if(newFavList){
                    await axios.put(API_URL+`/users/${user.id}`, {
                        favoriteList: userGet.data.favoriteList.filter(id => id !== this.listing.id)
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    this.isFavorite = false;
                } else {
                    await axios.put(API_URL+`/users/${user.id}`, {
                        favoriteList: [...userGet.data.favoriteList, this.listing.id]
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    this.isFavorite = true;
                }

                localStorage.setItem('user', JSON.stringify({
                    ...userGet.data,
                    favoriteList: newFavList
                }));
            }catch(error){
                console.error('Failed to toggle favorite: ', error);
                alert('An error occurred while updating favorites.');
            }
        },
        navigateTo(route) {
            this.$router.push(route);
        },
        conditionalNavigate(route){
                const user = JSON.parse(localStorage.getItem('userId'));
                if(user && user.id === this.listing.user_id) {
                    this.navigateTo('/privateProfile');
                }else {
                    this.navigateTo(`/UserPage/${this.listing.user_id}`);
                }
        },
        editListing(route) {
            if (this.listing.user_id === JSON.parse(localStorage.getItem('user')).id) {
                this.$router.push(route);
            } else {
                alert('You can only edit your own listings.');
            }
        },
        askExchange() {
            if (JSON.parse(localStorage.getItem('user'))) {
                if (!this.listing.available) {
                    alert('This listing is not available for exchange.');
                    return;
                }else if (this.listing.user_id === JSON.parse(localStorage.getItem('user')).id) {
                    alert('You cannot ask for an exchange on your own listing.');
                    return;
                }else{
                    this.$router.push(`/askExchange/${this.listing.id}`);
                    return;
                }
            }else{
                alert('You should log in first');
                return; 
            } 
        }
    }
}
</script>
}
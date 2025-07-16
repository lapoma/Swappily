<template>
  <div class="w-full min-h-screen bg-light_bg px-4 py-2">
    <!-- Barra superiore con SearchBar e hamburger settings -->
    <div class="flex justify-center mb-8">
      <div class="flex items-center gap-0 w-full max-w-3xl">
        <RouterLink to="/SearchPage" class="flex-1 focus:outline-none hover:outline-none hover:ring-0">
          <div class="flex-1">
          <SearchBar />
        </div>
        </RouterLink>
      </div>
    </div>

     <!-- Visualizzazione principale -->
    <div v-if="!selectedListing" class="flex justify-center">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 w-full max-w-6xl">
        <div
          v-for="(listing, index) in listings"
          :key="index"
          @click="selectListing(listing)"
          class="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
        >
          <img 
            :src="listing.listing_url" 
            :alt="'Listing ' + (index + 1)"
            class="w-full h-full object-cover hover:scale-101 transition duration-300"
          >
        </div>
      </div>
    </div>

    <!-- Visualizzazione dettaglio listing -->
    <ListingTable 
    v-if="selectedListing"
    :listing="selectedListing"
    @close="selectedListing = null"
    />
  </div>
</template>

<script>
import axios from 'axios';
import SearchBar from '@/components/SearchBar.vue'
import ListingTable from '@/components/ListingTable.vue'
//import { fetchListings } from '@/services/listings';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const LISTINGS_URL = API_URL + '/listings'

export default {
  name: "HomePage1",
  components: {
    SearchBar,
    ListingTable
  },
  data() {
    return {
      selectedListing: null,
      // listings: [
      //   { 
      //     id: 1,
      //     images: ["url1", "url2"], // Array di immagini
      //     title: "Titolo",
      //     description: "Descrizione",
      //     condition: "as_new" // o 'good', 'ok', 'not_good'
      //   },
      //   { 
      //     id: 2,
      //     imageUrl: "https://www.campodicanapa.it/wp-content/uploads/2021/03/32449_2.jpg", // URL dell'immagine
      //     images: ["https://www.campodicanapa.it/wp-content/uploads/2021/03/32449_2.jpg", "https://www.bricofer.it/media/catalog/product/cache/b3640ebe2da949b4692b50d3b9ef91ce/8/0/8055719465055.jpg"], // Array di immagini
      //     title: "Ventilatori",
      //     description: "2 ventilatori in ottime condizioni, uno con telecomando",
      //     condition: "not_good"
      //   },
        
      // ]
      listings: []
    };
  },
  methods: {
    goToSettings() {
      this.$router.push('/settings');
    },
    selectListing(listing) {
      this.selectedListing = listing;
    },
    deselectListing() {
      this.selectedListing = null;
    },
    async fetchListings() {
      try {
        const listings = await axios.get(LISTINGS_URL)

        
        console.log("Fetched listings:", listings.data);


        this.listings = listings.data;
    } catch (error) {
        console.error("Errore durante il recupero degli annunci", error);
        throw error; 
    }
    }
  },
  async mounted() {
    // Carica le listings quando il componente è montato
    this.fetchListings();
    console.log("Listings fetched:", this.listings);
  }
}
</script>

<style scoped>
.bg-light_bg {
  background-color: #fff7f0;
}

.border-primary {
  border-color: #7eacb5;
}

.bg-primary {
  background-color: #7eacb5;
}

/* .hover\:bg-primary\/20:hover {
  background-color: rgba(126, 172, 181, 0.2);
} */

/* Effetto hover per le immagini */
/* .relative:hover img {
  transform: scale(1.05);
} */
.router-link-no-hover-outline:hover,
.router-link-no-hover-outline:focus,
.router-link-no-hover-outline:active {
  outline: none !important;
  box-shadow: none !important;
  a:focus,
a:active,
a:hover {
  outline: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
  background-color: transparent !important;
}
}
</style>
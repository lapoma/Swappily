<template>
  <div class="w-full min-h-screen bg-light_bg px-4 py-2">
    <!-- Barra superiore con SearchBar -->
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
            :src="getFirstImage(listing)" 
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
    getFirstImage(listing) {
      if (Array.isArray(listing.listing_url) && listing.listing_url.length > 0) {
        return listing.listing_url[0];
      } else if (typeof listing.listing_url === 'string') {
        return listing.listing_url;
      }
      return ''; 
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
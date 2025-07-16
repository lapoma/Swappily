<template>
  <div class="w-full min-h-screen flex flex-col gap-8 py-5" style="background-color: rgb(255, 244, 234)">
    <div class="flex justify-center mt-20 px-4 gap-5">
      <div class="flex items-center w-full max-w-2xl relative gap-5">
        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Cerca oggetti, utenti..."
          class="w-full py-3 pl-12 pr-4 rounded-full shadow-md focus:outline-none"
          style="background-color: rgba(255, 244, 234, 0.95); color: #7eacb5; font-family: 'Poppins', sans-serif; border: 2px solid #7eacb5;"
        >
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#7eacb5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          @click="toggleFilters"
          class="p-4 rounded-xl shadow-md transition duration-300 hover:bg-white hover:bg-opacity-90"
          style="border: 2px solid #7eacb5;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#7eacb5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        <div
          v-if="showFilters"
          class="absolute left-168 mt-1 w-60 rounded-xl shadow-lg z-50 p-4"
          style="border: 2px solid #FFF4EA; background-color: #7eacb5; top: 0;"
        >
          <div class="flex flex-col gap-2"> 
            <div class="flex flex-col gap-2"> 
              <h3 class="font-semibold" style="color: #FFF4EA; font-family: 'Poppins', sans-serif;">Stato</h3>
              <div class="flex flex-col gap-2"> 
                <label v-for="status in statusOptions" :key="status" class="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    :value="status"
                    v-model="selectedStatus"
                    :disabled="disableStatus"
                    class="mr-2"
                    style="accent-color: #fff4ea;"
                  >
                  <span style="color: #fff4ea; font-family: 'Poppins', sans-serif;">{{ status }}</span>
                </label>
              </div>
            </div>

            <div class="flex flex-col gap-2"> 
              <h3 class="font-semibold" style="color: #fff4ea; font-family: 'Poppins', sans-serif;">Altri filtri</h3>
              <div class="flex flex-col gap-2"> 
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="onlyFavorites"
                    :disabled="disableFavorites"
                    class="rounded mr-2"
                    style="accent-color: #fff4ea;"
                  >
                  <span style="color: #fff4ea; font-family: 'Poppins', sans-serif;">Solo preferiti</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center w-full px-4 sm:px-6 md:px-8">
      <ListingTable 
        v-if="selectedListing"
        :listing="selectedListing"
        @close="deselectListing"
        class="w-full max-w-9xl"
      />

      <div v-else-if="searchPerformed && searchResults.length === 0" class="text-center py-12">
        <p style="color: #7eacb5; font-family: 'Poppins', sans-serif;">Nessun risultato affine alla ricerca</p>
      </div>

      <div v-else-if="searchPerformed" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        <div
          v-for="item in searchResults"
          :key="item._id" @click="selectListing(item)"
          class="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer "
          style="border: 2px solid #7eacb5; background-color: #7eacb5;"
        >
          <img 
            :src="getFirstImage(item)" 
            class="w-full h-48 object-cover hover:scale-105 transition duration-300"
            alt=""
          >
          <div class="p-4">
            <h3 class="font-bold" style="color: #fff4ea; font-family: 'Poppins', sans-serif;">{{ item.title }}</h3>
            <p class="text-sm" style="color: #fff4ea; font-family: 'Poppins', sans-serif;">{{ translateStatus(item.status) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'; 
import axios from 'axios';
import ListingTable from '@/components/ListingTable.vue'; 

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const LISTINGS_URL = API_URL + '/listings'

const searchQuery = ref('');
const searchPerformed = ref(false);
const isLoading = ref(false);
const showFilters = ref(false);

const selectedStatus = ref(null);
const onlyFavorites = ref(false);

const disableStatus = computed(() => onlyFavorites.value); 
const disableFavorites = computed(() => selectedStatus.value); 

const selectedListing = ref(null);

const searchResults = ref([]);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const statusOptions = ['Come nuovo', 'Buono', 'Discreto', 'Non buono'];

const statusMap = {
  'Come nuovo': 'As new',
  'Buono': 'Good',
  'Discreto': 'Ok',
  'Non buono': 'Not good'
};

const reverseStatusMap = {
  'As new': 'Come nuovo',
  'Good': 'Buono',
  'Ok': 'Discreto',
  'Not good': 'Non buono'
};

const translateStatus = (status) => reverseStatusMap[status] || status;

const performSearch = async () => {
  const query = searchQuery.value.trim();
  const userId = localStorage.getItem("userId");
  
  searchPerformed.value = true;
  isLoading.value = true;
  searchResults.value = [];
  selectedListing.value = null; 

  try {
    let endpoint = LISTINGS_URL;
    let params = {};
    
    // Filtro per testo
    if (query) {
      params.title = query;
    }
    
    // Filtro per stato
    if (selectedStatus.value) {
      params.status = statusMap[selectedStatus.value];
    }
    
    // Filtro per preferiti
    if (onlyFavorites.value) {
      if (!userId) {
          console.warn("User ID not found for favorites filter.");
          isLoading.value = false;
          return; 
      }
      endpoint = `${API_URL}/users/${userId}/favorites`;

      params = {}; 
      if (query) {
         params.title = query; 
      }
      if (selectedStatus.value) {
         params.status = statusMap[selectedStatus.value]; 
      }
    }
    
    const res = await axios.get(endpoint, { params });
    searchResults.value = res.data;
    
  } catch (err) {
    console.error("Search error:", err);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

const selectListing = (listing) => {
  selectedListing.value = listing;
};

const deselectListing = () => {
  selectedListing.value = null;
};
function getFirstImage(listing) {
      if (Array.isArray(listing.listing_url) && listing.listing_url.length > 0) {
        return listing.listing_url[0];
      } else if (typeof listing.listing_url === 'string') {
        return listing.listing_url;
      }
      return ''; 
    };

watch(onlyFavorites, (newValue) => {
  if (newValue) {
    selectedStatus.value = null; 
  }
});

watch(selectedStatus, (newValue) => {
  if (newValue) {
    onlyFavorites.value = false; 
  }
});




</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>
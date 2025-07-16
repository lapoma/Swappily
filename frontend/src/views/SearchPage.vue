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
          class="absolute left-168 top-0 mt-1 w-64 rounded-xl shadow-lg z-50 p-4"
          style="border: 2px solid #FFF4EA; background-color: #7eacb5;"
        >
          <div class="flex flex-col gap-2"> 
            <div class="flex flex-col gap-2"> <h3 class="font-semibold" style="color: #FFF4EA; font-family: 'Poppins', sans-serif;">Stato</h3>
              <div class="flex flex-col gap-2"> <label v-for="status in statusOptions" :key="status" class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="selectedStatuses"
                    :value="status"
                    class="rounded mr-2"
                    style="accent-color: #fff4ea;"
                  >
                  <span style="color: #fff4ea; font-family: 'Poppins', sans-serif;">{{ status }}</span>
                </label>
              </div>
            </div>

            <div class="flex flex-col gap-2"> <h3 class="font-semibold" style="color: #fff4ea; font-family: 'Poppins', sans-serif;">Altri filtri</h3>
              <div class="flex flex-col gap-2"> <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="onlyFavorites"
                    class="rounded mr-2"
                    style="accent-color: #fff4ea;"
                  >
                  <span style="color: #fff4ea; font-family: 'Poppins', sans-serif;">Solo preferiti</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="onlyFollowing"
                    class="rounded mr-2"
                    style="accent-color: #fff4ea;"
                  >
                  <span style="color: #fff4ea; font-family: 'Poppins', sans-serif;">Solo utenti seguiti</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center w-full px-4 sm:px-6 md:px-8">
      <div v-if="searchPerformed && searchResults.length === 0" class="text-center py-12">
        <p style="color: #7eacb5; font-family: 'Poppins', sans-serif;">Nessun risultato affine alla ricerca</p>
      </div>

      <div v-else-if="searchPerformed" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        <div
          v-for="item in searchResults"
          :key="item.id"
          class="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer "
          style="border: 2px solid #7eacb5; background-color: #7eacb5;"
        >
          <img 
            :src="item.image" 
            class="w-full h-48 object-cover hover:scale-105 transition duration-300"
            alt="Listing image"
          >
          <div class="p-4">
            <h3 class="font-bold" style="color: #fff4ea; font-family: 'Poppins', sans-serif;">{{ item.title }}</h3>
            <p class="text-sm" style="color: #fff4ea; font-family: 'Poppins', sans-serif;">{{ item.status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const LISTINGS_URL = API_URL + '/listings'

// Search state
const searchQuery = ref('');
const searchPerformed = ref(false);
const isLoading = ref(false);
const showFilters = ref(false);

// Filters
const statusOptions = ['Come nuovo', 'Buono', 'Discreto', 'Non buono'];
const selectedStatuses = ref([]);
const onlyFavorites = ref(false);
const onlyFollowing = ref(false);


const searchResults = ref([]);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};


const performSearch = () => {
  if (!searchQuery.value.trim() && selectedStatuses.value.length === 0 && !onlyFavorites.value) return;

  isLoading.value = true;
  searchPerformed.value = true;

  if (searchQuery.value.trim() && selectedStatuses.value.length === 0 && !onlyFavorites.value) {
    setTimeout(async () => {
      try {
        const response = await axios.get(LISTINGS_URL, {
          params: {
            title: searchQuery.value
          }
        });

        console.log(response.data);
        searchResults.value = response.data;
      } catch (error) {
        console.error(error);
        searchResults.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 800);
  }
  else if (searchQuery.value.trim() && selectedStatuses.value.length > 0 && !onlyFavorites.value) {
    setTimeout(async () => {
      try {
        const response = await axios.get(LISTINGS_URL, {
          params: {
            title: searchQuery.value,
            status: selectedStatuses.value
          }
        });

        console.log(response.data);
        searchResults.value = response.data;
      } catch (error) {
        console.error(error);
        searchResults.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 800);
  }
  else if (!searchQuery.value.trim() && selectedStatuses.value.length > 0 && !onlyFavorites.value) {
    setTimeout(async () => {
      try {
        const response = await axios.get(LISTINGS_URL, {
          params: {
            status: selectedStatuses.value
          }
        });

        console.log(response.data);
        searchResults.value = response.data;
      } catch (error) {
        console.error(error);
        searchResults.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 800);
  }
  else if (onlyFavorites.value) {
    setTimeout(async () => {
      try {
        const userId = localStorage.getItem("userId")
        const response = await axios.get(API_URL + `/users/${userId}/favorites`);

        console.log(response.data);
        searchResults.value = response.data;
      } catch (error) {
        console.error(error);
        searchResults.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 800);
  }else if(onlyFollowing.value) {
    setTimeout(async () => {
      try {
        const userId = localStorage.getItem("userId")
        const response = await axios.get(API_URL + `/users/${userId}/following`);

        console.log(response.data);
        searchResults.value = response.data;
      } catch (error) {
        console.error(error);
        searchResults.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 800);
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>


<!-- // Mock data - in a real app, this would come from an API
    // if (searchQuery.value.toLowerCase().includes('nessun')) {
    //   searchResults.value = [];
    // } else {
    //   searchResults.value = [
    //     {
    //       id: 1,
    //       title: 'Sedia vintage',
    //       status: 'Buono',
    //       image: 'https://www.viadurini.it/data/prod/img/sedia-da-cucina-in-legno-e-tessuto-design-moderno-made-in-italy-marrine.jpg'
    //     },
    //     {
    //       id: 2,
    //       title: 'Tavolo moderno',
    //       status: 'Come nuovo',
    //       image: 'https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg'
    //     },
    //     {
    //       id: 4,
    //       title: 'Tavolo moderno',
    //       status: 'Come nuovo',
    //       image: 'https://www.ibeliv.fr/cdn/shop/files/2606-21-IBELIV-Rary-0013.jpg'
    //     },
    //     {
    //       id: 3,
    //       title: 'Lampada retro',
    //       status: 'Discreto',
    //       image: 'https://www.artelegnoshop.it/wp-content/uploads/2020/10/CL32.11-ciotola1-in-legno-di-ulivo.jpg'
    //     }
    //   ].filter(item => {
    //     // Apply filters
    //     if (selectedStatuses.value.length > 0 && !selectedStatuses.value.includes(item.status)) {
    //       return false;
    //     }
    //     return true;
    //   });
    // }
    
    // isLoading.value = false; -->
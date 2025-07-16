<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">

    <div class="w-full max-w-3xl mt-20 flex flex-col items-center gap-6"> 
      <h2 class="text-lg font-semibold" style="color: #7eacb5; font-family: 'Poppins', sans-serif;font-size: 23px;">
        Seleziona uno dei tuoi oggetti da scambiare
      </h2>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-5xl">

  <router-link to="/NewListing" class="rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200"
    style="background-color: #7eacb5">
    <div class="w-full aspect-square flex flex-col items-center justify-end p-9.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24"
        stroke="rgb(255, 244, 234)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <!-- <h3 class="text-sm font-medium text-center" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
        Aggiungi nuovo listing
      </h3> -->
    </div>
  </router-link>

  <div v-for="(listing, index) in myListings" :key="index" @click="selectListing(index)"
    class="rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200" :style="{
      'border': selectedIndex === index ? '3px solid #c96868' : '3px solid transparent',
      'background-color': '#7eacb5'
    }">
    <img :src="listing.listing_url" class="w-full aspect-square object-cover" :alt="listing.title" />
    <div class="p-2">
      <h3 class="text-sm font-medium truncate" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
        {{ listing.title }}
      </h3>
    </div>
  </div>
</div>

      <button
        @click="proposeExchange"
        :disabled="selectedIndex === null"
        class="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: #c96868; color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 500;"
      >
        Proponi Scambio
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "axios";

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const LISTINGS_URL = API_URL + '/listings'

const router = useRouter();
const route = useRoute();

// Mock data - lista dei propri listing
const myListings = ref([]);

const selectedIndex = ref(null);

const selectListing = (index) => {
  selectedIndex.value = index;
};

async function proposeExchange() {
  if (selectedIndex.value !== null) {
    try {
      const selectedListing = myListings.value[selectedIndex.value];
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found in localStorage.");
        return;
      }

      const listingResponse = await axios.get(API_URL + `/listings/${route.params.listingId}`);
      const listing = listingResponse.data;

      if (!selectedListing?.id || !listing?.userId) {
        console.error("Missing selected listing ID or receiver user ID.");
        return;
      }

      await axios.post(
        API_URL + `/exchanges/listing/${route.params.listingId}`,
        {
          offeredListing: selectedListing.id,
          receiver: listing.userId
        },
        {
          headers: {
            token: `${token}`
          }
        }
      );

      alert('Scambio proposto con successo!');
      router.push('/');
    } catch (error) {
      console.error("Error proposing exchange:", error);
    }
  }
};

async function fetchUserListings(){
  try{
    const id =  localStorage.getItem("userId")
    console.log(id)
    const listingsGet = await axios.get(API_URL+`/listings/user/${id}`)
      console.log(JSON.stringify(listingsGet.data))
      myListings.value = listingsGet.data
      console.log("listings: "+ myListings.value)
  }catch(error){
    console.error("Error fetching user listings:", error);
    return;
  }
}
onMounted(async()=>{
  fetchUserListings();
})


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>
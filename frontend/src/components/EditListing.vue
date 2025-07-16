<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <div class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden mt-8" style="background-color: #7eacb5">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-center flex-grow" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Modifica Annuncio
          </h1>
          <div class=""></div> 
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg text-center" style="background-color: rgba(255, 100, 100, 0.2); color: rgb(255, 244, 234);">
          {{ error }}
        </div>

        <div v-if="success" class="mb-4 p-3 rounded-lg text-center" style="background-color: rgba(100, 255, 100, 0.2); color: rgb(255, 244, 234);">
          {{ success }}
        </div>

        <div class="flex flex-col gap-4"> 
          <div class="mb-2">
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Titolo
            </label>
            <input
              v-model="title"
              type="text"
              class="w-full p-3 rounded-lg focus:outline-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
              placeholder="Titolo dell'annuncio"
            >
          </div>

          <div class="mb-2">
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Descrizione
            </label>
            <textarea
              v-model="description"
              class="w-full p-3 rounded-lg focus:outline-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif; min-height: 150px;"
              placeholder="Descrizione dettagliata"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Stato dell'articolo
            </label>
            <select
              v-model="status"
              class="w-full p-3 rounded-lg focus:outline-none appearance-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
            >
              <option value="As new">Come nuovo</option>
              <option value="Good">Buono</option>
              <option value="Ok">Discreto</option>
              <option value="Not Good">Non buono</option>
            </select>
          </div>

          <button
            @click="updateListing"
            :disabled="isSubmitting"
            class="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:brightness-110"
            style="background-color: #c96868; color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
          >
            <span v-if="!isSubmitting">Salva Modifiche</span>
            <span v-else>Salvataggio in corso...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';  

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const USERS_URL = API_URL + '/users'
const LISTINGS_URL = API_URL + '/listings'

const title = ref('');
const description = ref('');
const status = ref('');
const error = ref('');
const success = ref('');
const isSubmitting = ref(false);
const router = useRouter();
const route = useRoute();

async function updateListing(){
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const listingId = route.params.id;

  const listingOld = await axios.get(LISTINGS_URL + `/${listingId}`);
  if(title.value !== ""){
    if(!checkTitle(title.value)){
      error.value = "Il titolo deve essere tra 3 e 50 caratteri.";
      return;
    }
    listingOld.data.title = title.value;
  }

  if(description.value !== ""){
    if(!checkDescription(description.value)){
      error.value = "La descrizione deve essere tra 3 e 2000 caratteri.";
      return;
    }
    listingOld.data.description = description.value;
  }

  if(status.value !== ""){
    listingOld.data.status = status.value;
  }

  try {
    const response = await axios.put(LISTINGS_URL+`/${listingId}`, {
      title: listingOld.data.title,
      description: listingOld.data.description,
      status: listingOld.data.status,
      userId: userId,
      listing_url: listingOld.data.listing_url
    }, {
      headers: {
        token: `${token}`
      }
    });

    alert("Annuncio aggiornato con successo!");
    error.value = "";
    router.push(`/UserProfile1/${userId}`);
  } catch (err) {
    error.value = "Errore durante l'aggiornamento del listing.";
    console.error(err);
  }
}

function checkTitle(title) {
      return title.length >= 3 && title.length <= 50
    }
function checkDescription(description) {
      return description.length >= 3 && description.length <= 2000
    }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' viewBox='0 0 20 20' fill='%237eacb5'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
}
</style>
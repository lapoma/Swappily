<template>
  <div class="min-h-screen flex flex-col items-center p-7" style="background-color: rgb(255, 244, 234)">
    <div class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden mt-12" style="background-color: #7eacb5">
      <div class="p-7">
        <h1 class="text-xl font-bold text-center mb-6" 
        style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 1.8rem; font-weight: 500;">
          Nuova Segnalazione
        </h1>

        <div v-if="error" class="mb-4 p-3 rounded-lg text-center" style="background-color: rgba(255, 100, 100, 0.2); color: rgb(255, 244, 234);">
          {{ error }}
        </div>

        <div class="space-y-5"> 
          <div>
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Username da segnalare (opzionale)
            </label>
            <input
              v-model="reportedUsername"
              type="text"
              class="w-full p-3 rounded-lg focus:outline-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
              placeholder="Inserisci l'username"
            >
          </div>

          <div>
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Listing da segnalare (opzionale)
            </label>
            <input
              v-model="reportedListing"
              type="text"
              class="w-full p-3 rounded-lg focus:outline-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
              placeholder="Inserisci l'ID del listing"
            >
          </div>

          <div>
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Descrizione della segnalazione <span class="text-red-300">*</span>
            </label>
            <textarea
              v-model="description"
              required
              class="w-full p-3 rounded-lg focus:outline-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif; min-height: 150px;"
              placeholder="Descrivi il motivo della segnalazione..."
            ></textarea>
          </div>

          <button
            @click="submitReport"
            :disabled="!description || isSubmitting"
            class="w-full py-3 rounded-lg font-bold mt-4 transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: #c96868; color: #fff4ea; font-family: 'Poppins', sans-serif;"
          >
            <span v-if="!isSubmitting">Invia Segnalazione</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
const API_URL = HOST + '/api/v1';
const REPORTS_URL = API_URL + '/reports';

const router = useRouter();
const route = useRoute();

const reportedUsername = ref("");
const reportedListing = ref("");
const description = ref('');
const isSubmitting = ref(false);
const error = ref('');

onMounted(async()=>{

})

const submitReport = async () => {
  if (!description.value.trim()) {
    error.value = 'La descrizione è obbligatoria';
    return;
  }
  if (reportedListing.value !== "" && reportedUsername.value !== "") {
    error.value = "Impossibile segnalare un utente e un annuncio."
    return;
  }
  isSubmitting.value = true;
  error.value = '';

  try {
    const token = localStorage.getItem('token');

    const userId = localStorage.getItem('userId');
    const user = await axios.get(`${API_URL}/users/${userId}`);
    const reporterUrl = user.data.self
    let reporteeUrl = null;
    let listingUrl = null;

    if(reportedUsername.value !== "") {
      const reporteeUsername = reportedUsername.value;
      const reporteeResponse = await axios.get(API_URL + `/users?username=${reporteeUsername}`);
      if (Array.isArray(reporteeResponse.data) && reporteeResponse.data.length > 0) {
        reporteeUrl = reporteeResponse.data[0].self;
        console.log(reporteeUrl);
      } else {
        error.value = "Utente da segnalare non trovato.";
        isSubmitting.value = false;
        return;
      }
    }

    if(reportedListing.value !== "") {
      const listingId = reportedListing.value;
      const listing = await axios.get(API_URL+ `/listings/${listingId}`);
      listingUrl = listing.data.self || null;
    }
  
    await axios.post(
      REPORTS_URL,
      {
        reporter: reporterUrl,
        reportee: reporteeUrl || null,
        listing: listingUrl || null,
        text: description.value
      },
      {
        headers: {
          Authorization: `${token}`
        }
      }
    );
      alert('Segnalazione inviata con successo!');
    router.push('/settings');
    
  } catch (err) {
    console.log(err);
    console.error('Error submitting report:', err);
    error.value = err.response?.data?.message || 'Errore durante l\'invio della segnalazione';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>
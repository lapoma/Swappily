<template>
  <div class="min-h-screen flex flex-col items-center" style="background-color: rgb(255, 244, 234)">
    <nav class="w-full bg-[#7eacb5] shadow-md py-4 fixed top-0 z-50 h-20">
      <div class="max-w-235 mx-auto px-6 flex justify-between items-center h-full gap-16">
        <div class="flex items-center ml-5"> 
          <img src="@/assets/Logo.png" alt="Logo" class="h-[90px] w-[110px] object-contain -ml-10 mt-1" /> 
        </div>

        <div class="flex justify-between gap-35">
          <button
            @click="handleLogout"
            class="px-6 py-2 rounded-lg transition duration-300 text-cream-white text-lg font-semibold  hover:bg-opacity-20 hover:scale-102"
            style="font-family: 'Poppins', sans-serif; color: #fff4ea;"
          >
            Logout
          </button>
          <button
            @click="confirmDeleteAccount"
            class="px-6 py-2 rounded-lg transition duration-300 text-red-light text-lg font-semibold  hover:bg-opacity-20 hover:scale-102"
            style="font-family: 'Poppins', sans-serif; color: #fff4ea;"
          >
            Elimina Account
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl w-full px-4 flex flex-col justify-end pt-6 gap-5 pb-20">
      <h1 class="text-3xl font-bold text-center mb-6" style="color: #7eacb5; font-family: 'Poppins', sans-serif; font-weight: 700;">
        Richieste di Supporto
      </h1>

      <div class="flex flex-col gap-6 w-full">
        <div v-if="supportRequests.length === 0" class="text-center py-8">
          <p style="color: #7eacb5; font-family: 'Poppins', sans-serif;">Nessuna richiesta di supporto in sospeso.</p>
        </div>

        <div
          v-for="request in supportRequests"
          :key="request.id"
          class=" p-6 rounded-xl shadow-md flex flex-col gap-5"
          style="border: 3px solid #7eacb5;"
        >
          <h3 class="text-xl font-bold" style="color: #7eacb5; font-family: 'Poppins', sans-serif; font-weight: 500;">
            Username: {{ request.reporter }}
          </h3>
          <p style="color: #333; font-family: 'Poppins', sans-serif;">
            Descrizione problema: {{ request.text }}
          </p>
          <p style="color: #333; font-family: 'Poppins', sans-serif;">
            Utente segnalato: {{ request.reportee || 'N/A' }}
          </p>
          <p style="color: #333; font-family: 'Poppins', sans-serif;">
            Listing segnalato: {{ request.listing || 'N/A' }}
          </p>

          <div class="flex justify-end gap-4 mt-2">
            <button
              @click="removeUser(request.reportee)"
              class="px-10 py-7 rounded-lg font-bold transition duration-300 hover:opacity-90"
              style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 20px;"
            >
              Rimuovi Utente
            </button>
            <button
              @click="removeListing(request.listing)"
              class="px-10 py-7 rounded-lg font-bold transition duration-300 hover:opacity-90"
              style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 20px;"
            >
              Rimuovi Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { logout } from '@/authState';
import { ref, onMounted } from 'vue';
import axios from "axios"
import { useRouter } from 'vue-router';
import { deleteListing } from '@/services/listings';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const USERS_URL = API_URL + '/users'
const LISTINGS_URL = API_URL + '/listings'

    // Aggiunge il font Poppins al documento
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const router = useRouter();
    const supportRequests = ref([]);

    
    
    // Funzione per mockare il fetching delle richieste
    const fetchSupportRequests = async () => {
      const response = await axios.get(API_URL+`/reports`)
      console.log(response)
      supportRequests.value = response.data;
    };

    onMounted(() => {
      fetchSupportRequests(); // Carica le richieste al montaggio del componente
    });

    function handleLogout(){
      logout()
      alert('Logout effettuato con successo!');
      router.push('/LoginPage');
    };

    const confirmDeleteAccount = () => {
      if (confirm('Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.')) {
        alert('Richiesta di eliminazione account inviata (azione simulata)');
        // TODO: Implementa la vera logica di eliminazione account
      }
    };

    async function removeUser(userId) {
      console.log(`Richiesta di rimozione utente: ${userId}`);
      try {
        const deletedUser = await axios.delete(`${USERS_URL}/${userId}`, {
          headers: {
            token: `${localStorage.getItem('token')}`
          }
        });
        console.log(deletedUser.data);
        alert(`Richiesta di rimozione utente '${userId}' inviata`);
        fetchSupportRequests(); // Aggiorna la lista delle richieste dopo la rimozione
      } catch (error) {
        console.error(error);
        alert('Errore nella rimozione dell\'utente.');
      }

    };
    async function removeListing(listingId) {
      console.log(`Richiesta di rimozione listing: ${listingId}`);
      try {
        const deselectListing = await axios.delete(`${LISTINGS_URL}/${listingId}`, {
          headers: {
            token: `${localStorage.getItem('token')}`
          }
        });
        console.log(deleteListing.data);
        alert(`Richiesta di rimozione listing '${listingId}' inviata`);
        fetchSupportRequests(); // Aggiorna la lista delle richieste dopo la rimozione
      } catch (error) {
        console.error(error);
        alert('Errore nella rimozione del listing.');
      }

    };
   
</script>

<style scoped>
/* Stili aggiuntivi se necessari */
</style>
<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    

    <!-- Main container -->
    <div class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden mt-16 " style="background-color: #7eacb5">
      <div class="p-6 space-y-6">
        <div class="flex flex-col space-y-4">
          <h2 class="text-lg font-semibold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Account
          </h2>

          <router-link to="/EditAccount">
            <button class="w-full flex justify-between items-center p-4 rounded-lg transition duration-300 hover:brightness-90" style="background-color: rgba(255, 244, 234, 0.8);">
              <span style="color: #7eacb5; font-family: 'Poppins', sans-serif;">Modifica account</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#7eacb5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </router-link>
        </div>

        <div class="flex flex-col space-y-4 mt-6">
          <h2 class="text-lg font-semibold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Account bloccati
          </h2>

          <div class="p-4 rounded-lg" style="background-color: rgba(255, 244, 234, 0.8);">
            <div v-if="blockedUsers.length > 0" class="space-y-3">
              <div
                v-for="user in blockedUsers"
                :key="user.id"
                class="flex justify-between items-center p-2"
              >
                <span style="color: #7eacb5; font-family: 'Poppins', sans-serif;">{{ user.username }}</span>
                <button class="text-sm p-1 rounded transition duration-300 hover:opacity-80" style="color: #7eacb5; border: 1px solid #7eacb5;">
                  Sblocca
                </button>
              </div>
            </div>
            <div v-else style="color: #7eacb5; font-family: 'Poppins', sans-serif;">
              Nessun account bloccato
            </div>
          </div>
        </div>

        <div class="flex flex-col space-y-4 mt-6">
          <h2 class="text-lg font-semibold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Supporto
          </h2>

          <router-link to="/NewReport">
            <button class="w-full flex justify-between items-center p-4 rounded-lg transition duration-300 hover:brightness-90" style="background-color: rgba(255, 244, 234, 0.8);">
              <span style="color: #7eacb5; font-family: 'Poppins', sans-serif;">Invia richiesta di supporto</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#7eacb5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </router-link>
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            
          </h2>

          

          <button
            @click="handleLogout"
            class="w-full flex justify-between items-center p-4 rounded-lg transition duration-300 hover:brightness-110"
            style="background-color: #c96868;"
          >
            <span style="color: #fff4ea; font-family: 'Poppins', sans-serif;">Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#fff4ea">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

          <button
            @click="showDeleteModal = true"
            class="w-full flex justify-between items-center p-4 rounded-lg transition duration-300 hover:brightness-110"
            style="background-color: #c96868;"
          >
            <span style="color: #fff4ea; font-family: 'Poppins', sans-serif;">Elimina Account</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#fff4ea">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal per eliminazione account -->
    <div 
  v-if="showDeleteModal" 
  class="fixed inset-0 p-4 bg-opacity-50 flex items-center justify-center z-50" 
  style="backdrop-filter: blur(0px); background-color: rgba(0, 0, 0, 0.4);"
>
  <div 
    class="bg-white rounded-xl p-6 max-w-md w-full mx-4 flex flex-col gap-4" 
    style="background-color: #7eacb5"
  >
    <h3 class="text-xl flex items-center justify-center font-bold" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
      Conferma eliminazione account
    </h3>

    <p class="flex text-center" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
      Inserisci la tua password per confermare l'eliminazione definitiva del tuo account.
    </p>

    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="w-full p-3 rounded-lg focus:outline-none"
      style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
    >
    
    <div 
      v-if="deleteError" 
      class="p-2 flex items-center justify-center rounded text-center" 
      style="background-color: rgba(255, 100, 100, 0.3); color: rgb(255, 244, 234);"
    >
      {{ deleteError }}
    </div>
    
    <div class="flex justify-center gap-4"> <button
        @click="showDeleteModal = false"
        class="px-4 py-2 rounded-lg transition duration-300"
        style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
      >
        Annulla
      </button>
      <button
        @click="confirmDeleteAccount"
        :disabled="isDeleting"
        class="px-4 py-2 rounded-lg flex items-center justify-centerrounded-lg transition duration-300 hover:brightness-110"
        style="background-color: #c96868; color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
      >
        <span v-if="!isDeleting">Conferma</span>
        <span v-else>Eliminazione in corso...</span>
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios'; 

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
const API_URL = HOST + '/api/v1';
const USERS_URL = API_URL + '/users';


const router = useRouter();
const store = useStore();


const blockedUsers = ref([]);
const showDeleteModal = ref(false);
const password = ref('');
const deleteError = ref('');
const isDeleting = ref(false);

// Mock data - replace with actual API call
blockedUsers.value = [
//   { id: 1, username: 'user123' },
//   { id: 2, username: 'spammer456' }
];

const goBack = () => {
  router.go(-1);
};

const handleLogout = () => {
  store.dispatch("logout")

  router.push('/');
};

async function confirmDeleteAccount() {
  if (!password.value) {
    deleteError.value = 'Inserisci la tua password';
    return;
  }

  isDeleting.value = true;
  deleteError.value = '';

  try {
    // 1. Verifica SOLO NEL FRONTEND che la password sia corretta
    const username = localStorage.getItem('username');
    if (!username) {
      deleteError.value = 'Utente non trovato. Effettua nuovamente il login.';
      isDeleting.value = false;
      return;
    }
    let auth;
    try {
      auth = await axios.post(API_URL + '/authentications', {
        username,
        password: password.value
      });
    } catch (error) {
      console.error('Errore durante l\'autenticazione:', error);
      if (error.response && error.response.status === 401) {
        deleteError.value = 'Password errata';
      } else {
        deleteError.value = 'Errore durante l\'autenticazione. Riprova più tardi.';
      }
      isDeleting.value = false;
      return;
    }

    // 2. Se la password è corretta, procedi con l'eliminazione
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      deleteError.value = 'Impossibile trovare le informazioni utente. Effettua nuovamente il login.';
      isDeleting.value = false;
      return;
    }

    try {
      await axios.delete(API_URL + `/users/${userId}`, {
        headers: {
          token: `${token}`
        }
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      if (error.response && error.response.status === 401) {
        deleteError.value = 'Non autorizzato. Effettua nuovamente il login.';
      } else {
        deleteError.value = 'Errore durante l\'eliminazione. Riprova più tardi.';
      }
      isDeleting.value = false;
      return;
    }

    // Se arriva qui, l'eliminazione è avvenuta con successo
    showDeleteModal.value = false;
    alert('Account eliminato con successo');
    handleLogout();

  } catch (error) {
    console.error('Errore:', error);
    deleteError.value = 'Errore sconosciuto. Riprova più tardi.';
  } finally {
    isDeleting.value = false;
  }
}




async function  fetchBlockedUsers(){
  const userId = localStorage.getItem("userId")
  const response = await axios.get(API_URL+`/users/${userId}/blocked`)

  console.log(response.data)

  blockedUsers.value = response.data
};

onMounted(async()=>{
  fetchBlockedUsers()
})

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>
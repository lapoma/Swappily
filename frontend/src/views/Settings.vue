<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <!-- Header with back button -->
    <!-- <div class="fixed top-4 left-4 right-4 z-50">
      <div class="absolute left-4">
        <button @click="goBack" class="p-2 rounded-full transition duration-300 hover:brightness-110" style="background-color: #7eacb5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div> -->
    <!-- </div> -->

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
            @click="confirmDeleteAccount"
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

  router.push('/LoginPage');
};

async function confirmDeleteAccount(){
  if (confirm('Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.')) {
    const response = await axios.delete(API_URL+`/users/${userId}`)

    console.log(response.data)

    alert('Richiesta di eliminazione account inviata (azione simulata)');
    // If successful, you might want to log out the user and redirect to login
    handleLogout(); // Log out after simulated deletion
  }
};

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
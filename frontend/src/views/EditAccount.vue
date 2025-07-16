<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative pt-10" style="background-color: rgb(255, 244, 234)">
    <!-- <div class="fixed top-4 left-4 right-4 z-50">
      <div class="absolute left-4">
        <router-link to="/settings">
          <button class="p-2 rounded-full transition duration-300 hover:brightness-110" style="background-color: #7eacb5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </router-link>
      </div>
    </div> -->

    <div class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden mt-16" style="background-color: #7eacb5">
      <div class="p-6 flex flex-col gap-3"> <div v-if="error" class="p-3 rounded-lg text-center" style="background-color: rgba(255, 100, 100, 0.2); color: rgb(255, 244, 234);">
          {{ error }}
        </div>

        <div v-if="success" class="p-3 rounded-lg text-center" style="background-color: rgba(100, 255, 100, 0.2); color: rgb(255, 244, 234);">
          {{ success }}
        </div>

        <div>
          <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Cambia Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full p-3 rounded-lg focus:outline-none"
            style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
            placeholder="Nuovo username"
          >
        </div>

        <div>
          <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Cambia Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full p-3 rounded-lg focus:outline-none"
            style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
            placeholder="Nuova email"
          >
        </div>

        <div>
          <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Cambia Password attuale</label>
          <input
            v-model="currentPassword"
            type="password"
            class="w-full p-3 rounded-lg focus:outline-none"
            style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
            placeholder="Inserisci la password attuale"
            @input="checkPasswordFields"
          >
        </div>

        <div v-if="showPasswordFields">
          <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Nuova Password</label>
          <input
            v-model="newPassword"
            type="password"
            required
            class="w-full p-3 rounded-lg focus:outline-none"
            style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
            placeholder="Inserisci la nuova password"
          >
        </div>

        <div v-if="showPasswordFields">
          <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Conferma Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="w-full p-3 rounded-lg focus:outline-none"
            style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
            placeholder="Conferma la nuova password"
          >
          <p v-if="passwordMismatch" class="text-sm mt-1" style="color: rgb(255, 200, 200);">Le password non corrispondono</p>
        </div>

        <button
          @click="updateAccount"
          :disabled="isSubmitting || passwordMismatch"
          class="w-full py-3 rounded-lg font-bold mt-4 transition-all duration-300 hover:shadow-lg hover:brightness-110"
          style="background-color: #c96868; color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
        >
          <span v-if="!isSubmitting">Salva Modifiche</span>
          <span v-else>Salvataggio in corso...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
const API_URL = HOST + '/api/v1';
const USERS_URL = API_URL + '/users';

const router = useRouter();

const username = ref('');
const email = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPasswordFields = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const passwordMismatch = computed(() => {
  return showPasswordFields.value && newPassword.value !== confirmPassword.value && confirmPassword.value !== '';
});

const checkPasswordFields = () => {
  showPasswordFields.value = currentPassword.value.trim() !== '';
};

const updateAccount = async () => {
  if (passwordMismatch.value) {
    error.value = 'Le nuove password non corrispondono';
    return;
  }

  if (showPasswordFields.value) {
    if (!newPassword.value || !confirmPassword.value) {
      error.value = 'Inserisci e conferma la nuova password';
      return;
    }
    
    // Aggiungi questo controllo
    if (newPassword.value === currentPassword.value) {
      error.value = 'La nuova password non può essere uguale a quella attuale';
      return;
    }
  }

  isSubmitting.value = true;
  error.value = '';
  success.value = '';

  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    const user = await axios.get(API_URL+`/users/${userId}`)

    const updateData = {
      username: user.data.username,
      name: user.data.name,
      surname: user.data.name,
      email: user.data.email,
      description: user.data.description,
      profile_url: user.data.profile_url
    };
    
    if (username.value) updateData.username = username.value;
    if (email.value) updateData.email = email.value;
    
    if (showPasswordFields.value) {
      updateData.currentPassword = currentPassword.value;
      updateData.newPassword = newPassword.value;
    }

    const response = await axios.put(
      USERS_URL + `/${userId}`,
      updateData,
      {
        headers: {
          Authorization: ` ${token}`
        }
      }
    );

    success.value = 'Account aggiornato con successo!';
    setTimeout(() => {
      router.push('/Settings');
    }, 1500);

  } catch (err) {
    console.error('Error updating account:', err);
    error.value = err.response?.data?.message || 'Errore durante l\'aggiornamento dell\'account';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
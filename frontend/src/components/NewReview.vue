<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <!-- Header with back button -->
    <div class="fixed top-4 left-4 right-4 z-50">
      
    </div>

    <!-- Main container -->
    <div class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden mt-16" style="background-color: #7eacb5">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-center mb-2" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
          Scrivi una Recensione
        </h1>
        
        <!-- User being reviewed -->
        <p class="text-center mb-6" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
          Per: {{ reviewedUser.username  }} 
        </p>

        <!-- Error message -->
        <div v-if="error" class="mb-4 p-3 rounded-lg text-center" style="background-color: rgba(255, 100, 100, 0.2); color: rgb(255, 244, 234);">
          {{ error }}
        </div>

        <!-- Success message -->
        <div v-if="success" class="mb-4 p-3 rounded-lg text-center" style="background-color: rgba(100, 255, 100, 0.2); color: rgb(255, 244, 234);">
          {{ success }}
        </div>

        <!-- Review form -->
        <div class="mb-6">
          <label class="block mb-2" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Recensione
          </label>
          <textarea
            v-model="comment"
            class="w-full p-3 rounded-lg focus:outline-none"
            style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif; min-height: 150px;"
            placeholder="Descrivi la tua esperienza con questo utente..."
          ></textarea>
        </div>

        <!-- Submit button -->
        <button
          @click="submitReview"
          :disabled="isSubmitting || !comment.trim()"
          class="w-full py-3 rounded-lg font-bold mt-4 disabled:opacity-50 transition duration-300 hover:opacity-70"
          style="background-color: rgb(201, 104, 104); color: #fff4ea; font-family: 'Poppins', sans-serif;"
        >
          <span v-if="!isSubmitting">Pubblica Recensione</span>
          <span v-else>Invio in corso...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
const API_URL = HOST + '/api/v1';
const REVIEWS_URL = API_URL + '/reviews';
const USERS_URL = API_URL + '/users';

const router = useRouter();
const route = useRoute();


const reviewedUser = ref({});

const comment = ref('');
const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const goBack = () => {
  router.go(-1);
};

// 

onMounted(async () => {
  try {
    const response = await axios.get(`${USERS_URL}/${route.params.userId}`);
    reviewedUser.value = response.data;
    console.log('Reviewed User:', reviewedUser.value);
  } catch (err) {
    console.error('Error fetching user data:', err);
  }
});


const submitReview = async () => {
  if (!comment.value.trim()) {
    error.value = 'Scrivi una recensione';
    return;
  }

  isSubmitting.value = true;
  error.value = '';
  success.value = '';

  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    const response = await axios.post(REVIEWS_URL,{
      reviewer: userId,
      reviewed: route.params.userId,
      text: comment.value
    },{
      headers:{ Authorization: ` ${token}`}
    })

    success.value = 'Recensione pubblicata con successo!';
    setTimeout(() => {
      router.push(`/UserProfile1/${route.params.userId}`);
    }, 1500);
    
    
  } catch (err) {
    console.error('Error submitting review:', err);
    error.value = err.response?.data?.message || 'Errore durante la pubblicazione';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>
<template>
     <!-- HEADER (rimane invariato) -->
     <header class="bg-white shadow-sm">
    </header>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <!-- User Info Panel -->
      <div class="bg-white p-6 rounded-xl shadow-lg w-96 text-center mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4">INFO</h2>
        <p class="text-sm text-gray-600">
          <span class="font-semibold">Title:</span> {{ Title }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-semibold">Username:</span> {{ username }}
        </p>
        <p class="text-sm text-gray-600 mb-4">
          <span class="font-semibold">Decsription:</span> {{ description }}
        </p>
        <button
    @click="handleModifyTitle"
    class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors"
  >
    Change Title
  </button>
  <div v-if="showNameFields" class="mt-2">
    <input
      v-model="newName"
      type="text"
      placeholder="New Name"
      class="w-full px-3 py-2 border rounded-lg mb-2"
    />
    <input
      v-model="newSurname"
      type="text"
      placeholder="New Surname"
      class="w-full px-3 py-2 border rounded-lg mb-2"
    />
    <button
      @click="handleConfirmName"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
    >
      Confirm Name
    </button>
  </div>

  <!-- Change Username -->
  <button
    @click="handleChangeUsername"
    class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mt-2"
  >
    Change Username
  </button>
  <div v-if="showUsernameField" class="mt-2">
    <input
      v-model="newUsername"
      type="text"
      placeholder="New Username"
      class="w-full px-3 py-2 border rounded-lg mb-2"
    />
    <button
      @click="handleConfirmUsername"
      class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
    >
      Confirm Username
    </button>
  </div>
        <button
          @click="handleChangeEmail"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mb-2 mt-2"
        >
          Change Email
        </button>
        <div v-if="showEmailField" class="mt-2">
          <input
            v-model="newEmail"
            type="email"
            placeholder="New Email"
            class="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <button
            @click="handleConfirmEmail"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
          >
            Confirm Email
          </button>
        </div>
    
        <button
          @click="handleChangePassword"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors "
        >
          Change Password
        </button>
        <div v-if="showPasswordFields" class="mt-2">
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            class="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
          <button
            @click="handleConfirmPassword"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors"
          >
            Confirm Password
          </button>
        </div>
      </div>
    
      <!-- Modify Restaurant Button -->
      <button
        @click="toggleModifyForm"
        class="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg mb-8"
      >
        {{ showModifyForm ? 'Hide Restaurant Form' : 'Modify Restaurant Data' }}
      </button>
    
      <!-- Restaurant Form (Conditional) -->
      <div v-if="showModifyForm" class="min-h-screen bg-gray-50 flex flex-col items-center p-6 w-1/3">
        <div class="bg-white p-6 rounded-xl shadow-lg w-full">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
            Modifica il tuo Ristorante
          </h2>
          <form @submit.prevent="updateRestaurant" class="space-y-6">
            <!-- Campi del ristorante -->
            <div>
              <label for="name" class="block text-lg font-medium text-gray-700">Nome</label>
              <input
                type="text"
                id="name"
                v-model="restaurant.name"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label for="address" class="block text-lg font-medium text-gray-700">Indirizzo</label>
              <input
                type="text"
                id="address"
                v-model="restaurant.address"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label for="category" class="block text-lg font-medium text-gray-700">Categoria</label>
              <input
                type="text"
                id="category"
                v-model="restaurant.category"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div>
              <label for="price" class="block text-lg font-medium text-gray-700">Prezzo</label>
              <select
                id="price"
                v-model="restaurant.price"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              >
                <option disabled value="">Seleziona un'opzione</option>
                <option value="0-10">0-10</option>
                <option value="10-20">10-20</option>
                <option value="20-40">20-40</option>
                <option value="40-60">40-60</option>
                <option value="60-100">60-100</option>
                <option value="100+">100+</option>
              </select>
            </div>
            <div>
              <label for="profile_url" class="block text-lg font-medium text-gray-700">URL Foto</label>
              <input
                type="url"
                id="profile_url"
                v-model="restaurant.profile_url"
                required
                class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
    
            <!-- Dishes Section -->
            <div>
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Piatti</h3>
              <!-- Lista dei piatti -->
              <div
                v-for="(dish, index) in restaurant.dishes"
                :key="index"
                class="p-4 border border-gray-300 rounded-md mb-4"
              >
                <!-- Modalità modifica: input per nome e URL, pulsante Salva -->
                <div v-if="dish.editing">
                  <div class="mb-2">
                    <label :for="'dish-name-' + index" class="block text-lg font-medium text-gray-700">Nome Piatto</label>
                    <input
                      type="text"
                      :id="'dish-name-' + index"
                      v-model="dish.name"
                      required
                      class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                  </div>
                  <div class="mb-2">
                    <label :for="'dish-photo-' + index" class="block text-lg font-medium text-gray-700">URL Foto Piatto</label>
                    <input
                      type="url"
                      :id="'dish-photo-' + index"
                      v-model="dish.photo_url"
                      required
                      class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                  </div>
                  <div class="flex space-x-2">
                    <button
                      type="button"
                      @click="saveDish(index)"
                      class="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Salva
                    </button>
                    <button
                      type="button"
                      @click="removeDish(index)"
                      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
                <!-- Modalità visualizzazione: mostra nome e URL come testo con pulsanti per modificare o rimuovere -->
                <div v-else>
                  <p class="text-lg font-medium text-gray-700">Nome: {{ dish.name }}</p>
                  <p class="text-gray-600">
                    Foto:
                    <a :href="dish.photo_url" target="_blank" class="text-blue-500 hover:underline">
                      {{ dish.photo_url }}
                    </a>
                  </p>
                  <div class="flex space-x-2 mt-2">
                    <button
                      type="button"
                      @click="editDish(index)"
                      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Modifica
                    </button>
                    <button
                      type="button"
                      @click="removeDish(index)"
                      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              </div>
              <!-- Pulsante per aggiungere un nuovo piatto -->
              <button
                type="button"
                @click="addDish"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Aggiungi Piatto
              </button>
            </div>
          </form>
          <div v-if="message" class="mt-4 text-green-600 font-semibold text-center text-sm">
            {{ message }}
          </div>
        </div>
        <div class="mt-6">
    <button
      type="submit"
      class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
    >
      Save Restaurant Changes
    </button>
  </div>
      </div>
    </div>
  </template>
  
<script setup>
import {ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { modifyDescription, modifyTitle } from '@/services/listings';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

const router = useRouter();

// const listing = {
//     title: '',
//     userId: '',
//     description: '',
//     listing_url: '',
//     status: '',
//     availabile: true
// }

const listing = defineProps({
    type:Object,
    required: true
})


const navigateTo=(routePath) =>{
    router.push(routePath);
}

const userId = localStorage.getItem('userId');


const showModify = ref(false);
const toggleModify = () =>{
    showModify.value = !showModify.value;
}

const handleModifyTitle = async () =>{
    modifyTitle(listing._id,newTitle).catch(err => console.log(err));
}

const handleModifyDescription = async () =>{
    modifyDescription(listing._id,newDescription);
}

const handleModifyStatus = async () =>{
    modifyStatus(listing._id,newStatus);
}

const archive = async() =>{
    archive(listing._id);
}

onMounted(async() =>{
    try{
        console.log(listing._id);
        const res = await axios.get(API_URL+`listings/${listing._id}`);
        listing.value = res.data;
    }catch(error){
        console.error('Errore nel recuper dei dati',error);
    }
})
</script>
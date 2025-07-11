<template>
  <nav class="bg-background_2 shadow w-full fixed top-0 left-0 right-0 z-50">
    <div class="container mx-auto h-20 flex items-center justify-between px-6">
      <!-- Logo con margine aggiuntivo -->
      <router-link to="/" class="flex items-center mr-10">
        <img src="@/assets/logo.svg" alt="Logo" class="h-10 w-10" />
      </router-link>

      <!-- Menu con spaziature ottimizzate -->
      <div class="flex flex-1 justify-center">
        <div class="flex space-x-10 max-w-2xl w-full justify-evenly">
          <router-link 
            to="/" 
            class="text-text_1 hover:text-button_2 transition-colors px-5 py-2 rounded-md text-lg font-semibold whitespace-nowrap"
            active-class="text-button_2 font-bold border-b-2 border-button_2"
          >
            Home
          </router-link>
          <router-link 
            to="/cerca" 
            class="text-text_1 hover:text-button_2 transition-colors px-5 py-2 rounded-md text-lg font-semibold whitespace-nowrap"
            active-class="text-button_2 font-bold border-b-2 border-button_2"
          >
            Cerca
          </router-link>
          <router-link 
            to="/messaggi" 
            class="text-text_1 hover:text-button_2 transition-colors px-5 py-2 rounded-md text-lg font-semibold whitespace-nowrap"
            active-class="text-button_2 font-bold border-b-2 border-button_2"
          >
            Messaggi
          </router-link>
          <router-link 
            to="/profilo" 
            class="text-text_1 hover:text-button_2 transition-colors px-5 py-2 rounded-md text-lg font-semibold whitespace-nowrap"
            active-class="text-button_2 font-bold border-b-2 border-button_2"
          >
            Profilo
          </router-link>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.state.isLoggedIn);
const username = computed(() => store.state.username);

const logout = async () => {
  try {
    await store.dispatch('logout');
    router.push('/login');
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


function newFunction() {
    return "text-text_1 hover:text-button_2 transition-colors px-5 py-2 rounded-md text-lg font-semibold whitespace-nowrap";
}
</script>
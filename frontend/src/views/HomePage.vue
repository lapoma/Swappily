<template>
  <div class="w-full min-h-screen bg-white">
    <div class="w-full px-4 py-16 mx-auto">
      <div class="w-full px-4 mb-12">
        <SearchBar />
      </div>

      <div class="w-full text-center">
        <h1 class="text-4xl font-extrabold text-dark_gray sm:text-6xl">
          SWAPPILY
        </h1>

        <p class="mt-4 sm:text-xl/relaxed">
          trova ciò che ti serve e scambialo con ciò che non usi più
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <!-- Mostra registrati e accedi solo se NON loggato -->
          <template v-if="!isLoggedIn">
            <button 
              class="mt-4 px-4 py-2 bg-button_2 text-text_1 rounded-md hover:bg-button_2_hover text-lg font-medium shadow-md"
              @click="regist">
              Registrati
            </button>
            <button 
              class="mt-4 px-4 py-2 bg-button_2 text-text_1 rounded-md hover:bg-button_2_hover text-lg font-medium shadow-md"
              @click="login">
              Accedi
            </button>
          </template>

          <!-- Mostra logout solo se loggato -->
          <button
            v-else
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-lg font-medium shadow-md"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchBar from '@/components/SearchBar.vue';
import { isLoggedIn, logout } from '@/authState';

export default {
  name: "HomePage",
  components: { SearchBar },
  computed: {
    isLoggedIn() {
      return isLoggedIn.value;
    }
  },
  methods: {
    regist() {
      this.$router.push('/RegisterPage');
    },
    login() {
      this.$router.push('/LoginPage');
    },
    logout() {
      logout();
      this.$router.push('/');
    }
  }
};
</script>


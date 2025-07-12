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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue'; 
export default {
    name: "HomePage",
    components: { 
        SearchBar
    },
    methods: {
        regist() {
            this.$router.push('/RegisterPage');
        },
        login() {
          this.$router.push('/LoginPage')
        }
    }
};
</script>
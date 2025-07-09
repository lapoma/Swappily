<template>
  <div class="bg-white rounded-b-full">
    <div class="mx-auto px-4 py-32">
        <div class="mx-auto max-w-xl text-center">
          <h1 class="text-4xl font-extrabold text-dark_gray sm:text-6xl">
            SWAPPILY
          </h1>

          <p class="mt-4 sm:text-xl/relaxed">
            trova ciò che ti serve e scambialo con ciò che non usi più
          </p>

          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <!-- <router-link to="/RegisterPage"> -->
              <button class="mt-4 px-4 py-2 bg-button_2 text-text_1 rounded-md hover:bg-button_2_hover text-lg font-medium shadow-md"
                  @click ="regist">
                Registrati
              </button>
            <!-- </router-link> -->
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { useRouter,RouterLink } from 'vue-router';
export default {
    name: "HomePage",
    methods: {
        regist() {
            this.$router.push('/RegisterPage');
        }
    }
};
</script>
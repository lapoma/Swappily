<script setup>
import NavigationBar from './components/NavigationBar.vue';
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Controlla se la rotta corrente è quella dell'operatore
const hideNavbar = computed(() => {
  // Puoi controllare per nome oppure per path
  // oppure
  return route.path.startsWith('/OperatorPage')
})
</script>

<template>
  <div class="app-container">
    <NavigationBar v-if="!hideNavbar" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* Rimuovi tutti gli stili esistenti e sostituisci con: */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw; /* Occupa tutta la larghezza dello schermo */
  overflow-x: hidden; /* Previene scroll orizzontale indesiderato */
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 0; /* Rimuovi il padding predefinito */
  margin-top: 0px; /* Compensa l'altezza della navbar fixed */
}
</style>
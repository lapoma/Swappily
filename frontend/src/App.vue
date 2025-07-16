<script setup>
import NavigationBar from './components/NavigationBar.vue';
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const hideNavbar = computed(() => {
  
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
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw; 
  overflow-x: hidden; 
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 0;
  margin-top: 0px; 
}
</style>
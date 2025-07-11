<template>
  <div class="notification-page">
   <div>
    <Navbar /> <!-- Importato automaticamente -->
    <router-view />
  </div>
    <!-- Area notifiche -->
    <div class="notifications-container">
      <div class="empty-notifications">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h2>Nessuna notifica</h2>
        <p>Non hai ancora ricevuto nessuna notifica</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/NavigationBar.vue'

export default {
  name: 'NotificationPage'
}
</script>

<style scoped>
.notification-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Stili identici a MessagePage ma con nomi modificati */
.notifications-container {
  flex: 0 1 auto;
  margin-top: 60px;
  padding: 0px;
  background-color: rgb(255, 244, 234);
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-notifications {
  text-align: center;
  color: #666;
  max-width: 500px;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.empty-notifications svg {
  margin: 0 auto 20px;
  color: #ccc;
}

.empty-notifications h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-notifications p {
  font-size: 1rem;
  color: #999;
}


</style>
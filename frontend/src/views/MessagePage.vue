<template>
  <div class="messages-page">
    <div>
    <Navbar /> 
    <router-view />
  </div>

    <!-- Area messaggi -->
    <div class="messages-container">
      <div class="empty-messages">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2>Nessun messaggio</h2>
        <p>Non hai ancora ricevuto nessun messaggio</p>
      </div>
    </div>
  </div>
  
</template>

<script>
import Navbar from '@/components/NavigationBar.vue'
export default {
  name: 'MessagesPage'
}

</script>

<style scoped>
.messages-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}


.messages-container {
  flex: 0 1 auto; 
  margin-top: 60px; 
  padding: 0px;
  background-color: rgb(255, 244, 234);
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-messages {
  text-align: center;
  color: rgb(255, 244, 234);
  max-width: 500px;
  padding: 40px;
  background-color: #7eacb5;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.empty-messages svg {
  margin: 0 auto 20px;
  color: rgb(255, 244, 234);
}

.empty-messages h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-messages p {
  font-size: 1rem;
  color: rgb(255, 244, 234);
}
</style>
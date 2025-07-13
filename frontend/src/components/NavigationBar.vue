<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <img src="@/assets/Logo.png" alt="Logo" />
      </div>

      <!-- Menu -->
      <div class="menu-container">
        <div class="menu">
          <router-link to="/" class="nav-link" exact-active-class="active">
            Home
          </router-link>

          <router-link
            :to="isLoggedIn ? '/NotificationPage' : '/LoginPage'"
            class="nav-link"
            :class="{ active: isLoggedIn && $route.path.startsWith('/NotificationPage') }"
          >
            Notifiche
          </router-link>

          <router-link
            :to="isLoggedIn ? '/MessagePage' : '/LoginPage'"
            class="nav-link"
            :class="{ active: isLoggedIn && $route.path.startsWith('/MessagePage') }"
          >
            Messaggi
          </router-link>

          <router-link to="/LoginPage" class="nav-link" exact-active-class="active">
            Login
          </router-link>

          <router-link
            :to="isLoggedIn ? userProfilePath() : '/LoginPage'"
            class="nav-link"
            :class="{ active: isLoggedIn && $route.path.startsWith('/UserProfile') }"
          >
            Profilo
          </router-link>
          
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// export default {
//   name: 'Navbar'
// }
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { isLoggedIn, logout } from '@/authState'

const router = useRouter();
const store = useStore();
function handleLogout() {
  logout()
  router.push('/')
}
// Controlla se l'utente è loggato
// const isLoggedIn = computed(() => {
//   // Se usi Vuex:
//   return store.state.isLoggedIn;
//   // Oppure, se usi solo localStorage:
//   // return !!localStorage.getItem('token');
// });

function userProfilePath() {
  const userId = localStorage.getItem('userId');
  return `/UserProfile/${userId}`;
}
</script>


<style scoped>
.navbar {
  background-color: #7eacb5; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 80px;
}

.navbar-container {
  display: flex;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

.logo {
  position: absolute;
  left: -30px;
}

.logo img {
  height: 90px;
  width: 110px;
}

.menu-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: rgb(255, 244, 234);
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #C1FACD; 
}

.active {
  color: rgb(255, 244, 234);
  font-weight: 700;
  border-bottom: 2px solid rgb(255, 244, 234);
}
</style>
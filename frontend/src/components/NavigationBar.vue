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
         
          <router-link 
            to="/" 
            class="nav-link"
            exact-active-class="active"
          >
            Home
          </router-link>
        <!-- Per ora non serve essere loggati perchè è in testing -->
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

          <router-link 
            to="/LoginPage" 
            class="nav-link"
            exact-active-class="active"
          >
            Login
          </router-link>

          <router-link 
            :to="isLoggedIn ? '/profilo' : '/LoginPage'" 
            class="nav-link"
            :class="{ active: isLoggedIn && $route.path.startsWith('/profilo') }"
         >
            Profilo
</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.state.isLoggedIn);

const handleProtectedClick = (routeName) => {
  if (!isLoggedIn.value) {
    router.push('/LoginPage');
  } else {
    router.push({ name: routeName });
  }
};
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
  height: 80px;
  width: 80px;
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
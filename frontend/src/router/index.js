import { createRouter, createWebHistory  } from "vue-router";
import store from "../services/store";
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: () => import('../views/HomePage.vue')
        },
        {
            path: '/LoginPage',
            name: 'LoginPage',
            component: LoginPage
        },
        {
            path: '/RegisterPage',
            name:'RegisterPage',
            component: RegisterPage
        }
    ]
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.isLoggedIn; 
    const userRole = store.state.role; 

    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        return next('/LoginPage'); // Se non è autenticato, rimanda al login
      }
      if (to.meta.role && to.meta.role !== userRole) {
        return next('/'); // Se il ruolo non è autorizzato, rimanda alla home
      }
    }
    next();
});

export default router;
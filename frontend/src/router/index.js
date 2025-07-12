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
        },
      //   {
      //       path: '/mock-listing',
      //       name: 'MockListing',
      //       component: () => import('../views/ListingTableMockView.vue')
      // },
        {
          path: '/UserProfile/:id',
          name: 'UserProfile',
          component: () => import('../views/UserProfile.vue'),
        },
         {
          path: '/MessagePage/', //per ora non c'è :id perchè sono in testing
          name: 'MessagePage',
          component: () => import('../views/MessagePage.vue'),
              meta: { requiresAuth: true } 
        },
        {
            path: '/NotificationPage', //per ora non c'è :id perchè sono in testing
            name:'NotificationPage',
            component: () => import('../views/NotificationPage.vue')
        },
        {
            path: '/HomePage1', 
            name:'HomePage1',
            component: () => import('../views/HomePage1.vue')
        },
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
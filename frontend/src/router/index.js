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
        {
            path: '/mock-listing',
            name: 'MockListing',
            component: () => import('../components/ListingTable.vue'),
            props: { mockData: { id: 1, title: 'Mock Listing', description: 'This is a mock listing.', status: 'ok', user_id: 1, available: true }, mockUser: { id: 1, name: 'John Doe', favoriteList: [1] } } // Passa i dati di esempio come props
        },
        {
          path: '/UserProfile/:id',
          name: 'UserProfile',
          component: () => import('../views/UserProfile.vue'),
          props: true
        },
        {
            path: '/mock-user-profile',
            name: 'MockUserProfile',
            component: () => import('../views/UserProfile.vue'),
            props: { mockUser: {id: 1, username: 'john_doe', name: 'John', surname: 'Doe', favoriteList: [1],email: 'johndoe@email.com' } } // Passa i dati di esempio come props
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
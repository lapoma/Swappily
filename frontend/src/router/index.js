import { createRouter, createWebHistory  } from "vue-router";
import store from "../services/store";
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', 
            name:'HomePage1',
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
        // {
        //   path: '/UserProfile/:id',
        //   name: 'UserProfile',
        //   component: () => import('../views/UserProfile.vue'),
        //   props: true
        // },
        {
          path: '/UserProfile1/:userId',
          name: 'UserProfile1',
          component: () => import('../views/UserProfile1.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/UserProfile2/:userId',
          name: 'UserProfile2',
          component: () => import('../views/UserProfile2.vue'),
          props:true
        },
         {
          path: '/MessagePage/', 
          name: 'MessagePage',
          component: () => import('../views/MessagePage.vue'),
              meta: { requiresAuth: true } 
        },
        {
            path: '/NotificationPage',
            name:'NotificationPage',
            component: () => import('../views/NotificationPage.vue'),
            meta: { requiresAuth: true } 
        },

        {
          path: '/EditProfile',
          name: 'EditProfile',
          component: () => import('../views/EditProfile.vue')
        },
        {
          path: '/EditAccount',
          name: 'EditAccount',
          component: () => import('../views/EditAccount.vue')
        },
        {
          path: '/ExchangePage/:listingId',
          name: 'ExchangePage',
          component: () => import('../views/ExchangePage.vue'),
          meta:{
            requiresAuth: true
          }
        },
        {
          path: '/SearchPage',
          name: 'SearchPage',
          component: () => import('../views/SearchPage.vue')
        },
        {
          path: '/Settings',
          name: 'Settings',
          component: () => import('../views/Settings.vue')
        },
        {
          path: '/NewListing',
          name: 'NewListing',
          component: () => import('../components/NewListing.vue')
        },
        {
          path: '/EditListing/:id',
          name: 'EditListing',
          component: () => import('../components/EditListing.vue')
        },
        {
          path: '/OperatorPage',
          name: 'OperatorPage',
          component: () => import('../views/OperatorPage.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/NewReview/:userId',
          name: 'NewReview',
          component: () => import('../components/NewReview.vue'),
          meta:{
            requiresAuth: true
          }
        },
        {
          path: '/NewReport',
          name: 'NewReport',
          component: () => import('../components/NewReport.vue'),
          meta:{
            requiresAuth: true
          }
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
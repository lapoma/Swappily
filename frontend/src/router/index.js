import { createRouter, createWebHistory  } from "vue-router";
import store from "../services/store";
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/HomePageOld',
            name: 'HomePage',
            component: () => import('../views/HomePageOld.vue')
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
          props: true
        },
        {
          path: '/UserProfile1/:userId',
          name: 'UserProfile1',
          component: () => import('../views/UserProfile1.vue'),
          props: true
        },
        {
          path: '/UserProfile2/:userId',
          name: 'UserProfile2',
          component: () => import('../views/UserProfile2.vue'),
          props:true
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
            component: () => import('../views/NotificationPage.vue'),
            meta: { requiresAuth: true } 
        },
        {
            path: '/', 
            name:'HomePage1',
            component: () => import('../views/HomePage.vue')
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
          path: '/OperatorPage',
          name: 'OperatorPage',
          component: () => import('../views/OperatorPage.vue')
        },
        {
          path: '/NewReview',
          name: 'NewReview',
          component: () => import('../components/NewReview.vue')
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
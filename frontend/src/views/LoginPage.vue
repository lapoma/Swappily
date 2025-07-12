<template>
  <div>
    <div class="flex justify-center items-center h-screen">
      <div class="bg-white p-8 sm:p-12 rounded-lg shadow-lg w-full max-w-md">
        <h2
          class="text-2xl sm:text-3xl font-medium text-text_2 mb-8 text-center"
        >
          Accedi al tuo Account
        </h2>

        <!-- Messaggio di errore -->
        <div
          v-if="error"
          class="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg"
        >
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="flex flex-col mb-6">
            <label for="username" class="text-sm font-medium text-text_3 mb-1"
              >Username</label
            >
            <div
              class="flex items-center border rounded-lg text-text_3 bg-gray-50 focus-within:ring-2 focus-within:button_1_hover"
            >
              <input
                id="username"
                type="username"
                v-model="username"
                class="flex-1 px-3 py-2 bg-transparent outline-none"
                placeholder="username"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="flex flex-col mb-4">
            <label for="password" class="text-sm font-medium text-text_3 mb-1"
              >Password</label
            >
            <div
              class="flex items-center border rounded-lg text-text_3 bg-gray-50 focus-within:ring-2 focus-within:button_1_hover"
            >
              <input
                id="password"
                type="password"
                v-model="password"
                class="flex-1 px-3 py-2 bg-transparent outline-none"
                placeholder="********"
              />
            </div>
          </div>

          <!-- Pulsante Login -->
            <button
              type="submit"
              class="w-full px-6 py-3 bg-button_2 text-text_1 font-medium rounded-lg hover:bg-button_2_hover"
            >
              Accedi
            </button>
        </form>

        <div class="mt-6 text-center text-sm text-text_3">
          Non hai un account?
          <span class="text-button_1_hover hover:underline">
            <router-link to="/RegisterPage">Registrati</router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import router from "../router";
import { RouterLink } from "vue-router";
//import {userStore} from "vuex";

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

export default {
    name:"LoginPage",
    data() {
        return {
            username: "",
            password: "",
            error: ""
        };
    },
    methods: {
        pushPath(path){
            this.$router.push(path);
        },
        async handleLogin() {
            this.error="";
            if(!this.username | !this.password){
                this.error='Incomplete fields';
                return;
            }

            const authData = {
                username: this.username,
                password: this.password
            };
            
            try{
                let response;


                //CONSOLE LOG AUTHDATA
                console.log(authData);





                response = await axios.post(API_URL+`/authentications`, authData);
                const user = await axios.get(API_URL+`/users/${response.data.id}`,);
                console.log(user);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('username',response.data.username);
                localStorage.setItem('userType', user.data.usertype);
                
                console.log(localStorage.getItem("token"));

                this.$store.dispatch("login",{username: this.username, userType: this.userType});

                this.$router.push("/");
            }catch(error){
              console.log(error)
                this.error = error.response?.data?.message || "Errore nel Login. Riprova.";
            }
        }
    }
}
</script>

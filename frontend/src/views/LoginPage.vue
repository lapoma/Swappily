<template>
  <div>
    <div class="flex justify-center items-start h-screen pt-12 sm:pt-24">
      <!-- MODIFICATO: sfondo blu -->
      <div
        class="p-8 sm:p-7 rounded-lg shadow-lg w-full max-w-md"
        style="background-color: #7eacb5"
      >
        <!-- MODIFICATO: testo color crema -->
        <h2
          class="text-2xl sm:text-3xl font-medium mb-8 text-center"
          style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 700;"
        >
          Login
        </h2>

        <!-- Messaggio di errore -->
        <div
          v-if="error"
          class="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg"
        >
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          <!-- Email -->
          <div class="flex flex-col mb-6">
            <label
              for="username"
              class="text-sm font-medium mb-1"
              style="color: rgb(255, 244, 234)"
            >
              Username
            </label>
            <div
              class="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-white"
            >
              <input
                id="username"
                type="text"
                v-model="username"
                class="flex-1 px-3 py-2 bg-transparent outline-none"
                placeholder="username"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="flex flex-col mb-6">
            <label
              for="password"
              class="text-sm font-medium mb-1"
              style="color: rgb(255, 244, 234)"
            >
              Password
            </label>
            <div
              class="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-white"
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

          <!-- MODIFICATO: pulsante Accedi personalizzato -->
          <button
            type="submit"
            class="w-full px-6 py-3 rounded-lg font-bold transition hover:bg-red-300 hover:shadow-lg"
            style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 1.3rem; font-weight: 750;"
          >
            Accedi
          </button>
        </form>

        <!-- MODIFICATO: testo color crema -->
        <div class="mt-6 text-center text-sm" style="color: rgb(255, 244, 234)">
          Non hai un account?
          <router-link
            to="/RegisterPage"
            class="text-red-300 hover:underline font-bold"
          >
            Registrati
          </router-link>
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

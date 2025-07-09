<template>
  <div>
    <div class="flex justify-center items-center h-screen">
      <div class="bg-white p-8 sm:p-12 rounded-lg shadow-lg w-full max-w-4xl">
        <h2
          class="text-2xl sm:text-3xl font-medium text-text_2 mb-8 text-center"
        >
          Crea il tuo Account
        </h2>

        <!-- Messaggio di errore -->
        <div
          v-if="error"
          class="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Username -->
          <div class="flex flex-col">
            <label for="username" class="text-sm font-medium text-text_3 mb-1"
              >Username</label
            >
            <div
              class="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:button_1_hover"
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

          <!-- Seleziona Ruolo -->
          <div class="flex flex-col">
            <label for="role" class="text-sm font-medium text-text_3 mb-1"
              >Seleziona Ruolo</label
            >
            <select
              id="role"
              v-model="ruolo"
              class="border rounded-lg px-3 py-2 text-text_3 bg-gray-50 focus:ring-2 focus:button_1_hover outline-none"
            >
              <option value="user">Utente</option>
              <option value="admin">Operatore</option>
            </select>
          </div>

          <!-- Email -->
          <div class="flex flex-col">
            <label for="email" class="text-sm font-medium text-text_3 mb-1"
              >Email</label
            >
            <div
              class="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:button_1_hover"
            >
              <input
                id="email"
                type="email"
                v-model="email"
                class="flex-1 px-3 py-2 bg-transparent outline-none"
                placeholder="email@address.com"
              />
            </div>
          </div>

          <!-- Nome -->
          <div class="flex flex-col">
            <label for="nome" class="text-sm font-medium text-text_3 mb-1"
              >Nome</label
            >
            <input
              id="nome"
              type="text"
              v-model="nome"
              class="border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:button_1_hover outline-none"
              placeholder="Nome"
            />
          </div>

          <!-- Cognome -->
          <div class="flex flex-col">
            <label for="cognome" class="text-sm font-medium text-text_3 mb-1"
              >Cognome</label
            >
            <input
              id="cognome"
              type="text"
              v-model="cognome"
              class="border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:button_1_hover outline-none"
              placeholder="Cognome"
            />
          </div>

          <!-- Password -->
          <div class="flex flex-col">
            <label for="password" class="text-sm font-medium text-text_3 mb-1"
              >Password</label
            >
            <div
              class="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:button_1_hover"
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

          <!-- Bottoni -->
          <div class="mt-8 text-center">
              <button
              class="w-full px-6 py-3 bg-button_2 text-text_1 font-medium rounded-lg hover:bg-button_2_hover"
              type="submit"
              >
              Registrati
            </button>
          </div>

      </form>

        <div class="mt-4 text-center text-sm text-text_3">
          Hai già un account?
          <span href="#" class="text-button_1_hover hover:underline"
            ><router-link to="/Login">Accedi qui</router-link></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

export default {
  name: "RegisterPage",

  data(){
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      surname: "",
      userType: "Utente",
      error: ""
    };
  },

  methods: {
    async handleRegister() {
        this.error="";
        if (!this.email || !this.password ||  !this.user_name || !this.name || !this.surname) {
        this.error = 'Required fields are missing';
        return;
        }

        if(!this.checkIfEmailInString(this.email)){
            this.error = 'Email must be in a valid format';
            return;
        }

        if(!this.checkPassword(this.password)){
            this.error ='Password must be 8+ chars with uppercase, lowercase, number, special char' ;
            return;
        }

        if(!this.checkUsername(this.username)){
           this.error ='"username" must be 3-20 chars, and unique';
           return; 
        }

        const authData = {
        username: this.username,
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surnname,
        userType: "user" 
      };

        try {
        let response;
        let auth;
        response = await axios.post(API_URL+`/users`, authData);
        auth = await axios.post(API_URL+`/authentications`,{
            username: this.username,
            password: this.password
        });
        console.log(response);
        // Se la richiesta ha successo, resetta gli errori e continua
        this.errorMessage = "";
        console.log(user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username',response.data.username);
        localStorage.setItem('userType', user.data.userType);
                
        console.log(JSON.parse(localStorage.getItem('user')));

        this.$store.dispatch("login",{username: this.username, userType: this.userType});

        this.$router.push("Home");

      } catch (error) {
        // Gestione errore: aggiorna il messaggio da mostrare
        this.errorMessage =
          error.response?.data?.message || "Errore durante la registrazione. Riprova.";
      }
    },
    checkPassword(str) {
    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,50}$/;
    return decimal.test(str);
    },
    // Username check
    checkUsername(username) {
        if (!username || username.length < 3 || username.length > 20) return false;
         return existing.length === 0;
    },
    // Email check
    checkIfEmailInString(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
  }
};
</script>
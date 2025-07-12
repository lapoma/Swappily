<template>
  <div class="min-h-screen flex items-center justify-center p-4 " style="background-color: rgb(255, 244, 234)">
    <div class="w-full max-w-md">
      <!-- Form di registrazione -->
      <form @submit.prevent="handleRegister" class="p-8 rounded-xl shadow-xl flex flex-col gap-3" 
      style="background-color: #7eacb5">
        <!-- Titolo dentro la finestra -->
        <h1 class="text-3xl font-bold mb-8 text-center" 
        style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 700;">
          Registrazione
        </h1>
        
        <!-- Messaggio di errore -->
        <div v-if="error" class="mb-6 p-4 rounded-lg" style="background-color: rgba(255, 244, 234, 0.9); color: #d32f2f">
          {{ error }}
        </div>

        <!-- Nome e Cognome -->
        <div class="mb-6">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="name">Nome</label>
          <input 
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
            v-model="name" 
            type="text" 
            id="name" 
            placeholder="Mario"
          />
        </div>
        
        <div class="mb-6">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="surname">Cognome</label>
          <input 
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
            v-model="surname" 
            type="text" 
            id="surname" 
            placeholder="Rossi"
          />
        </div>

        

        <!-- Username -->
        <div class="mb-6">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="username">Username</label>
          <input 
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
            v-model="username" 
            type="text" 
            id="username" 
            placeholder="mariorossi"
          />
        </div>

        <!-- Email -->
        <div class="mb-6">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="email">Email</label>
          <input 
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
            v-model="email" 
            type="email" 
            id="email" 
            placeholder="mario@example.com"
          />
        </div>
        <!-- Numero di telefono (opzionale) -->
        <div class="mb-6">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="phone">
            Numero di telefono <span class="text-sm font-normal">(opzionale)</span>
          </label>
          <input 
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
            v-model="phone" 
            type="tel" 
            id="phone" 
            placeholder="123 4567890"
          />
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="password">Password</label>
          <input 
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
            v-model="password" 
            type="password" 
            id="password" 
            placeholder="********"
          />
        </div>

        <!-- Conferma Password -->
        <div class="mb-6">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="confirmPassword">Conferma Password</label>
          <input 
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
            v-model="confirmPassword" 
            type="password" 
            id="confirmPassword" 
            placeholder="********"
          />
        </div>

        <!-- Ruolo -->
        <div class="mb-8">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234)" for="role">Seleziona Ruolo</label>
          <select
            id="role"
            v-model="userType"
            class="w-full px-4 py-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.9); color: #7eacb5"
          >
            <option value="utente">Utente</option>
            <option value="operatore">Operatore</option>
          </select>
        </div>

        <!-- Pulsante Registrati -->
        <button
          class="w-full py-3 px-4 rounded-lg font-bold transition duration-300 hover:opacity-90"
          style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 1.2rem; font-weight: 750;"
          type="submit"
        >
          REGISTRATI
        </button>
      </form>
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
      userType: "",
      phone: "",
      error: ""
    };
  },

  methods: {
    async handleRegister() {
        this.error = "";

        if (!this.email || !this.username || !this.name || !this.surname) {
        this.error = "Mancano campi richiesti.";
        return;
        }

        if(!this.checkIfEmailInString(this.email)){
            this.error = "L'email deve essere in formato valido.";
            return;
        }

        if(!this.checkPassword(this.password)){
            this.error = "La password deve avere almeno 8 caratteri, almeno un alettera maiuscola, una minuscula, un numero e un simbolo." ;
            return;
        }

        if(!this.checkUsername(this.username)){
           this.error = "'Username' ha meno di tre caratteri o potrebbe già essere utilizzato.";
           return; 
        }

        const authData = {
        username: this.username,
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surname,
        usertype: this.userType 
      };

        // this.$router.push('/');
        try {
        let response;
        console.log(authData);
        response = await axios.post(API_URL+`/users`, authData);
        
        console.log(response);
        // Se la richiesta ha successo, resetta gli errori e continua
        console.log(user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username',response.data.username);
        localStorage.setItem('userType', response.data.userType);
                
        console.log(JSON.parse(localStorage.getItem('user')));

        this.$store.dispatch("login",{username: this.username, userType: this.userType});

        this.$router.push('/');
        
      } catch (error) {
        console.log(error)
        // Gestione 
        // e: aggiorna il messaggio da mostrare
        this.error =
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
         return true;
    },
    // Email check
    checkIfEmailInString(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
  }
};
</script>
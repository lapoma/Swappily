<template>
  <!-- component -->
<!-- <script src="https://cdn.tailwindcss.com"></script> -->
<body class="bg-gray-100">
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Registration Form</h1>
    
    <!-- Messaggio di errore -->
      <div v-if="error"  class="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
        {{ error }}
      </div>

    <form @submit.prevent="handleRegister" class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Nome</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          v-model="name" type="text" id="name" name="name" placeholder="John" />
        <label class="block text-gray-700 text-sm font-bold mb-2" for="surname">Cognome</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="text" id="surname" v-model="surname" name="surname" placeholder="Doe"/>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="text" id="username" v-model="username" name="username" placeholder="johndoe" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="email" id="email" v-model="email" name="email" placeholder="john@example.com"/>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">Numero di telefono</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="phone" id="phone" v-model="phone" name="phone" placeholder="123456789"/>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="password" id="password" v-model="password" name="password" placeholder="********"/>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="confirmPassword">Conferma Password</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="password" id="confirmPassword" v-model="confirmPassword" name="confirmPassword" placeholder="********"/>
      </div>
      <div class="flex flex-col">
            <label for="role" class="block text-gray-700 text-sm font-bold mb-2"
              >Seleziona Ruolo</label
            >
            <select
              id="role"
              v-model="userType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            >
              <option value="user">Utente</option>
              <option value="operator">Operatore</option>
            </select>
          </div>
      <button
        class="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
        type="submit">Registrati</button>
    </form>
  </div>
</body>
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
        usertype: this.userType,
        phone: this.phone || ""
      };

        // this.$router.push('/');
        try {
        let response;
        console.log(authData);
        response = await axios.post(API_URL+`/users`, authData);
        
        console.log(response);
        // Se la richiesta ha successo, resetta gli errori e continua
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username',response.data.username);
        localStorage.setItem('userType', response.data.userType);
                
        console.log(JSON.parse(localStorage.getItem('user')));

        this.$store.dispatch("login",{username: this.username, userType: this.userType});

        this.$router.push(`/`);
        
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
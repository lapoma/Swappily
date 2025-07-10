<template>
  <!-- component -->
<!-- <script src="https://cdn.tailwindcss.com"></script> -->
<body class="bg-gray-100">
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Registration Form</h1>
    <form class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="text" id="name" name="name" placeholder="John Doe">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="email" id="email" name="email" placeholder="john@example.com">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="password" id="password" name="password" placeholder="********">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">Confirm Password</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="password" id="confirm-password" name="confirm-password" placeholder="********">
      </div>
      <button
        class="w-full bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
        type="submit">Register</button>
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
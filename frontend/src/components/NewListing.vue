<template>
  <!-- component -->
<!-- <script src="https://cdn.tailwindcss.com"></script> -->
<body class="bg-gray-100">
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Crea un annuncio</h1>
    
    <!-- Messaggio di errore -->
      <div v-if="error"  class="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
        {{ error }}
      </div>

    <form @submit.prevent="handleCreate" class="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Titolo</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          v-model="title" type="text" id="title" name="title" placeholder="" />
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Descrizione</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="text" id="description" v-model="description" name="description" placeholder=""/>
      </div>
      <form @submit.prevent="addImage">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="listing_url">Immagine ({{ n_photos }}/10)</label>
          <div class="flex gap-4">
          <!-- Input: Designation [h-12] & min-w-[12rem] -->
          
          <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="text" id="listing_url" v-model="url" name="listing_url" placeholder="" />
          <!-- Button: Submit [h-12] -->
          <button class="h-12 min-w-[8rem] rounded-lg  hover:bg-[#7eacb5] bg-[#7eacb5] text-white shadow-lg  focus:outline-none focus:ring focus:ring-[#7eacb5]">Aggiungi immagine
          </button>
          </div>
        
        </form>

      <!-- <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="listing_url">Immagine</label>
        <input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="text" id="listing_url" v-model="url" name="listing_url" placeholder="" />
      </div> -->
      <div class="flex flex-col">
            <label for="role" class="block text-gray-700 text-sm font-bold mb-2"
              >Seleziona Stato</label
            >
            <select
              id="role"
              v-model="status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7eacb5]"
            >
              <option value="As new">As new</option>
              <option value="Good">Good</option>
              <option value="Ok">Ok</option>
              <option value="Not good">Not good</option>
            </select>
          </div>
      <button
        class="w-full bg-[#7eacb5] text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-[#7eacb5] transition duration-300"
        type="submit">Crea</button>
    </form>
  </div>
</body>
</template>

<script>
import axios from "axios"
import {ref} from "vue"

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`


export default {
  name: "NewListing",

  data(){
    return {
      title: "",
      description: "",
      username: "",
      userId: "",
      status: "",
      available: "true",
      listing_url: [],
      url:"",
      n_photos: ref(0),
      error: ""
    };
  },

  methods: {
    async handleCreate() {
        const userId = localStorage.getItem("userId")
        const username = localStorage.getItem("username")
        const token = localStorage.getItem("token")
        console.log(userId)
        console.log(username)
        console.log(token)
        if(!this.title || !this.description || !this.status ){
            this.error = "Mancano campi richiesti"
            return
        }
        if(!this.checkTitle(this.title)){
            this.error = "Il titolo deve avere da 3 a 50 caratteri"
            return
        }
        if(!this.checkDescription(this.description)){
            this.error = "La descrizione deve avere tra 3 a 2000 caratteri"
            return
        }

        const listingData={
            title: this.title,
            description: this.description,
            username: username,
            userId: userId,
            status: this.status,
            available: "true",
            listing_url: this.listing_url || "",
        }

        const auth = {
            headers: { token: ` ${token}` },
        }

        try{
            console.log(listingData)
            let response = await axios.post(API_URL+`/listings`, listingData, auth);
            console.log(response)

            this.$router.push('/UserProfile/'+userId);
        }catch(error){
            console.log(error)
            // Gestione 
            // e: aggiorna il messaggio da mostrare
            this.error =
            error.response?.data?.message || "Errore durante la creazione. Riprova.";
        }
    },
    checkTitle(title){
        if(title.length < 3 || title.length > 50){
            return false;
        }
        return true;
    },
    checkDescription(description){
        if(description.length < 3 || description.length > 2000){
            return false;
        }
        return true;
    },
    async addImage(){
      if(!this.url){
        this.error = "Aggiungi un url"
        return
      }else if(this.n_photos === 10){
        this.error = "Puoi aggiungere un massimo di 10 foto"
      }else {
        this.listing_url.push(this.url)
        console.log(this.listing_url)
        this.url = ""
        this.n_photos ++
      }
    }
    }
};


// export default{
//     name: "newListing"
// }



// const listing={
//     title: "",
//     description:ref(),
//     username: ref(),
//     userId: ref(),
//     status: ref(),
//     available: "true",
//     listing_url: ref(),
//     error: ref()
// }


// async function handleCreate(){
//     const userId = localStorage.getItem("userId")
//     const username = localStorage.getItem("username")
//     if(!this.title || !this.description || !this.status || !this.listing_url){
//         this.error = "Mancano campi richiesti"
//         return
//     }
//     if(!checkTitle(this.title)){
//         this.error = "Il titolo deve avere da 3 a 50 caratteri"
//         return
//     }
//     if(!checkDescription(this.description)){
//         this.error = "La descrizione deve avere tra 3 a 2000 caratteri"
//         return
//     }

//     const listingData={
//         title: this.title,
//         description: this.description,
//         username: username,
//         userId: userId,
//         status: this.status,
//         available: "true",
//         listing_url: this.listing_url || "",
//         error: ""
//     }

//     try{
//         console.log(listingData)
//         response = await axios.post(API_URL+`/listings`, listingData);
//         console.log(response)
//     }catch(error){
//         console.log(error)
//         // Gestione 
//         // e: aggiorna il messaggio da mostrare
//         this.error =
//         error.response?.data?.message || "Errore durante la registrazione. Riprova.";
//     }

// }

// function checkTitle(title){
//     if(title.length < 3 || title.length > 50){
//         return false;
//     }
//     return true;
// }

// function checkDescription(description){
//     if(description.length < 3 || description.length > 2000){
//         return false;
//     }
//     return true;
// }

</script>
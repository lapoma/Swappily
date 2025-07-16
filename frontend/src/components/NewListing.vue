<template>
<div class="min-h-screen flex items-start justify-center p-4" style="background-color: rgb(255, 244, 234)">
    <div class="w-full max-w-md mx-auto">
      <form @submit.prevent="handleCreate" class="p-8 rounded-xl shadow-lg flex flex-col gap-4" style="background-color: #7eacb5;">
        <h1 class="text-3xl font-bold mb-4 text-center" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;font-size: 2rem; font-weight: 700;">
          New Listing
        </h1>

        <div v-if="error" class="mb-2 p-4 rounded-lg" style="background-color: rgba(201, 104, 104, 0.2); color: rgb(201, 104, 104);">
          {{ error }}
        </div>

        <div>
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Titolo</label>
          <input
            class="w-full p-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.2); color: rgba(255, 244, 234, 0.8);"
            v-model="title"
            type="text"
            id="title"
            placeholder="Inserisci titolo"
          />
        </div>

        <div>
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Descrizione</label>
          <textarea
            class="w-full p-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.2); min-height: 120px; color: rgba(255, 244, 234, 0.8);"
            v-model="description"
            id="description"
            placeholder="Descrivi il tuo prodotto"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Immagine ({{ n_photos }}/10)
          </label>
          <div class="flex gap-3">
            <input
              class="flex-1 p-3 border rounded-lg focus:outline-none"
              style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.2); color: rgba(255, 244, 234, 0.8);"
              type="text"
              v-model="url"
              placeholder="Incolla URL immagine"
            />
            <button
              @click.prevent="addImage"
              class="px-4 py-3 rounded-lg font-bold transition duration-300"
              style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
              type="button"
            >
              Aggiungi
            </button>
          </div>
        </div>

        <div>
          <label class="block mb-2 font-medium" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Seleziona Stato
          </label>
          <select
            v-model="status"
            class="w-full p-3 border rounded-lg focus:outline-none"
            style="border-color: rgb(255, 244, 234); background-color: rgba(255, 244, 234, 0.2); color: rgba(255, 244, 234, 0.8);"
          >
            <option value="" disabled selected>Seleziona uno stato</option> 
            <option value="As new">Come nuovo</option>
            <option value="Good">Buono</option>
            <option value="Ok">Discreto</option>
            <option value="Not Good">Non buono</option>
          </select>
        </div>

        <button
          class="w-full py-3 px-4 rounded-lg font-bold transition duration-300 hover:opacity-90 mt-6"
          style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 20px;"
          type="submit"
        >
          Crea Listing
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import {ref} from "vue"

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

export default {
  name: "NewListing",
  data() {
    return {
      title: "",
      description: "",
      username: "",
      userId: "",
      status: "",
      available: "true",
      listing_url: [],
      url: "",
      n_photos: ref(0),
      error: ""
    };
  },
  methods: {
    async handleCreate() {
      const userId = localStorage.getItem("userId")
      const username = localStorage.getItem("username")
      const token = localStorage.getItem("token")

      if(!this.title || !this.description || !this.status) {
        this.error = "Mancano campi richiesti"
        return
      }
      if(!this.checkTitle(this.title)) {
        this.error = "Il titolo deve avere da 3 a 50 caratteri"
        return
      }
      if(!this.checkDescription(this.description)) {
        this.error = "La descrizione deve avere tra 3 a 2000 caratteri"
        return
      }

      if(this.listing_url.length === 0) {
        this.error = "Aggiungi almeno un'immagine"
        return
      }

      const listingData = {
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

      try {
        let response = await axios.post(API_URL+`/listings`, listingData, auth)
        this.$router.push('/UserProfile1/'+userId)
      } catch(error) {
        this.error = error.response?.data?.message || "Errore durante la creazione. Riprova."
      }
    },
    checkTitle(title) {
      return title.length >= 3 && title.length <= 50
    },
    checkDescription(description) {
      return description.length >= 3 && description.length <= 2000
    },
    async addImage() {
      if(!this.url) {
        this.error = "Aggiungi un URL valido"
        return
      } else if(this.n_photos === 10 ) {
        this.error = "Puoi aggiungere un massimo di 10 foto e un minimo di 1"
      } else {
        this.listing_url.push(this.url)
        this.url = ""
        this.n_photos++
      }
    }
  }
}
</script>

<style scoped>
/* Transizioni per i bottoni */
button {
  transition: all 0.2s ease;
}

/* Stile per i placeholder e il testo digitato all'interno degli input */
input::placeholder,
textarea::placeholder,
select::placeholder {
  color: rgba(255, 244, 234, 0.6); /* Placeholder più trasparente */
}

input,
textarea,
select {
  color: rgba(255, 244, 234, 0.8); /* Testo digitato leggermente più trasparente */
}

/* Assicurati che le opzioni selezionate nel select abbiano il colore corretto */
select option {
  background-color: #7eacb5; /* Sfondo dell'opzione */
  color: rgb(255, 244, 234); /* Testo dell'opzione */
}
</style>d
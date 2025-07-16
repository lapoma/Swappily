<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <div class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden mt-8" style="background-color: #7eacb5">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-center flex-grow" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
            Modifica Annuncio
          </h1>
          <div class=""></div> 
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg text-center" style="background-color: rgba(255, 100, 100, 0.2); color: rgb(255, 244, 234);">
          {{ error }}
        </div>

        <div v-if="success" class="mb-4 p-3 rounded-lg text-center" style="background-color: rgba(100, 255, 100, 0.2); color: rgb(255, 244, 234);">
          {{ success }}
        </div>

        <div class="flex flex-col gap-4"> 
          <div class="mb-2">
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Titolo
            </label>
            <input
              v-model="title"
              type="text"
              class="w-full p-3 rounded-lg focus:outline-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
              placeholder="Titolo dell'annuncio"
            >
          </div>

          <div class="mb-2">
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Descrizione
            </label>
            <textarea
              v-model="description"
              class="w-full p-3 rounded-lg focus:outline-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif; min-height: 150px;"
              placeholder="Descrizione dettagliata"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">
              Stato dell'articolo
            </label>
            <select
              v-model="status"
              class="w-full p-3 rounded-lg focus:outline-none appearance-none"
              style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
            >
              <option value="as_new">Come nuovo</option>
              <option value="good">Buono</option>
              <option value="ok">Discreto</option>
              <option value="not_good">Non buono</option>
            </select>
          </div>

          <button
            @click="updateListing"
            :disabled="isSubmitting"
            class="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:brightness-110"
            style="background-color: #c96868; color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
          >
            <span v-if="!isSubmitting">Salva Modifiche</span>
            <span v-else>Salvataggio in corso...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

// export default {
//   data() {
//     return {
//       title: '',
//       description: '',
//       status: 'as_new', // Impostato un valore di default
//       isSubmitting: false, // Corretto: inizializzato a false
//       error: null,
//       success: null,
//     };
//   },
//   mounted() {
//     this.loadListing();
//   },
//   methods: {
//     async loadListing() {
//       try {
//         const listingId = this.$route.params.id;
//         const response = await axios.get(`${import.meta.env.VITE_API_HOST || 'http://localhost:8080'}/api/v1/listings/${listingId}`);
//         const data = response.data;

//         this.title = data.title;
//         this.description = data.description;
//         this.status = data.status || 'as_new'; // Fallback al valore di default
//       } catch (err) {
//         this.error = 'Errore durante il caricamento dell\'annuncio';
//         console.error(err);
//       }
//     },

//     async updateListing() {
//       this.isSubmitting = true;
//       this.error = null;
//       this.success = null;

//       const listingId = this.$route.params.id;
//       const payload = {
//         title: this.title,
//         description: this.description,
//         status: this.status
//       };

//       try {
//         const response = await axios.put(
//           `${import.meta.env.VITE_API_HOST || 'http://localhost:8080'}/api/v1/listings/${listingId}`,
//           payload
//         );
        
//         if (response.status === 200) {
//           this.success = 'Annuncio aggiornato con successo!';
//           // Ricarica i dati per verificare le modifiche
//           setTimeout(() => this.loadListing(), 1000);
//         }
//       } catch (err) {
//         this.error = err.response?.data?.message || 'Errore durante l\'aggiornamento dell\'annuncio.';
//         console.error(err);
//       } finally {
//         this.isSubmitting = false;
//       }
//     }
//   }
// };
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' viewBox='0 0 20 20' fill='%237eacb5'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
}
</style>
<template>
  <!-- Overlay con nuovo colore di sfondo -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(0px);">

    <!-- Container principale -->
    <div class="rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" style="background-color: #7eacb5">
      <!-- Tasto chiusura in alto a destra -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 z-10 rounded-full p-2 shadow-md hover:bg-gray-100"
        style="background-color: rgb(255, 244, 234)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Colonna sinistra - Galleria immagini -->
      <div class="w-full md:w-1/2 relative">
        <!-- Immagine principale -->
        <img 
          :src="listing.images[currentImageIndex]" 
          :alt="listing.title"
          class="w-full h-64 md:h-full object-cover rounded-l-xl"
        >

        <!-- Pulsante preferiti spostato a destra -->
        <button 
          @click="toggleFavorite"
          class="absolute top-4 right-4 rounded-full p-2 shadow-md hover:bg-gray-100"
          style="background-color: rgb(126, 172, 181)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6" 
               :class="isFavorite ? 'text-red-500 fill-current' : 'text-white-500 fill-none'"
               viewBox="0 0 24 24" 
               stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <!-- Pulsanti navigazione immagini -->
        <button 
          @click="prevImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-gray-100"
          style="background-color: rgb(126, 172, 181)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-gray-100"
          style="background-color: rgb(126, 172, 181)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgb(255, 244, 234)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Miniature immagini -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div class="flex space-x-2 overflow-x-auto py-2">
            <button 
              v-for="(img, index) in listing.images"
              :key="index"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-12 h-12 rounded border-2"
              :class="currentImageIndex === index ? 'border-white' : 'border-transparent'"
            >
              <img 
                :src="img" 
                :alt="`Thumbnail ${index + 1}`"
                class="w-full h-full object-cover rounded-sm"
              >
            </button>
          </div>
        </div>
      </div>

      <!-- Colonna destra - Dettagli -->
<div class="w-full md:w-1/2 p-8 flex flex-col justify-between" style="color: rgb(255, 244, 234); max-height: 90vh;">
  
  <!-- Parte superiore: Titolo, descrizione, condizione -->
  <div class="flex flex-col gap-10 overflow-y-auto">
    <h2 class="text-3xl font-bold" style="font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: bold;">{{ listing.title }}</h2>

    <!-- Descrizione -->
    <div>
      <h3 class="text-xl font-semibold mb-3" style="font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 500;">Descrizione:</h3>
      <p class="whitespace-pre-line" style="font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 250;">{{ listing.description }}</p>
    </div>

    <!-- Condizione -->
    <div>
      <h3 class="text-xl font-semibold mb-3" style="font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 500;">Condizione:</h3>
      <div class="flex items-center">
        <span class="inline-block px-4 py-2 rounded-full text-sm font-medium" 
              :class="conditionClasses[listing.condition]">
          {{ conditionLabels[listing.condition] }}
        </span>
      </div>
    </div>
  </div>

  <!-- Parte inferiore: Bottoni in basso -->
      <div class="mt-8 flex justify-between gap-6 pt-6">
        <button 
          @click="contactSeller"
          class="flex-1 py-3 px-6 rounded-lg font-bold transition"
            style="background-color: rgb(255, 244, 234); color: #7eacb5; font-family: 'Poppins', sans-serif; font-size: 1.4rem; font-weight: 1000;"
        >
          CONTATTA
        </button>

        <button 
          @click="startExchange"
          class="flex-1 py-3 px-6 rounded-lg font-bold transition"
          style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif; font-size: 1.4rem; font-weight: 700;"
        >
          SCAMBIA
        </button>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ListingTable',
  props: {
    listing: {
      type: Object,
      required: true,
      default: () => ({
        images: [],
        title: '',
        description: '',
        condition: ''
      })
    } 
  },
  data() {
    return {
      currentImageIndex: 0,
      isFavorite: false,
      conditionLabels: {
        'as_new': 'As new',
        'good': 'Good',
        'ok': 'Ok',
        'not_good': 'Not good'
      },
      conditionClasses: {
        'as_new': 'bg-green-100 text-green-800',
        'good': 'bg-blue-100 text-blue-800',
        'ok': 'bg-yellow-100 text-yellow-800',
        'not_good': 'bg-red-100 text-red-800'
      }
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
    },
    contactSeller() {
      alert(`Contatta il venditore per: ${this.listing.title}`)
    },
    startExchange() {
      alert(`Avvia scambio per: ${this.listing.title}`)
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.listing.images.length) % this.listing.images.length
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.listing.images.length
    }
  },
  mounted() {
    // Aggiunge il font Poppins al documento
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
}
</script>

<style scoped>
/* Transizione per il cambio immagine */
img {
  transition: opacity 0.3s ease;
}

/* Stile per i pulsanti */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
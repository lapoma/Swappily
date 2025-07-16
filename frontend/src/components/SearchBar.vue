<template>
  <div class="search-bar-container">
    <div class="search-bar">
      <input
        type="text"
        v-model="text"
        class="search-input"
        placeholder="Cerca..."
        @focus="hidePlaceholder"
        @blur="showPlaceholder"
      />
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const LISTINGS_URL = API_URL + '/listings'

const showPlaceholderText = ref(true);
const selectedStatus = ref();
const text = ref();

const hidePlaceholder = () => {
  showPlaceholderText.value = false;
};

const showPlaceholder = (e) => {
  if (!e.target.value) {
    showPlaceholderText.value = true;
  }
};

async function handleSearch(){
  if(!selectedStatus){
    const response = await axios.get(LISTINGS_URL,{
      title: text.value
    })

    console.log(response.data)

  }
}
</script>

<style scoped>
.search-bar-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 800px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  padding-right: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.search-input:focus {
  border-color: #7eacb5; 
  box-shadow: 0 0 0 3px rgba(126, 172, 181, 0.2);
}

.search-input::placeholder {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.search-input:focus::placeholder {
  opacity: 0;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}
</style>
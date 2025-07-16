<template>
  <div class="min-h-screen flex flex-col items-center p-4 relative" style="background-color: rgb(255, 244, 234)">
    <div class="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden mt-16" style="background-color: #7eacb5">
      <div class="p-6 flex flex-col gap-4">
        <div class="flex flex-col items-center gap-4 mb-4">
          <div class="relative -mt-16">
            <img
              :src="user.profile_url || 'https://via.placeholder.com/150'"
              class="w-32 h-32 rounded-full border-4 shadow-lg object-cover"
              style="border-color: rgb(255, 244, 234);"
              alt=""
            />
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
          </div>
          <button
            @click="addImage"
            class="mt-4 px-4 py-2 rounded-lg hover: cursor-pointer"
            style="background-color: rgb(255, 244, 234); color: #7eacb5; font-family: 'Poppins', sans-serif;"
          >
            Cambia immagine
          </button>
        </div>

        <div v-if="error" class="mb-4 text-center text-red-100">
          {{ error }}
        </div>

        <div class="flex flex-col gap-2"> <div>
            <label class="block mb-1" style="color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;">Cambia descrizione</label>
            <textarea
              v-model="user.description"
              type="textarea"
              class="w-full p-5 border rounded-lg focus:outline-none" 
               style="background-color: rgba(255, 244, 234, 0.8); color: #7eacb5; font-family: 'Poppins', sans-serif;"
              placeholder="Scrivi qualcosa su di te..."
            ></textarea>
          </div>

          

          <button
            @click="handleEdit"
            class="w-full py-3 rounded-lg font-bold mt-4 transition duration-300 hover:opacity-90" style="background-color: rgb(201, 104, 104); color: rgb(255, 244, 234); font-family: 'Poppins', sans-serif;"
          >
            Salva modifiche
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const USERS_URL = API_URL + '/users'

const router = useRouter();

const user = ref({
    username: '',
    userId: '',
    name: '',
    surname: '',
    email: '',
    isFollowed: false,
    listings: [],
    n_listings: 0,
    profile_url:"",
    error: "",
    description:""
});
const error = ref('');

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.profile_url = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function fetchUserData() {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const response = await axios.get(USERS_URL + `/${userId}`);

    user.value.username = response.data.username;
    user.value.name = response.data.name;
    user.value.surname = response.data.surname;
    user.value.email = response.data.email;
    user.value.profile_url = response.data.profile_url;
    user.value.description = response.data.description;

  } catch (err) {
    console.error("Error fetching user data:", err);
    error.value = "Errore nel caricamento dati utente";
  }
}


async function updateProfile() {
    try {
        const updatedData = {
            username: user.value.username,
            name: user.value.name,
            surname: user.value.surname,
            email: user.value.email
        };
        
        const response = await axios.put(USERS_URL+`/${user.value.userId}`, updatedData);
        console.log("Profile updated successfully:", response.data);
        router.push('/profile');
    } catch (error) {
        console.error("Error updating profile:", error);
        error.value = "Failed to update profile. Please try again.";
    }
}

async function handleEdit() {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    const userGet = await axios.get(API_URL+`/users/${userId}`);
    try{
      const response = await axios.put(API_URL+`/users/${userId}`, {
        username: userGet.data.username,
        name: userGet.data.name,
        surname: userGet.data.surname,
        email: userGet.data.email,
        description: user.value.description,
      }, {
        headers: {
        Authorization: ` ${token}`
        }
    })
        console.log(response)  
        alert("Utente aggiornato con successo")
    }catch(error){
        alert("Impossibile aggiornare l'utente")
        this.error=("Impossibile aggiornare l'utente")
    }
    
}

async function addImage() {
  if (!user.value.profile_url) {
    alert("Nessuna immagine inserita");
    error.value = "Nessuna immagine inserita";
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const userGet = await axios.get(API_URL + `/users/${userId}`);

    const response = await axios.put(API_URL + `/users/${userId}`, {
      username: userGet.data.username,
      name: userGet.data.name,
      surname: userGet.data.surname,
      email: userGet.data.email,
      profile_url: user.value.profile_url, 
    }, {
      headers: {
        Authorization: ` ${token}`
      }
    });

    console.log("Immagine aggiornata:", response);
    alert("Immagine profilo aggiornata con successo!");

  } catch (err) {
    alert("Impossibile aggiornare l'immagine profilo");
    error.value = "Impossibile aggiornare l'immagine profilo";
    console.error(err);
  }
}


onMounted(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetchUserData(userId);
    } else {
        console.error("No user ID found in local storage.");
    }
});


</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
</style>
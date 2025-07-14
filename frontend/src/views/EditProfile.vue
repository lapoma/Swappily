<template>

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
    error: ""
});
const error = ref('');

async function fetchUserData() {
    try{
        const userId = localStorage.getItem('userId');
        const user = await axios.get(USERS_URL+`/${userId}`);
        if(!user){
            console.error("User ID not found");
            return;
        }else{
            const response = await axios.get(USERS_URL+`/${userId}`);

            console.log(response)

            user.username = response.data.username;
            user.name = response.data.name;
            user.surname = response.data.surname;
            user.email = response.data.email;

            console.log(user)
        }
    }catch(error){
        console.error("Error fetching user data:", error);
        return;
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
        email: userGet.data.email
      }, {
        headers: {
        Authorization: ` ${token}`
        }
    })
        console.log(response)  
    }catch(error){
        alert("Impossibile aggiornare l'utente")
        this.error=("Impossibile aggiornare l'utente")
    }
    
}

async function addImage(){
    if(!this.profile_url){
        alert("Nessuna immagine inserita")
        this.error=("Nessuna immagine inserita")
    }else{
        try{
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")
            const userGet = await axios.get(API_URL+`/users/${userId}`);
                const response = await axios.put(API_URL+`/users/${userId}`, {
                    username: userGet.data.username,
                    name: userGet.data.name,
                    surname: userGet.data.surname,
                    email: userGet.data.email,
                    profile_url: this.profile_url
                }, {
                    headers: {
                    Authorization: ` ${token}`
                }
    })
        console.log(response)  
    }catch(error){
        alert("Impossibile aggiornare l'utente")
        this.error=("Impossibile aggiornare l'utente")
    }
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
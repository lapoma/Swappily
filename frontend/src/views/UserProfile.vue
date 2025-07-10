<template>
  <div>
    <!-- Profilo Utente -->
    <div class="p-4 sm:p-8 lg:p-16 mx-auto max-w-screen-lg">
      <div class="p-6 bg-white border-2 rounded-lg shadow-md mt-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 items-center">
          <!-- Conteggio Post e Commenti -->

          <!-- Immagine Profilo -->
          <div class="relative">
            <div>
              <img
                src="https://picsum.photos/200/300"
                class="w-36 h-36 sm:w-48 sm:h-48 bg-text-text_3 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div v-if="isAuthor()"
            class="flex flex-wrap justify-between md:justify-center space-x-4 mt-16 md:mt-0"
          >
            <router-link to="/ModificaProfilo">
              <button class="mt-4 px-4 py-2 bg-button_1 text-text_1 rounded-md hover:bg-button_1_hover font-medium shadow-md">
              Modifica Profilo
              </button>
            </router-link>
            <PostButton />
          </div>
        </div>

        <!-- Username -->
        <div class="mt-24 text-center pb-8">
          <h1 class="text-2xl font-bold sm:text-4xl text-text-text_2">
            {{ username }}
          </h1>
          <div class="mt-2 text-lg text-text_3">
            <p>{{ name }} {{ surname }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista dei Post -->
     <div class="max-w-4xl mx-auto p-4 space-y-6">
      <!-- <h2 class="text-2xl font-bold mb-6">I Tuoi Post</h2> -->

      <!-- Singolo Post -->
      <div v-for="post in posts" :key="post.id">
        <Post :post="post" @post-deleted="removePost"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const username = ref('');
const userId = ref('');
const name=ref('');
const surname=ref('');
const email = ref('');
const isFollowed = ref(false);
const listings = ref([]);
const n_listings = ref(0);


const navigateTo = (routePath) =>{
    router.push(routePath);
}

function isAuthor(){
    if(localStorage.getItem('userId')===this.userId){
        return true;
    }else{
        return false;
    }
}

 async function follow(){
    if(!localStorage.getItem('username')){
        if(localStorage.getItem(userId)!== this.userId){
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.get('token');

            try{
                const userGet = await axios.get(API_URL+`/users/${user.id}`);
                const newFollowlist = userGet.data.followed.includes(this.userId);

                if(newFollowlist){
                    await axios.put(API_URL+`/users/${user.id}`, {
                        followed: userGet.data.favoriteList.filter(id => id !== this.listing.id)
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    this.isFollowed = !this.isFollowed;
                } else {
                    await axios.put(API_URL+`/users/${user.id}`, {
                        followed: [...userGet.data.followed, this.listing.id]
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    this.isFollowed = true;
                };
            }catch(error){
                console.error('Failed to add user: ', error);
                alert('An error occurred while updating following.');
            }
        }
    }else{
        alert('You should log in first');
        return;
    }
}

onMounted(() => {
    fetchUserData();
});

listings.value = getUserListings(localStorage.getItem('userId'));
listings.value.then((data) => {
    n_listings.value = data.length;
});

async function removePost(postId){
    await deletePost(postId);
}

</script>
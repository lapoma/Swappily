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


const navigateTo = (routePath) =>{
    router.push(routePath);
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
                console.error('Failed to toggle favorite: ', error);
                alert('An error occurred while updating favorites.');
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

</script>
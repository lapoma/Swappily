<script>
import axios from 'axios';
import { onMounted } from 'vue';

const router = useRouter();

const user = ref({
    username: '',
    userId: '',
    name: '',
    surname: '',
    email: '',
    isFollowed: false,
    listings: [],
    n_listings: 0
});
const error = ref('');

async function fetchUserData(userId) {
    try{
        const storedUser = JSON.parse(localStorage.getItem('userId'));
        const user = await axios.get(USERS_URL+`/${userId}`);
        if(!user){
            console.error("User ID not found");
            return;
        }else{
            const response = await axios.get(USERS_URL+`/${user._id}`);
            user.value.username = response.data.username;
            user.value.name = response.data.name;
            user.value.surname = response.data.surname;
            user.value.email = response.data.email;
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

onMounted(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetchUserData(userId);
    } else {
        console.error("No user ID found in local storage.");
    }
});


</script>
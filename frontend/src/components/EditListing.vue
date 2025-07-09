<script setup>
import {ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { modifyDescription, modifyTitle } from '@/services/listings';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

const router = useRouter();

// const listing = {
//     title: '',
//     userId: '',
//     description: '',
//     listing_url: '',
//     status: '',
//     availabile: true
// }

const listing = defineProps({
    type:Object,
    required: true
})


const navigateTo=(routePath) =>{
    router.push(routePath);
}
const userId = localStorage.getItem('userId');
const user = await axios.get(API_URL+`/users/${userId}`);


const showModify = ref(false);
const toggleModify = () =>{
    showModify.value = !showModify.value;
}

const handleModifyTitle = async () =>{
    modifyTitle(listing._id,newTitle).catch(err => console.log(err));
}

const handleModifyDescription = async () =>{
    modifyDescription(listing._id,newDescription);
}

const handleModifyStatus = async () =>{
    modifyStatus(listing._id,newStatus);
}

const archive = async() =>{
    archive(listing._id);
}
</script>
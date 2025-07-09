<script setup>
import { ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const username = ref('');
const name=ref('');
const surname=ref('');
const email = ref('');


const navigateTo = (routePath) =>{
    router.push(routePath);
}

onMounted(() => {
    fetchUserData();
});

</script>
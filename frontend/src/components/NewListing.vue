<script setup>
import axios from "axios"
import {ref} from "vue"

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const API_URL = HOST+`/api/v1`

export default{
    name: "newListing"
}

const store = useStore()

const listing={
    title = ref(),
    description = ref(),
    _id = ref(),
    username = ref(),
    userId = ref(),
    status = ref(),
    available = true,
    listing_url = ref()
}


async function handleCreate(){
    const userId = 
    if(!title || !description || !)
}

</script>
import {reactive} from 'vue'
import axios from 'axios'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const USERS_URL = API_URL + '/users'

async function modifyUsername(newUsername) {
    try {
        if (localStorage.getItem('user')) {
            const userId = localStorage.getItem('userId');
            const response = await axios.put(`${USERS_URL}/${userId}`, {
                username: newUsername
            });
            localStorage.setItem('username', newUsername);
            return response.data;
        } else {
            alert('You should log in first');
            return;
        }
    } catch (error) {
        alert('Error updating username');
        console.error(error);
        return;
    }
}

async function modifyName(newName){
    try{
        if(localStorage.getItem('user')){
           const userId = localStorage.getItem('userId');
            const response = await axios.put(`${USERS_URL}/${userId}`, {
                name: newName
            });
            localStorage.setItem('name', newName);
            return response.data; 
        }else{
            alert('You should log in first');
            return;
        }
    }catch(error){
        alert('Error updating name');
        console.error(error);
        return;
    }
}

async function modifySurname(newSurname){
    try{
        if(localStorage.getItem('user')){
           const userId = localStorage.getItem('userId');
            const response = await axios.put(`${USERS_URL}/${userId}`, {
                surname: newSurname
            });
            localStorage.setItem('surname', newSurname);
            return response.data; 
        }else{
            alert('You should log in first');
            return;
        }
    }catch(error){
        alert('Error updating surname');
        console.error(error);
        return;
    }
}

async function deleteUser(user){
    try{
        if(localStorage.getItem('user')){
            const userId = localStorage.getItem('userId');
            const userType = localStorage.getItem('userType');
            if(userId === user || userType==='operatore'){
                const response = await axios.delete(USERS_URL+`/$user`);
            }
        }else{
            alert('Authorization negated');
            return;
        }
    }catch(error){
        alert('Error deleting user');
        console.error(error);
        return;
    }
}

const fetchUserData = async() =>{
    try{
        const storedUser = JSON.parse(localStorage.getItem('userId'));
        if(!storedUser || !storedUser._id){
            console.error("User ID not found in localStorage");
            return;
        }else{
            const response = await axios.get(USERS_URL+`/${storedUser._id}`);
            username.value = response.data.username;
            name.value = response.data.name;
            surname.value = response.data.surname;
            email.value = response.data.email;
        }
    }catch(error){
        console.error("Error fetching user data:", error);
        return;
    }
}

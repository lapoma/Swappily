import {reactive} from 'vue'
import axios from 'axios'

const HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const API_URL = HOST + '/api/v1'
const LISTINGS_URL = API_URL + '/listings'

let listings = reactive([])

async function fetchListings(){
    listings = await axios.get(LISTINGS_URL)
}

async function createListing(title, description,status,listing_url){
    if(localStorage.getItem('user')){
      let response = await axios.post(LISTINGS_URL,{
        title: title,
        description:description,
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        listing_url: listing_url,
        status: status,
        available: true
        })
        fetchListings()
    }else{
        alert('You should log in first');
        return;
    }
}

async function modifyTitle(listId,newTitle){
    try{
       if(localStorage.getItem('user')){
            const listing = await axios.get(LISTINGS_URL+`/${listId}`);
            if(localStorage.getItem('userId') !== listing.userId){
                alert('You can only edit your listings')
            }
            if(checkTitle(newTitle)){
                let res = await axios.put(LISTINGS_URL+LISTINGS_URL+`/${listId}`,{
                    title: newTitle
                })
            }else{
                alert('"Title" must be a non-empty string between 3 and 50 characters');
                return;
            }
        }else{
            alert('You should log in first');
            return;
        }  
    }catch(error){
        alert('Error updating listing');
        return;
    }
   
}

async function modifyDescription(listId,newDescription){
   try{
        if(localStorage.getItem('user')){
            const listing = await axios.get(LISTINGS_URL+`/${listId}`);
            if(checkDescription(newDescription)){
                let res = await axios.put(LISTINGS_URL+LISTINGS_URL+`/${listId}`,{
                    description: newDescription
                })
            }else{
                alert( '"Description" must be a non-empty string between 3 and 2000 characters');
                return;
            }
        }else{
            alert('You should log in first');
            return;
        }
    } catch (error){
        alert('Error updating listing');
        return;
    } 
}

async function modifyStatus(listId,newStatus){
    try{
      if(localStorage.getItem('user')){
        const listing = await axios.get(LISTINGS_URL+`/${listId}`);
        if(checkStatus(newStatus)){
            let res = await axios.put(LISTINGS_URL+LISTINGS_URL+`/${listId}`,{
                status: newStatus
            })
        }else{
            alert( '"Description" must be a non-empty string between 3 and 2000 characters');
            return;
        }
    }else{
        alert('You should log in first');
        return;
    }  
    }catch(error){
        alert('Error updating listing');
        return;
    }  
}

async function deleteListing(listId){
try{
        if(localStorage.getItem('username')){
            const listing = await axios.delete(LISTINGS_URL+`/${listId}`);
        }else{
            alert('You should log in first');
            return;
        }
    }catch(error){
        alert('Error updating listing');
    }
    
}

async function archive(listId){
    try{
        if(localStorage.getItem('username')){
            const listing = await axios.get(LISTINGS_URL+`/${listId}`);
            let res = await axios.put(LISTINGS_URL+LISTINGS_URL+`/${listId}`,{
                available: false
            })
        }else{
            alert('You should log in first');
            return;
        }
    }catch(error){
        alert('Error archiving listing');
    }
}

async function getUserListings(userId){
    try{
        if(localStorage.getItem('user')){
            const response = await axios.get(LISTINGS_URL+`/user/${userId}`);
            return response.data;
        }else{
            alert('You should log in first');
            return;
        }
    }catch(error){
        alert('Error fetching user listings');
        console.error(error);
        return;
    }
}

function checkTitle(title){
    if(title.length < 3 || title.length > 50){
        return false;
    }
    return true;
}

function checkDescription(description){
    if(description.length < 3 || description.length > 2000){
        return false;
    }
    return true;
}

export {fetchListings, modifyDescription,modifyStatus,modifyTitle,deleteListing,getUserListings}
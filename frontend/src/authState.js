// src/authState.js
import { ref } from 'vue';

// Stato reattivo condiviso
export const isLoggedIn = ref(!!localStorage.getItem('token'));

export function login(token, userId, username, usertype) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  localStorage.setItem('username', username);
  localStorage.setItem('usertype', JSON.stringify(usertype));
  isLoggedIn.value = true;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('usertype');
  isLoggedIn.value = false;
}

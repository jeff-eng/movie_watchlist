import { initializeApp } from 'firebase/app';
import { closeModal } from './functions.js';
import {
  removeFromStoredWatchlist,
  setupWatchlist,
  renderWatchlist,
} from './watchlist-functions.js';

async function fetchFirebaseConfig() {
  try {
    const response = await fetch('/.netlify/functions/getFirebaseConfig');
    if (!response.ok) {
      throw new Error('Unable to fetch Firebase config');
    }
    const config = await response.json();
    return config;
  } catch (err) {
    console.error('Error fetching Firebase config:', err);
  }
}

async function handleCreateAccountWithEmail(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential.user);
    console.log('logged in new user!');
  } catch (err) {
    console.error(err.message);
  }
}

async function handleSignInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log(userCredential.user);
    console.log('logged in existing user');
  } catch (err) {
    console.error(err);
    console.error(err.message);
  }
}

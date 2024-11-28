import { initializeApp } from 'firebase/app';
import { closeModal } from './functions.js';
import {
  removeFromStoredWatchlist,
  setupWatchlist,
  renderWatchlist,
} from './watchlist-functions.js';

(async function initializeFirebaseApp() {
  try {
  } catch (err) {
    console.error('App initialization failed: ', err);
  }
})();

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

async function handleAuthSignOut(auth) {
  try {
    signOut(auth);
    console.log('user signed out');
    // Show the sign-in screen
    document.getElementById('signin-screen').classList.toggle('hide');
    // Hide the watchlist
    document.getElementById('watchlist').classList.toggle('hide');
    document.getElementById('sign-out-button').classList.add('hide');
  } catch (err) {
    console.error(err);

    // Display an error message to the user
  }
}

async function handleSignInWithGoogle(auth, googleProvider) {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    if (result) {
      console.log('User signed in:', result.user);
    } else {
      console.log('No redirect result available.');
    }

    console.log('Signed in with Google');
  } catch (err) {
    console.error(err);
  }
}

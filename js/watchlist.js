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

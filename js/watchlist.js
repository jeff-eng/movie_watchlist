import { initializeApp } from 'firebase/app';
import { closeModal } from './functions.js';
import {
  removeFromStoredWatchlist,
  setupWatchlist,
  renderWatchlist,
} from './watchlist-functions.js';

(async function initializeFirebaseApp() {
  try {
    const firebaseConfig = await fetchFirebaseConfig();

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    let watchlist = setupWatchlist();

    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);
        document.getElementById('profile-photo').classList.remove('hide');
        document.getElementById('profile-photo').src = user.photoURL
          ? user.photoURL
          : './../assets/undraw_Pic_profile_re_7g2h.png';
        // Show signed-in view
        document.getElementById('signin-screen').classList.add('hide');
        document.getElementById('sign-out-button').classList.remove('hide');
        document.getElementById('watchlist').classList.remove('hide');
      } else {
        // Show signed-out view
        document.getElementById('profile-photo').classList.add('hide');
        document.getElementById('signin-screen').classList.remove('hide');
        document.getElementById('watchlist').classList.add('hide');
        document.getElementById('sign-out-button').classList.add('hide');
      }
    });

    // Watchlist click events
    document.getElementById('watchlist').addEventListener('click', event => {
      const eventTarget = event.target;

      const likedButtonMediaId = eventTarget.dataset.imdbId ?? null;
      const clickedArticle = eventTarget.closest('article.result');

      // Screen out clicked elements that aren't articles
      if (!clickedArticle) {
        return;
      }

      const clickedArticleId = clickedArticle.id;

      if (likedButtonMediaId) {
        watchlist = removeFromStoredWatchlist(
          watchlist[likedButtonMediaId],
          watchlist
        );

        const watchlistItemToRemove =
          document.getElementById(likedButtonMediaId);
        watchlistItemToRemove.style.animationPlayState = 'running';
        watchlistItemToRemove.addEventListener('animationend', () => {
          watchlistItemToRemove.remove();
        });
        renderWatchlist(watchlist);
      } else if (clickedArticleId) {
        const modal = document.getElementById('modal');
        modal.showModal();
        modal.classList.remove('closed');
        const html = watchlist[clickedArticleId].createModalDetailHtml();
        modal.replaceChildren(...html);
      } else return;
    });

    // Modal back button event listener - close modal
    document.getElementById('modal').addEventListener('click', event => {
      const eventTarget = event.target;
      const imdbIdFromLikedBtn = eventTarget.dataset.imdbId;

      if (eventTarget.closest('.modal__back-btn')) {
        modal.classList.add('closed');
        setTimeout(() => {
          closeModal();
        }, 500);
      } else if (imdbIdFromLikedBtn) {
        // Update watchlist variable
        watchlist = removeFromStoredWatchlist(
          watchlist[imdbIdFromLikedBtn],
          watchlist
        );
        // Get reference to DOM element in watchlist section to remove
        const watchlistItemToRemove =
          document.getElementById(imdbIdFromLikedBtn);
        // Fade out and shrink animation
        watchlistItemToRemove.style.animationPlayState = 'running';
        // Remove item from DOM after animation ends
        watchlistItemToRemove.addEventListener('animationend', () => {
          watchlistItemToRemove.remove();
        });
        closeModal();
        renderWatchlist(watchlist);
      }

      // Other event listeners (sign-in, sign-out, etc.)
      document
        .getElementById('signin-form')
        .addEventListener('submit', event => {
          event.preventDefault();

          const { value } = event.submitter;
          const email = document.getElementById('signin-email').value;
          const password = document.getElementById('signin-password').value;

          if (value === 'sign-in') {
            handleSignInWithEmail(auth, email, password);
          } else {
            handleCreateAccountWithEmail(auth, email, password);
          }

          // Clear the input fields
          document.getElementById('signin-password').value = '';
          document.getElementById('signin-email').value = '';
        });
    });
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

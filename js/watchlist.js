import { closeModal } from './functions.js';
import {
  removeFromStoredWatchlist,
  setupWatchlist,
  renderWatchlist,
} from './watchlist-functions.js';

// Load in watchlist dictionary
let watchlist = setupWatchlist();

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

    const watchlistItemToRemove = document.getElementById(likedButtonMediaId);
    // Fade out and shrink animation
    watchlistItemToRemove.style.animationPlayState = 'running';
    // Remove item from DOM after animation ends
    watchlistItemToRemove.addEventListener('animationend', () => {
      watchlistItemToRemove.remove();
    });
    // Re-render watchlist
    renderWatchlist(watchlist);
  } else if (clickedArticleId) {
    const modal = document.getElementById('modal');
    // Open modal
    modal.showModal();
    modal.classList.remove('closed');
    // Create HTML
    const html = watchlist[clickedArticleId].createModalDetailHtml();
    // Insert into DOM
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
    const watchlistItemToRemove = document.getElementById(imdbIdFromLikedBtn);
    // Fade out and shrink animation
    watchlistItemToRemove.style.animationPlayState = 'running';
    // Remove item from DOM after animation ends
    watchlistItemToRemove.addEventListener('animationend', () => {
      watchlistItemToRemove.remove();
    });
    closeModal();
    renderWatchlist(watchlist);
  }
});

// Render watchlist items to the DOM
renderWatchlist(watchlist);

import { closeModal } from './functions.js';
import { removeFromStoredWatchlist, setupWatchlist, renderWatchlist } from './watchlist-functions.js';

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
        watchlist = removeFromStoredWatchlist(watchlist[likedButtonMediaId], watchlist);
        
        const watchlistItemToRemove = document.getElementById(likedButtonMediaId);
        // Fade out and shrink animation
        watchlistItemToRemove.style.animationPlayState = 'running';
        // Remove item from DOM after animation ends
        watchlistItemToRemove.addEventListener('animationend', () => {
            watchlistItemToRemove.remove();
        });
    } else if (clickedArticleId) {
        const modal = document.getElementById('modal');
        // Open modal
        modal.showModal();
        // Create HTML 
        const html = watchlist[clickedArticleId].createModalDetailHtml();
        // Insert into DOM
        modal.replaceChildren(...html);
    } else return;
});

// Modal back button event listener - close modal
document.getElementById('modal').addEventListener('click', event => {
    if (event.target.closest('.modal__back-btn')) {
        closeModal();
    }
});

// Render watchlist items to the DOM
renderWatchlist(watchlist);
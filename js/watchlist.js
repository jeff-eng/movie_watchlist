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
        // Update the watchlist with either addToStoredWatchlist or removeFromStoredWatchlist
        watchlist = removeFromStoredWatchlist(watchlist[likedButtonMediaId], watchlist);
        // Remove item from DOM
        document.getElementById(likedButtonMediaId).remove();
    } else if (clickedArticleId) {
        // Open modal
        document.getElementById('modal').showModal();
        // Create HTML 
        const html = watchlist[clickedArticleId].createModalDetailHtml();
        // Insert into DOM
        document.getElementById('modal').replaceChildren(...html);
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
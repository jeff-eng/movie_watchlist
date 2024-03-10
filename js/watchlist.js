import { openModal, closeModal } from './functions.js';
import { addToStoredWatchlist, removeFromStoredWatchlist, setupWatchlist, renderWatchlistHtml, renderWatchlist } from './watchlist-functions.js';

let watchlist = setupWatchlist();
console.log(watchlist);

document.getElementById('watchlist').addEventListener('click', event => {
    const eventTarget = event.target;

    const likedButtonMediaId = eventTarget.dataset.imdbId ?? null;
    const clickedArticleId = eventTarget.closest('article.result').id ?? null;

    if (likedButtonMediaId) {
        // Update the watchlist with either addToStoredWatchlist or removeFromStoredWatchlist
        watchlist = removeFromStoredWatchlist(watchlist[likedButtonMediaId], watchlist);
        // Remove item from  DOM
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

// Render watchlist items to the DOM
renderWatchlist(watchlist);
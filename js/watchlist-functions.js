import { createClassInstance } from "./functions.js";

// *** Watchlist-related Functions ***

// Initialize watchlist variable from local storage on page load
function setupWatchlist() {
    // Check for watchlist key in local storage
    const storedWatchlist = localStorage.getItem('movieWatchlist');

    if (storedWatchlist) {
        // Get back an object of objects (key=imdbId, value=media data)
        const dictionaryOfObjects = JSON.parse(storedWatchlist);
        let newDict = new Object();
        
        for (const [id, object] of Object.entries(dictionaryOfObjects)) {
            newDict[id] = createClassInstance(object);
        }

        return newDict;
    } else {
        // Create the key in local storage
        const newWatchlist = new Object();
        localStorage.setItem('movieWatchlist', JSON.stringify(newWatchlist));
        return newWatchlist;
    }
}

function addToStoredWatchlist(mediaItem, movieWatchlist) {
    // Add to watchlist object that's tracking liked/favorited media
    movieWatchlist[mediaItem.imdbID] = mediaItem;
    // Updated local storage
    localStorage.setItem('movieWatchlist', JSON.stringify(movieWatchlist));
    return movieWatchlist;
}

function removeFromStoredWatchlist(mediaItem, movieWatchlist) {
    delete movieWatchlist[mediaItem.imdbID];
    localStorage.setItem('movieWatchlist', JSON.stringify(movieWatchlist));
    return movieWatchlist;
}

function renderWatchlistHtml(watchlist) {
    // console.log(Object.values(watchlist));
    return Object.values(watchlist).map(item => item.createResultHtml());
}

function renderWatchlist(watchlist) {    
    const watchlistSectionEl = document.getElementById('watchlist');
    
    if (watchlist) {
        watchlistSectionEl.replaceChildren(...renderWatchlistHtml(watchlist));
    } else {
        // Render an empty watchlist message
        watchlistSectionEl.innerHTML = '<h2>Time to add stuff to your watchlist</h2>';
    }
}

export { setupWatchlist, addToStoredWatchlist, removeFromStoredWatchlist, renderWatchlistHtml, renderWatchlist };
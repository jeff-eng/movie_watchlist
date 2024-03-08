let watchlist = setupWatchlist();

// Initialize watchlist variable from local storage on page load
function setupWatchlist() {
    // Check for watchlist key in local storage
    const storedWatchlist = localStorage.getItem('movieWatchlist');

    if (storedWatchlist) {
        // Set the array to the value of whatever's in local storage
        return JSON.parse(storedWatchlist);
    } else {
        // Create the key in local storage
        const newWatchlist = new Object();
        localStorage.setItem('movieWatchlist', JSON.stringify(newWatchlist));
        return newWatchlist;
    }
}

function addToStoredWatchlist(mediaItem, movieWatchlist) {
    movieWatchlist[mediaItem.imdbID] = mediaItem;
    localStorage.setItem('movieWatchlist', JSON.stringify(movieWatchlist));
    return movieWatchlist;
}

function removeFromStoredWatchlist(mediaItem, movieWatchlist) {
    delete movieWatchlist[mediaItem.imdbID];
    localStorage.setItem('movieWatchlist', JSON.stringify(movieWatchlist));
    return movieWatchlist;
}

export { setupWatchlist, openModal, closeModal, addToStoredWatchlist, removeFromStoredWatchlist };
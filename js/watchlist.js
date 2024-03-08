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

function openModal(searchResults, mediaId) {
    document.getElementById('modal').showModal();
    document.body.style.overflow = 'hidden';

    console.log(searchResults);

    const someIndex = searchResults.findIndex(element => element.imdbID === mediaId);
    const html = searchResults[someIndex].createModalDetailHtml();

    document.getElementById('modal').replaceChildren(...html);
}

function closeModal() {
    document.getElementById('modal').close();
    document.body.style.overflow = 'auto';
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
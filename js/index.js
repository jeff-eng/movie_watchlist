import { addToStoredWatchlist, removeFromStoredWatchlist } from "./watchlist-functions.js";
import { getSearchResults, openModal, closeModal } from "./functions.js";
import { setupWatchlist } from "./watchlist-functions.js";

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = `http://www.omdbapi.com/?apikey=${apiKey}&`;
const searchForm = document.getElementById('search__form');
const searchInput = document.getElementById('search__input');

let currentSearchTerm = '';
let watchlist = setupWatchlist();
let searchResults = [];

// Disable search button when input is empty
searchInput.addEventListener('input', () => {
    const searchInput = document.getElementById('search__input');
    const searchButton = document.getElementById('search__button');

    searchButton.disabled = searchInput.value.length > 0 ? false : true; 
});

searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    console.log('Clicked');
    const searchFormData = new FormData(searchForm);
    const searchQuery = searchFormData.get('search-string').toLowerCase();

    if (searchQuery !== currentSearchTerm) {
        searchResults = await getSearchResults(BASE_URL, searchQuery, watchlist);
    } else return;

    
    if (searchResults.length) {
        const articles = searchResults.map(resultObj => resultObj.createResultHtml());
        document.getElementById('search-results').replaceChildren(...articles);
    } else {
        document.getElementById('search-results').innerHTML = '<h2>No results found.</h2>';
    }
});

// Handle when media item is liked/unliked
document.getElementById('search-results').addEventListener('click', event => {
    const eventTarget = event.target;

    const likedButtonMediaId = eventTarget.dataset.imdbId ?? null;
    const clickedArticleId = eventTarget.closest('article.result').id ?? null;

    if (likedButtonMediaId) {
        // Get index of matching item from search results
        const matchingItemIndex = searchResults.findIndex(item => item.imdbID === likedButtonMediaId);
        // Toggle liked state of object in searchResults array
        searchResults[matchingItemIndex].liked = !searchResults[matchingItemIndex].liked;
        console.log(searchResults[matchingItemIndex]);
        // Update watchlist variable with a class instance from searchResults that matches the index of media item that was liked
        watchlist = searchResults[matchingItemIndex].liked ? addToStoredWatchlist(searchResults[matchingItemIndex], watchlist) 
                        : removeFromStoredWatchlist(searchResults[matchingItemIndex], watchlist);
    } else if (clickedArticleId) {
        openModal(searchResults, clickedArticleId);
    } else return;
});

// Modal back button event listener - close modal
document.getElementById('modal').addEventListener('click', event => {
    if (event.target.closest('.modal__back-btn')) {
        closeModal();
    }
});
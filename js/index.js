import { addToStoredWatchlist, removeFromStoredWatchlist } from "./watchlist-functions.js";
import { getSearchResults, openModal, closeModal } from "./functions.js";
import { setupWatchlist } from "./watchlist-functions.js";

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = `http://www.omdbapi.com/?apikey=${apiKey}&`;
const searchForm = document.getElementById('search__form');
const searchInput = document.getElementById('search__input');
const searchButton = document.getElementById('search__button');
const clearSearchInputButton = document.getElementById('search__clear');

let recentSearchTerm = '';
let watchlist = setupWatchlist();
let searchResults = [];

// Disable search button when input is empty
searchInput.addEventListener('input', event => {
    // console.log(event.target.value);

    if (event.target.value.trim()) {
        clearSearchInputButton.style.display = 'block';
    } else {
        clearSearchInputButton.style.display = 'none';
    }

    searchButton.disabled = searchInput.value.length > 0 ? false : true;
});

// Search - submit event listener
searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    const searchFormData = new FormData(searchForm);
    const searchQuery = searchFormData.get('search-string').toLowerCase();

    if (searchQuery !== recentSearchTerm) {
        searchResults = await getSearchResults(BASE_URL, searchQuery, watchlist);
    } else return;

    if (searchResults.length) {
        const articles = searchResults.map(resultObj => resultObj.createResultHtml());
        // Render search results to the DOM
        document.getElementById('search-results').replaceChildren(...articles);
        // Hide the placeholders
        document.getElementById('search-placeholder').classList.add('hide');
        document.getElementById('no-results-placeholder').classList.add('hide');
        // Save recent search query so user doesn't try to search same term twice in a row
        recentSearchTerm = searchQuery;
    } else {
        document.getElementById('placeholder__no-results-message').textContent = 
            `No results found for '${searchQuery}'. Try modifying your search.`;
        document.getElementById('search-placeholder').classList.add('hide');
        document.getElementById('no-results-placeholder').classList.remove('hide');
    }
});

// Handle when media item is liked/unliked
document.getElementById('search-results').addEventListener('click', event => {
    const eventTarget = event.target;

    const likedButtonMediaId = eventTarget.dataset.imdbId ?? null;
    const clickedArticle = eventTarget.closest('article.result');

    // Screen out clicked elements that aren't articles
    if (!clickedArticle) {
        return;
    }

    // Get article id
    const clickedArticleId = clickedArticle.id;

    if (likedButtonMediaId) {
        // Get index of matching item from search results
        const matchingItemIndex = searchResults.findIndex(item => item.imdbID === likedButtonMediaId);
        // Toggle liked state of object in searchResults array
        searchResults[matchingItemIndex].liked = !searchResults[matchingItemIndex].liked;
        // Update watchlist variable with a class instance from searchResults that matches the index of media item that was liked
        watchlist = searchResults[matchingItemIndex].liked ? addToStoredWatchlist(searchResults[matchingItemIndex], watchlist) 
                        : removeFromStoredWatchlist(searchResults[matchingItemIndex], watchlist);
        
        // Change icon to fa-heart-circle-minus OR fa-heart-circle-plus depending on like state
        const clickedIcon = document.querySelector(`[data-imdb-id="${likedButtonMediaId}"]`);
        searchResults[matchingItemIndex].liked ? clickedIcon.classList.replace('fa-heart-circle-plus', 'fa-heart-circle-minus') 
                                                 : clickedIcon.classList.replace('fa-heart-circle-minus', 'fa-heart-circle-plus');
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

// Add/remove class that creates outline on focus/blur events on search input
searchInput.addEventListener('focus', () => {
    searchButton.classList.toggle('search__form--focused');
    
});

searchInput.addEventListener('blur', () => {
    searchButton.classList.toggle('search__form--focused');
});

// Listen for event on clear search button
document.getElementById('search__clear').addEventListener('click', () => {
    searchInput.value = null;
    document.getElementById('search-placeholder').classList.remove('hide');
    document.getElementById('no-results-placeholder').classList.add('hide');
    clearSearchInputButton.style.display = 'none';
});
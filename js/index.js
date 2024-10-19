import {
  addToStoredWatchlist,
  removeFromStoredWatchlist,
} from './watchlist-functions.js';
import { getSearchResults, openModal, closeModal } from './functions.js';
import { setupWatchlist } from './watchlist-functions.js';

const searchForm = document.getElementById('search__form');
const searchInput = document.getElementById('search__input');
const searchButton = document.getElementById('search__button');
const searchResultsSection = document.getElementById('search-results');
const clearSearchInputButton = document.getElementById('search__clear');

let recentSearchTerm = '';
let watchlist = setupWatchlist();
let searchResults = [];

// Disable search button when input is empty
searchInput.addEventListener('input', event => {
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
  const searchQuery = searchFormData.get('search-string').trim().toLowerCase();

  if (!searchQuery) return;

  if (searchQuery !== recentSearchTerm) {
    loadingAnimation(true);
    searchResults = await getSearchResults(searchQuery, watchlist);
  } else return;

  if (searchResults.length) {
    // End loading animation
    loadingAnimation(false);
    const articles = searchResults.map(resultObj =>
      resultObj.createResultHtml()
    );
    // Render search results to the DOM
    searchResultsSection.replaceChildren(...articles);
    // Hide the placeholders
    hidePlaceholders();
    // Save recent search query so user doesn't try to search same term twice in a row
    recentSearchTerm = searchQuery;
  } else {
    // End loading animation
    loadingAnimation(false);
    document.getElementById(
      'placeholder__no-results-message'
    ).textContent = `No results found for '${searchQuery}'. Try modifying your search.`;
    showNoResultsPlaceholder();
  }
});

// Handle when media item is liked/unliked
searchResultsSection.addEventListener('click', event => {
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
    const matchingItemIndex = searchResults.findIndex(
      item => item.imdbID === likedButtonMediaId
    );
    // Toggle liked state of object in searchResults array
    searchResults[matchingItemIndex].liked =
      !searchResults[matchingItemIndex].liked;
    // Update watchlist variable with a class instance from searchResults that matches the index of media item that was liked
    watchlist = searchResults[matchingItemIndex].liked
      ? addToStoredWatchlist(searchResults[matchingItemIndex], watchlist)
      : removeFromStoredWatchlist(searchResults[matchingItemIndex], watchlist);

    // Change icon to fa-heart-circle-minus OR fa-heart-circle-plus depending on liked state
    const clickedIcon = document.querySelector(
      `.result__like-btn > i[data-imdb-id="${likedButtonMediaId}"]`
    );
    searchResults[matchingItemIndex].liked
      ? clickedIcon.classList.replace(
          'fa-heart-circle-plus',
          'fa-heart-circle-minus'
        )
      : clickedIcon.classList.replace(
          'fa-heart-circle-minus',
          'fa-heart-circle-plus'
        );
  } else if (clickedArticleId) {
    openModal(searchResults, clickedArticleId);
  } else return;
});

// Modal back button event listener - close modal
document.getElementById('modal').addEventListener('click', event => {
  const eventTarget = event.target;
  const modalLikedButtonMediaId = event.target.dataset.imdbId;

  if (eventTarget.closest('.modal__back-btn')) {
    modal.classList.add('closed');
    setTimeout(() => {
      closeModal();
    }, 500);
  } else if (modalLikedButtonMediaId) {
    // Get index of matching item from search results
    const matchingItemIndex = searchResults.findIndex(
      item => item.imdbID === modalLikedButtonMediaId
    );
    // Toggle liked state of object in searchResults array
    searchResults[matchingItemIndex].liked =
      !searchResults[matchingItemIndex].liked;
    // Update watchlist variable with a class instance from searchResults that matches the index of media item that was liked
    watchlist = searchResults[matchingItemIndex].liked
      ? addToStoredWatchlist(searchResults[matchingItemIndex], watchlist)
      : removeFromStoredWatchlist(searchResults[matchingItemIndex], watchlist);

    // Change modal icon to fa-heart-circle-minus OR fa-heart-circle-plus depending on liked state
    const modalIcon = document.querySelector(
      `.modal__like-btn > i[data-imdb-id="${modalLikedButtonMediaId}"]`
    );
    const resultIcon = document.querySelector(
      `.result__like-btn > i[data-imdb-id="${modalLikedButtonMediaId}"]`
    );
    searchResults[matchingItemIndex].liked
      ? modalIcon.classList.replace(
          'fa-heart-circle-plus',
          'fa-heart-circle-minus'
        )
      : modalIcon.classList.replace(
          'fa-heart-circle-minus',
          'fa-heart-circle-plus'
        );
    // Change the search result icon based on liked state
    searchResults[matchingItemIndex].liked
      ? resultIcon.classList.replace(
          'fa-heart-circle-plus',
          'fa-heart-circle-minus'
        )
      : resultIcon.classList.replace(
          'fa-heart-circle-minus',
          'fa-heart-circle-plus'
        );
  }
});

// Add/remove class that creates outline on focus/blur events on search input
searchInput.addEventListener('focus', () => {
  searchButton.classList.toggle('search__form--focused');
});

searchInput.addEventListener('blur', () => {
  searchButton.classList.toggle('search__form--focused');
});

// Reset search
document.getElementById('search__clear').addEventListener('click', () => {
  searchInput.value = null;
  searchResultsSection.innerHTML = '';
  hidePlaceholders();
  showSearchPlaceholder();
  clearSearchInputButton.style.display = 'none';
});

function loadingAnimation(isLoading) {
  const loaderDiv = document.getElementById('loader');
  if (isLoading) {
    loaderDiv.classList.remove('hide');
    hidePlaceholders();
  } else {
    loaderDiv.classList.add('hide');
    hidePlaceholders();
  }
}

function showNoResultsPlaceholder() {
  document.getElementById('no-results-placeholder').classList.remove('hide');
}

function showSearchPlaceholder() {
  document.getElementById('search-placeholder').classList.remove('hide');
}

function hidePlaceholders() {
  document.getElementById('search-placeholder').classList.add('hide');
  document.getElementById('no-results-placeholder').classList.add('hide');
}

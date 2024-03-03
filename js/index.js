import { Media, Movie, Series } from "./classes.js";

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = `http://www.omdbapi.com/?apikey=${apiKey}&`;
const searchForm = document.getElementById('search__form');

// TODO: Disable button when input field is empty
let searchResults = [];

searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    console.log('Submit button clicked');
    const searchFormData = new FormData(searchForm);
    const searchQuery = searchFormData.get('search-string').toLowerCase();
    searchResults = await getSearchResults(searchQuery);
    
    console.log(searchResults);
    if (searchResults.length) {
        const articles = searchResults.map(resultObj => resultObj.createSearchResultHtml());
        document.getElementById('search-results').append(...articles);
    } else {
        document.getElementById('search-results').innerHTML = '<h2>No results found.</h2>';
    }

});

async function getSearchResults(query) {
    // Use 's' query string parameter to get paginated list of results
    const apiUrl = BASE_URL + `s=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Short-circuit failed fetch
        if (data.Response === 'False') {
            throw new Error(`Failed to fetch search results for ${query}`);
        }

        // Initial search results only include: Title, Year, Poster(image url), Type, imdbID
        // Perform additional API call for each item to get full details
        const initialSearchResults = data.Search;
        const detailedSearchResults = await Promise.allSettled(initialSearchResults.map(async result => {
            const filmDetails = await getCompleteFilmDetails(result.imdbID);
            return filmDetails;
        }));

        // Create new array of successfully retrieved films only
        const filteredResults = detailedSearchResults
            // Filter for only fulfilled promises
            .filter(result => result.status === 'fulfilled')
            // Create new array with film details only
            .map(result => {
                const resultObj = result.value;
                if (resultObj.Type === 'movie') {
                    return new Movie(resultObj);
                } else if (resultObj.Type === 'series') {
                    return new Series(resultObj);
                } else {
                    return new Media(resultObj);
                }
            });

        console.log(filteredResults);
        return filteredResults;
    } catch (err) {
        console.error(`Error: ${err}`);
        return [];
    }
}

async function getCompleteFilmDetails(imdbID) {
    const apiUrl = BASE_URL + `i=${imdbID}`;

    try {
        const response = await fetch(apiUrl);
        const data = response.json();

        if (data.Response === 'False') {
            throw new Error(`Could not get film details for search ID: ${imdbID}`);
        }

        return data;
    } catch (err) {
        console.error(err);
    }
}

// Handle when media item is liked/unliked
document.addEventListener('click', event => {
    const clickedMediaId = event.target.parentElement.dataset.imdbid;
    if (clickedMediaId) {
        // Get index of matching item
        const matchingItemIndex = searchResults.findIndex(item => item.imdbID === clickedMediaId);
        // Toggle liked state of object in searchResults array
        searchResults[matchingItemIndex].liked = !searchResults[matchingItemIndex].liked;


        if (localStorage.getItem('movieWatchlist')) {
            let storedWatchlist = JSON.parse(localStorage.getItem('movieWatchlist'));
            // Add class instance to object
            storedWatchlist[clickedMediaId] = searchResults[matchingItemIndex];
            // Save object back to local storage
            localStorage.setItem('movieWatchlist', JSON.stringify(storedWatchlist));

        } else {
            const watchlistObj = new Object();
            watchlistObj[clickedMediaId] = searchResults[matchingItemIndex];
            // Create the movieWatchlist key in local storage and save object to local storage
            localStorage.setItem('movieWatchlist', JSON.stringify(watchlistObj));
        }
        // const serializedItem = JSON.stringify(matchingItem);
        // // Store serialized instance in local storage
        // localStorage.setItem(clickedMediaId, serializedItem);

        // 
    }
});
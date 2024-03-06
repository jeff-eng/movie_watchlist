import { Media, Movie, Series } from "./classes.js";

const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = `http://www.omdbapi.com/?apikey=${apiKey}&`;
const searchForm = document.getElementById('search__form');

let watchlist = setupWatchlist();
let searchResults = [];

// TODO: Disable button when input field is empty

searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    console.log('Submit button clicked');
    const searchFormData = new FormData(searchForm);
    const searchQuery = searchFormData.get('search-string').toLowerCase();
    searchResults = await getSearchResults(searchQuery, watchlist);
    
    console.log(searchResults);
    if (searchResults.length) {
        const articles = searchResults.map(resultObj => resultObj.createSearchResultHtml());
        document.getElementById('search-results').append(...articles);
    } else {
        document.getElementById('search-results').innerHTML = '<h2>No results found.</h2>';
    }

});

async function getSearchResults(query, watchlist) {
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
        const detailedSearchResults = await Promise.allSettled(initialSearchResults.map(async result => await getCompleteFilmDetails(result.imdbID)));

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
        
        // Convert filtered results array to a dictionary/object 
        const filteredResultsObj = filteredResults.reduce((accumulator, currentValue) => {
            accumulator[currentValue.imdbID] = currentValue;
            return accumulator;
        }, {});

        // Iterate through the keys (the ids) in filtered results object and cross check against the watchlist
        Object.keys(filteredResultsObj).forEach(id => {
            // If the id from the filtered results returns a value in watchlist, then set liked property to true so we can render a filled heart on liked media
            if (watchlist[id]) {
                filteredResultsObj[id].liked = true;
            }
        });

        const filteredResultsValues = Object.values(filteredResultsObj);

        return filteredResultsValues;
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
        // Get index of matching item from search results
        const matchingItemIndex = searchResults.findIndex(item => item.imdbID === clickedMediaId);
        console.log(matchingItemIndex);
        // Toggle liked state of object in searchResults array
        searchResults[matchingItemIndex].liked = !searchResults[matchingItemIndex].liked;
        console.log(searchResults[matchingItemIndex]);

        watchlist = searchResults[matchingItemIndex].liked ? addToStoredWatchlist(searchResults[matchingItemIndex], watchlist) 
                        : removeFromStoredWatchlist(searchResults[matchingItemIndex] , watchlist);
        
        console.log(watchlist);

    } else {
        return;
    }
});

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
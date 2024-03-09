import { Media, Movie, Series } from "./classes.js";

async function getSearchResults(baseUrl, query, watchlist) {
    // Use 's' query string parameter to get paginated list of results
    const apiUrl = baseUrl + `s=${encodeURIComponent(query)}`;
    
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
        const detailedSearchResults = await Promise.allSettled(initialSearchResults.map(async result => await getCompleteFilmDetails(baseUrl, result.imdbID)));

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

async function getCompleteFilmDetails(baseUrl, imdbID) {
    const apiUrl = baseUrl + `i=${imdbID}`;

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

function openModal(searchResults, mediaId) {
    document.getElementById('modal').showModal();
    document.body.style.overflow = 'hidden';

    const index = searchResults.findIndex(element => element.imdbID === mediaId);
    const modalHtml = searchResults[index].createModalDetailHtml();

    document.getElementById('modal').replaceChildren(...modalHtml);
}

function closeModal() {
    document.getElementById('modal').close();
    document.body.style.overflow = 'auto';
}

export { getSearchResults, openModal, closeModal };
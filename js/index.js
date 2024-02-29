const searchForm = document.getElementById('search__form');
const apiKey = import.meta.env.VITE_API_KEY;
const BASE_URL = `http://www.omdbapi.com/?apikey=${apiKey}&`;
// TODO: Disable button when input field is empty


searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    console.log('Submit button clicked');
    const searchFormData = new FormData(searchForm);
    const searchQuery = searchFormData.get('search-string').toLowerCase();
    const searchResults = await getSearchResults(searchQuery);
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
            .map(result => result.value);

        console.log(filteredResults)

        // return detailedSearchResults;
    } catch (err) {
        console.error(`Error: ${err}`);
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

// TODO: Render function to display search results (successful or otherwise)
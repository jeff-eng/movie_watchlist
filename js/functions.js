// import { Media, Movie, Series } from './classes.js';
import Media from './Media';
import Movie from './Movie';
import Series from './Series';

async function getSearchResults(baseUrl, query, watchlist) {
  // Use 's' query string parameter to get paginated list of results
  //   const apiUrl = baseUrl + `s=${encodeURIComponent(query)}`

  try {
    // const response = await fetch(apiUrl);
    const response = await fetch(
      `/.netlify/functions/fetchResultsAPI?searchquery=${query}`
    );
    const data = await response.json();

    // Short-circuit failed fetch
    if (data.Response === 'False') {
      throw new Error(`Failed to fetch search results for ${query}`);
    }

    // Initial search results only include: Title, Year, Poster(image url), Type, imdbID
    // Perform additional API call for each item to get full details
    const initialSearchResults = data.Search;
    const detailedSearchResults = await Promise.allSettled(
      initialSearchResults.map(
        async result => await getCompleteFilmDetails(baseUrl, result.imdbID)
      )
    );

    // Create new array of successfully retrieved films only
    const filteredResults = detailedSearchResults
      // Filter for only fulfilled promises
      .filter(result => result.status === 'fulfilled')
      // Create new array with film details only
      .map(result => {
        const resultObj = result.value;
        return createClassInstance(resultObj);
      });

    // Convert filtered results array to a dictionary/object
    const filteredResultsObj = filteredResults.reduce(
      (accumulator, currentValue) => {
        accumulator[currentValue.imdbID] = currentValue;
        return accumulator;
      },
      {}
    );

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

// Creates and returns a class instance of Media (or one of it's child classes)
function createClassInstance(obj) {
  if (obj.Type === 'movie') {
    return new Movie(obj);
  } else if (obj.Type === 'series') {
    return new Series(obj);
  } else {
    return new Media(obj);
  }
}

async function getCompleteFilmDetails(baseUrl, imdbID) {
  //   const apiUrl = baseUrl + `i=${imdbID}`;
  //   const response = await fetch(
  //     `/.netlify/functions/fetchDetailedResultAPI?imdb_id=${imdbID}`
  //   );
  //   console.log(imdbID);
  try {
    // const response = await fetch(apiUrl);
    const response = await fetch(
      `/.netlify/functions/fetchDetailedResultAPI?imdb_id=${imdbID}`
    );

    const data = await response.json();

    // console.log('Line 93 ', data);

    if (data.Response === 'False') {
      throw new Error(`Could not get film details for search ID: ${imdbID}`);
    }

    return data;
  } catch (err) {
    console.error(err);
  }
}

function openModal(searchResults, mediaId) {
  const modal = document.getElementById('modal');
  const index = searchResults.findIndex(element => element.imdbID === mediaId);
  const modalHtml = searchResults[index].createModalDetailHtml();

  modal.classList.remove('closed');

  modal.showModal();
  modal.replaceChildren(...modalHtml);
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.close();
  document.body.style.overflow = 'auto';
}

export { getSearchResults, openModal, closeModal, createClassInstance };

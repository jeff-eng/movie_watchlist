# MovieMate - A Movie Watchlist app

MovieMate is a movie and TV show search discovery web app powered by the Open Movie Database (OMDB) API, built with vanilla JavaScript, CSS, and semantic HTML.

It was built as part of my journey learning async JavaScript, focusing on API interaction, using async-await syntax for handling promises, and try-catch for error handling.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Demo](#demo)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Fetch movie and TV show data from the [Open Movie Database (OMBD) API](https://www.omdbapi.com/), display the search results, and allow users to save titles to their watchlist using local storage.

### Demo

#### Homepage/Search

![Search demo](./readme_assets/moviemate-search.gif)

#### Watchlist

![Watchlist demo](./readme_assets/moviemate-watchlist.gif)

### Links

- Live Site URL: [MovieMate](https://movie-mate-webapp.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- Async JavaScript
- Nested CSS
- Flexbox
- CSS Grid
- JavaScript classes
- Mobile-first workflow

### What I learned

Async-await syntax was put into practice for this project to make asynchronous code look more synchronous.

**async-await**

```js
async function getCompleteFilmDetails(imdbID) {
  try {
    const response = await fetch(
      `/.netlify/functions/fetchDetailedResultAPI?imdb_id=${imdbID}`
    );

    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error(`Could not get film details for search ID: ${imdbID}`);
    }

    return data;
  } catch (err) {
    console.error(`Error getting film details: ${err}`);
  }
}
```

**JavaScript classes**

```js
export default class Movie extends Media {
  constructor(obj) {
    super(obj);
    this.Dvd = obj.DVD;
    this.BoxOffice = obj.BoxOffice;
    this.Production = obj.Production;
    this.Website = obj.Website;
  }
}
```

### Continued development

- Adding Firebase authentication
- Firebase database for storing user watchlist
- Converting codebase to React

### Useful resources

- [Example resource 1](https://www.example.com) - This helped me for XYZ reason. I really liked this pattern and will use it going forward.
- [Example resource 2](https://www.example.com) - This is an amazing article which helped me finally understand XYZ. I'd recommend it to anyone still learning this concept.

## Author

- [Jeff Eng](https://www.jeffeng.com)
- X (formerly Twitter) [@elev8eng](https://x.com/elev8eng)

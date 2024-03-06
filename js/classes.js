class Media {
    constructor(obj) {
        this.title = obj.Title;
        this.year = obj.Year;
        this.rated = obj.Rated;
        this.released = obj.Released;
        this.runtime = obj.Runtime;
        this.genre = obj.Genre;
        this.director = obj.Director;
        this.writer = obj.Writer;
        this.actors = obj.Actors;
        this.plot = obj.Plot;
        this.language = obj.Language;
        this.country = obj.Country;
        this.awards = obj.Awards;
        this.poster = obj.Poster;
        this.ratings = obj.Ratings;
        this.metascore = obj.Metascore;
        this.imdbRating = obj.imdbRating;
        this.imdbVotes = obj.imdbVotes;
        this.imdbID = obj.imdbID;
        this.type = obj.Type;
        this.liked = false;
    }

    #createBasicElement(tagType = 'div', idName = '', ...classNames) {
        const htmlElement = document.createElement(tagType);
        htmlElement.id = idName;
        htmlElement.classList.add(...classNames);

        return htmlElement;
    }

    createSearchResultHtml() {
        const article = this.#createBasicElement('article', this.imdbID, 'result');
        
        // Use placeholder image for instances where poster is N/A
        if (this.poster === 'N/A') {
            this.poster = './../assets/imgholdr-image.png';
        }

        article.innerHTML = `
            <picture>
                <source srcset="${this.poster}" type="image/png">
                <img class="result__img" src="${this.poster}" alt="${this.title} ${this.type} poster">
            </picture>
            <h2 class="result__title">${this.title} (<time datetime="${this.year}">${this.year}</time>)</h2>
            <button class="result__like-btn" type="button" data-imdbID="${this.imdbID}">
                <i class="${this.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <span class="result__type">${this.type}</span>
            <time datetime="PT${this.runtime}M">${this.runtime}</time>
            <span class="result__genre">${this.genre}</span>
            <span class="result__rating">
                <i class="fa-solid fa-star"></i>
                <span class="result__rating-value">${this.imdbRating}</span>
            </span>
        `;

        return article;
    }
}

class Movie extends Media {
    constructor(obj) {
        super(obj);
        this.dvd = obj.DVD;
        this.boxOffice = obj.BoxOffice;
        this.production = obj.Production;
        this.website = obj.Website;
    }
}

class Series extends Media {
    constructor(obj) {
        super(obj);
        this.totalSeasons = Number(obj.totalSeasons);
    }
}

export { Media, Movie, Series};
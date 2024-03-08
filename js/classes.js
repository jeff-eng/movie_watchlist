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
            <button class="result__like-btn" type="button">
                <i class="${this.liked ? 'fa-solid' : 'fa-regular'} fa-heart" data-imdb-id="${this.imdbID}"></i>
            </button>
            <span class="result__type">${this.type}</span>
            <time datetime="PT${this.runtime.split(' ')[0]}M">${this.runtime}</time>
            <span class="result__genre">${this.genre}</span>
            <span class="result__rating">
                <i class="fa-solid fa-star"></i>
                <span class="result__rating-value">${this.imdbRating}</span>
            </span>
        `;

        return article;
    }

    createModalDetailHtml() {
        const backButton = this.#createBasicElement('button', '', 'modal__back-btn');
        const backIcon = this.#createBasicElement('i', '', 'fa-solid', 'fa-arrow-left');
        backButton.appendChild(backIcon);

        const mediaDivEl = this.#createBasicElement('div', '', 'media');

        // Use placeholder image for instances where poster is N/A
        if (this.poster === 'N/A') {
            this.poster = './../assets/imgholdr-image.png';
        }

        mediaDivEl.innerHTML = `
            <button class="modal__like-btn" type="button">
                <i class="fa-regular fa-heart"></i>
            </button>
            <picture>
                <source srcset="${this.poster}" type="image/png">
                <img class="media__poster" src="${this.poster}" alt="${this.title} ${this.type} poster">
            </picture>
            <h2 class="media__title">${this.title}</h2>
            <time class="media__runtime" datetime="PT${this.runtime.split(' ')[0]}M">${this.runtime}</time>
            <span class="media__rated">${this.rated}</span>
            <span class="media__rating">
                <i class="fa-solid fa-star"></i>
                <span class="media__rating-value">${this.imdbRating}</span>
            </span>
            <span class="media__genre">${this.genre}</span>
            <p class="media__plot">${this.plot}</p>
            <dl class="media__info">
                <div>
                    <dt class="media__term">Year</dt>
                    <dd class="media__detail">${this.year}</dd>
                </div>
                <div>
                    <dt class="media__term">Director(s)</dt>
                    <dd class="media__detail">${this.director}</dd> 
                </div>
                <div>
                    <dt class="media__term">Writer(s)</dt>
                    <dd class="media__detail">${this.writer}</dd>
                </div>
                <div>
                    <dt class="media__term">Actor(s)</dt>
                    <dd class="media__detail">${this.actors}</dd>
                </div>
                <div>
                    <dt class="media__term">Box Office</dt>
                    <dd class="media__detail">${this.boxOffice ?? 'N/A'}</dd>
                </div>
            </dl>
        `;

        return [backButton, mediaDivEl];
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
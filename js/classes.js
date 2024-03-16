class Media {
    constructor(obj) {
        this.Title = obj.Title;
        this.Year = obj.Year;
        this.Rated = obj.Rated;
        this.Released = obj.Released;
        this.Runtime = obj.Runtime;
        this.Genre = obj.Genre;
        this.Director = obj.Director;
        this.Writer = obj.Writer;
        this.Actors = obj.Actors;
        this.Plot = obj.Plot;
        this.Language = obj.Language;
        this.Country = obj.Country;
        this.Awards = obj.Awards;
        this.Poster = obj.Poster;
        this.Ratings = obj.Ratings;
        this.Metascore = obj.Metascore;
        this.imdbRating = obj.imdbRating;
        this.imdbVotes = obj.imdbVotes;
        this.imdbID = obj.imdbID;
        this.Type = obj.Type;
        this.liked = obj.liked || false;
    }

    #createBasicElement(tagType = 'div', idName = '', ...classNames) {
        const htmlElement = document.createElement(tagType);
        htmlElement.id = idName;
        htmlElement.classList.add(...classNames);

        return htmlElement;
    }

    createResultHtml() {
        const article = this.#createBasicElement('article', this.imdbID, 'result');
        
        // Use placeholder image for instances where poster is N/A
        if (this.Poster === 'N/A') {
            this.Poster = './../assets/imgholdr-image.png';
        }

        article.innerHTML = `
            <picture>
                <source srcset="${this.Poster}" type="image/png">
                <img class="result__img" src="${this.Poster}" alt="${this.Title} ${this.Type} poster">
            </picture>
            <div class="result__details">
                <h2 class="result__title">${this.Title} (<time datetime="${this.Year}">${this.Year}</time>)</h2>
                <span class="result__type">${this.Type} 
                    <time class="result__runtime" datetime="PT${this.Runtime.split(' ')[0]}M">${this.Runtime}</time>
                </span>
                <span class="result__genre">${this.Genre}</span>
                <span class="result__rating">
                    <i class="fa-solid fa-star"></i>
                    <span class="result__rating-value">${this.imdbRating}</span>
                </span>
            </div>
            <button class="result__like-btn" type="button">
                <i class="fa-solid ${this.liked ? 'fa-heart' : 'fa-heart-circle-plus'}" data-imdb-id="${this.imdbID}"></i>
            </button>
        `;

        return article;
    }

    createModalDetailHtml() {
        const backButton = this.#createBasicElement('button', '', 'modal__back-btn');
        const backIcon = this.#createBasicElement('i', '', 'fa-solid', 'fa-arrow-left');
        backButton.appendChild(backIcon);

        const mediaDivEl = this.#createBasicElement('div', '', 'media');

        // Use placeholder image for instances where poster is N/A
        if (this.Poster === 'N/A') {
            this.Poster = './../assets/imgholdr-image.png';
        }

        mediaDivEl.innerHTML = `
            <button class="modal__like-btn" type="button">
                <i class="fa-regular fa-heart"></i>
            </button>
            <picture>
                <source srcset="${this.Poster}" type="image/png">
                <img class="media__poster" src="${this.Poster}" alt="${this.Title} ${this.Type} poster">
            </picture>
            <h2 class="media__title">${this.Title}</h2>
            <time class="media__runtime" datetime="PT${this.Runtime.split(' ')[0]}M">${this.Runtime}</time>
            <span class="media__rated">${this.Rated}</span>
            <span class="media__rating">
                <i class="fa-solid fa-star"></i>
                <span class="media__rating-value">${this.imdbRating}</span>
            </span>
            <span class="media__genre">${this.Genre}</span>
            <p class="media__plot">${this.Plot}</p>
            <dl class="media__info">
                <div>
                    <dt class="media__term">Year</dt>
                    <dd class="media__detail">${this.Year}</dd>
                </div>
                <div>
                    <dt class="media__term">Director(s)</dt>
                    <dd class="media__detail">${this.Director}</dd> 
                </div>
                <div>
                    <dt class="media__term">Writer(s)</dt>
                    <dd class="media__detail">${this.Writer}</dd>
                </div>
                <div>
                    <dt class="media__term">Actor(s)</dt>
                    <dd class="media__detail">${this.Actors}</dd>
                </div>
                <div>
                    <dt class="media__term">Box Office</dt>
                    <dd class="media__detail">${this.BoxOffice ?? 'N/A'}</dd>
                </div>
            </dl>
        `;

        return [backButton, mediaDivEl];
    }
}

class Movie extends Media {
    constructor(obj) {
        super(obj);
        this.Dvd = obj.DVD;
        this.BoxOffice = obj.BoxOffice;
        this.Production = obj.Production;
        this.Website = obj.Website;
    }
}

class Series extends Media {
    constructor(obj) {
        super(obj);
        this.totalSeasons = Number(obj.totalSeasons);
    }
}

export { Media, Movie, Series };
export default class Media {
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
      this.Poster = './assets/imgholdr-image.png';
    }

    article.innerHTML = `
          <picture>
              <source srcset="${this.Poster}" type="image/png">
              <img class="result__img" src="${this.Poster}" alt="${
      this.Title
    } ${this.Type} poster">
          </picture>
          <div class="result__details">
              <h2 class="result__title">${this.Title} (<time datetime="${
      this.Year
    }">${this.Year}</time>)</h2>
              <span class="result__type">${this.Type} 
                  <time class="result__runtime" datetime="PT${
                    this.Runtime.split(' ')[0]
                  }M">${this.Runtime}</time>
              </span>
              <span class="result__genre">${this.Genre}</span>
              <span class="result__rating">
                  <i class="fa-solid fa-star"></i>
                  <span class="result__rating-value">${this.imdbRating}</span>
              </span>
          </div>
          <button class="result__like-btn" type="button">
              <i class="fa-solid ${
                this.liked ? 'fa-heart-circle-minus' : 'fa-heart-circle-plus'
              }" data-imdb-id="${this.imdbID}"></i>
          </button>
      `;

    return article;
  }

  createModalDetailHtml() {
    const mediaDivEl = this.#createBasicElement(
      'div',
      'modal__inner',
      'modal__inner'
    );

    // Use placeholder image for instances where poster is N/A
    if (this.Poster === 'N/A') {
      this.Poster = './assets/imgholdr-image.png';
    }

    // Set poster as background image of modal
    mediaDivEl.style.backgroundImage = `linear-gradient(to bottom, rgba(2, 8, 22, 0.7), rgba(2, 8, 22)), url('${this.Poster}')`;

    mediaDivEl.innerHTML = `
          <div class="modal__btn-wrapper">
              <button class="modal__back-btn" type="button">
                  <i class="fa-solid fa-arrow-left"></i>
              </button>
              <button class="modal__like-btn" type="button">
                  <i class="fa-solid ${
                    this.liked
                      ? 'fa-heart-circle-minus'
                      : 'fa-heart-circle-plus'
                  }" data-imdb-id="${this.imdbID}"></i>
              </button>
          </div>
          <header class="media__header">
              <h2 class="media__title">${this.Title}</h2>
              <h3 class="media__quick-info">
                  <time class="media__runtime" datetime="PT${
                    this.Runtime.split(' ')[0]
                  }M">
                      <i class="fa-regular fa-clock"></i>
                      ${this.Runtime}
                  </time>
                  <span class="media__rated">
                      <i class="fa-regular fa-circle-check"></i>    
                      ${this.Rated}
                  </span>
                  <span class="media__rating">
                      <i class="fa-solid fa-star"></i>
                      <span class="media__rating-value">${
                        this.imdbRating
                      }</span>
                  </span>
              </h3>
              <h3 class="media__genre"><i class="fa-solid fa-clapperboard"></i> ${
                this.Genre
              }</h3>
          </header>
          <p class="media__plot">${this.Plot}</p>
          <dl class="media__info">
              <dt class="media__term">Year</dt>
              <dd class="media__detail">${this.Year}</dd>

              <dt class="media__term">Director(s)</dt>
              <dd class="media__detail">${this.Director}</dd>

              <dt class="media__term">Writer(s)</dt>
              <dd class="media__detail">${this.Writer}</dd>

              <dt class="media__term">Actor(s)</dt>
              <dd class="media__detail">${this.Actors}</dd>

              <dt class="media__term">Box Office</dt>
              <dd class="media__detail">${this.BoxOffice ?? 'N/A'}</dd>
          </dl>
      `;

    return [mediaDivEl];
  }
}

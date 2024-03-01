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
    #totalSeasons;

    constructor(obj) {
        super(obj);
        this.#totalSeasons = obj.totalSeasons;
    }

    get numberOfSeasons() {
        return Number(this.#totalSeasons);
    }
}

export { Media, Movie, Series};
import Media from './classes/Media';

export default class Movie extends Media {
  constructor(obj) {
    super(obj);
    this.Dvd = obj.DVD;
    this.BoxOffice = obj.BoxOffice;
    this.Production = obj.Production;
    this.Website = obj.Website;
  }
}

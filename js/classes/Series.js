import Media from './Media';

export default class Series extends Media {
  constructor(obj) {
    super(obj);
    this.totalSeasons = Number(obj.totalSeasons);
  }
}

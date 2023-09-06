import Model, { hasMany, belongsTo } from '@ember-data/model';
import { A } from '@ember/array';

export default Model.extend({
  chapters: hasMany('chapter', {inverse: 'isChaptersOf'}),
  chapter: belongsTo('chapter', {inverse: 'isChapterOf'}),
  chaptersArray: A(),
  simpleArray: A(),
  filterMe: true,
  init () {
    this.set('chaptersArray', A());
    this.set('simpleArray', A());
    this._super(...arguments);
  }
});

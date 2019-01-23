import DS from 'ember-data';
import {A} from '@ember/array';

export default DS.Model.extend({
  chapters: DS.hasMany('chapter', {inverse: 'isChaptersOf'}),
  chapter: DS.belongsTo('chapter', {inverse: 'isChapterOf'}),
  chaptersArray: A(),
  simpleArray: A(),
  filterMe: true,
  init () {
    this.set('chaptersArray', A());
    this.set('simpleArray', A());
    this._super(...arguments);
  }
});

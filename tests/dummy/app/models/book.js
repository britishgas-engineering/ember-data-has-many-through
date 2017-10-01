import DS from 'ember-data';

export default DS.Model.extend({
  chapters: DS.hasMany('chapter', {inverse: 'isChaptersOf'}),
  chapter: DS.belongsTo('chapter', {inverse: 'isChapterOf'}),
  chaptersArray: [],
  simpleArray: [],
  filterMe: true
});

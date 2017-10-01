import DS from 'ember-data';

export default DS.Model.extend({
  isChaptersOf: DS.belongsTo('book', {inverse: 'chapters'}),
  isChapterOf: DS.belongsTo('book', {inverse: 'chapter'})
});

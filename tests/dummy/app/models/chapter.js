import Model, { belongsTo } from '@ember-data/model';

export default Model.extend({
  isChaptersOf: belongsTo('book', {inverse: 'chapters'}),
  isChapterOf: belongsTo('book', {inverse: 'chapter'})
});

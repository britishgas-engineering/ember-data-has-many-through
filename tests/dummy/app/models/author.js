import { filterBy } from '@ember/object/computed';
import Model, { hasMany } from '@ember-data/model';
import hasManyThrough from 'dummy/macros/has-many-through';
import concat from 'dummy/macros/concat';

export default Model.extend({
  books: hasMany('book'),
  chapters: hasManyThrough('books'),
  chaptersBelongsTo: hasManyThrough('books', 'chapter'),
  chaptersArray: hasManyThrough('books'),
  simpleArray: hasManyThrough('books'),
  filteredBooks: filterBy('books', 'filterMe', true),
  concatArray: concat('filteredBooks', 'simpleArray')
});

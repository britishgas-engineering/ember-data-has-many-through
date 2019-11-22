import { filterBy } from '@ember/object/computed';
import DS from 'ember-data';
import hasManyThrough from 'dummy/macros/has-many-through';
import concat from 'dummy/macros/concat';

export default DS.Model.extend({
  books: DS.hasMany('book'),
  chapters: hasManyThrough('books'),
  chaptersBelongsTo: hasManyThrough('books', 'chapter'),
  chaptersArray: hasManyThrough('books'),
  simpleArray: hasManyThrough('books'),
  filteredBooks: filterBy('books', 'filterMe', true),
  concatArray: concat('filteredBooks', 'simpleArray')
});

import DS from 'ember-data';
import hasManyThrough from 'dummy/macros/has-many-through';
import hasManyThroughNonObject from 'dummy/macros/has-many-through-non-object';
import concat from 'dummy/macros/concat';
import Ember from 'ember';
const {computed} = Ember;

export default DS.Model.extend({
  books: DS.hasMany('book'),
  chapters: hasManyThrough('books'),
  chaptersBelongsTo: hasManyThrough('books', 'chapter'),
  chaptersArray: hasManyThrough('books'),
  simpleArray: hasManyThroughNonObject('books'),
  filteredBooks: computed.filterBy('books', 'filterMe', true),
  concatArray: concat('filteredBooks', 'simpleArray')
});

import DS from 'ember-data';
import hasManyThrough from 'dummy/macros/has-many-through';
import hasManyThroughNonObject from 'dummy/macros/has-many-through-non-object';
import concat from 'dummy/macros/concat';
import Ember from 'ember';
const {computed} = Ember;

export default DS.Model.extend({
  children: DS.hasMany('child'),
  childrenOfChild: hasManyThrough('children'),
  childrenOfChildren: hasManyThrough('children', 'childrenOfChild'),
  childrenOfChildArray: hasManyThrough('children'),
  simpleArray: hasManyThroughNonObject('children'),
  filteredChildren: computed.filterBy('children', 'filterMe', true),
  concatArray: concat('filteredChildren', 'simpleArray')
});

import DS from 'ember-data';

export default DS.Model.extend({
  childrenOfChild: DS.hasMany('childOfChild'),
  childrenOfChildArray: [],
  simpleArray: [],
  filterMe: true
});

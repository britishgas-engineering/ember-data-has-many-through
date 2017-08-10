import DS from 'ember-data';

export default DS.Model.extend({
  childrenOfChild: DS.hasMany('childOfChild'),
  childrenOfChildArray: [],
  singleChildOfChild: DS.belongsTo('childOfChild'),
  simpleArray: [],
  filterMe: true
});

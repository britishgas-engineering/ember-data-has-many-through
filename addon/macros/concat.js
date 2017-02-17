import Ember from 'ember';
const {computed, assert, isArray} = Ember;

/**
  @method hasManyThrough
  @param hasMany child
  @param hasMany childOfChild
*/

export default function (...args) {
  let childKey = args[0],
    childOfChildKey = args[1];

  return computed(`${childKey}.@each.${childOfChildKey}`, function () {
    let children = this.get(childKey) || [];
    assert(isArray(children), 'your child is not an array');
    let mappedChildren = children.map(function (child) {
      let childOfChild = child.get(childOfChildKey) || [];
      assert(isArray(childOfChild), 'your childOfChild is not an array');
      return childOfChild.toArray();
    });
    return [].concat.apply([], mappedChildren);
  });
}

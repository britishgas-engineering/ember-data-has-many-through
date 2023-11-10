import { isArray } from '@ember/array';
import type MutableArray from '@ember/array/mutable';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';

/**
  @method hasManyThrough
  @param hasMany child
  @param hasMany childOfChild
*/

export default function (...args) {
  let childKey = args[0],
    childOfChildKey: any = args[1];

  return computed(`${childKey}.@each.${childOfChildKey}`, function () {
    let children: Array<any> = this.get(childKey) || [];
    assert('your child is not an array', isArray(children));
    let mappedChildren: any = children.map(function (child) {
      let childOfChild: MutableArray<any> = child.get(childOfChildKey) || [];
      assert('your childOfChild is not an array', isArray(childOfChild));
      return childOfChild.toArray();
    });
    return [].concat.apply([], mappedChildren);
  });
}

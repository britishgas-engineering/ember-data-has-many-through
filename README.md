<<<<<<< HEAD
# Ember-data-has-many-through

A small Addon to concatenate array of arrays, including promiseArrays / Ember Data hasMany relationships, it provides three macros:
* `concat` allows to concatenate arrays of Ember Objects containing arrays.
* `hasManyThroughNonObject` allows to concatenate hasMany relationships containing arrays.
* `hasManyThrough` allows to concatenate hasMany relationships (or arrays of Ember Objects) containing hasMany relationships.

## concat

This is the standard transposition of javascript's `concat` method to Ember arrays:

``````javascript
// models/parent.js
import DS from 'ember-data';
import concat from 'dummy/macros/concat';

export default DS.Model.extend({
  children: DS.hasMany('child'),
  // or any other Array of Ember Objects containing arrays
  filteredChildren: computed.filterBy('children', 'filterMe', true),
  concatArray: concat('filteredChildren', 'simpleArray')
});
``````

``````javascript
// models/child.js
import DS from 'ember-data';

export default DS.Model.extend({
  filterMe: true,
  simpleArray: []
});
``````

## hasManyThroughNonObject

Given an Ember-Data `parent` model with a hasMany `children` relationship on a `child` model that has a `simpleArray` Ember array,
then you can use the `hasManyThroughNonObject` computed property provided by this addon to concatenate all the `simpleArray` of `child` models
into a single `simpleArray` property on the `parent` model.

``````javascript
// models/parent.js
import DS from 'ember-data';
import hasManyThroughNonObject from 'dummy/macros/has-many-through-non-object';

export default DS.Model.extend({
  children: DS.hasMany('child'),
  //concatenates each children's 'simpleArray' in to a single array
  simpleArray: hasManyThroughNonObject('children'),
});
``````

``````javascript
// models/child.js
import DS from 'ember-data';

export default DS.Model.extend({
  simpleArray: []
});
``````

## hasManyThrough

Given an Ember-Data `parent` model with a hasMany `children` relationship on a `child` model that itself has a hasMany `childrenOfChild` relationship,
then you can use the `hasManyThrough` computed property provided by this addon to concatenate all the `childrenOfChild` of `child` models
into a single `childrenOfChild` property on the `parent` model.

``````javascript
// models/parent.js
import DS from 'ember-data';
import hasManyThrough from 'dummy/macros/has-many-through';

export default DS.Model.extend({
  children: DS.hasMany('child'),
  // will concatenate the 'childrenOfChild' of each 'child' into a promiseArray CP
  childrenOfChild: hasManyThrough('children'),
  // if you want to name the property differently from the name given on the `children` hasMany property
  childrenOfChildren: hasManyThrough('children', 'childrenOfChild'),
  // this also works if the property on the 'child' model is an array (not a promise)
  childrenOfChildArray: hasManyThrough('children')
});
``````

``````javascript
// models/child.js
import DS from 'ember-data';

export default DS.Model.extend({
  childrenOfChild: DS.hasMany('childOfChild'),
  childrenOfChildArray: []
});
``````

``````javascript
// models/child-of-child.js
import DS from 'ember-data';

export default DS.Model.extend({});
``````

See the `test/dummy app` for further details.
=======
my-addon
==============================================================================

[Short description of the addon.]
>>>>>>> 0888853... message

Installation
------------------------------------------------------------------------------

```
ember install my-addon
```


Usage
------------------------------------------------------------------------------

[Longer description of how to use the addon in apps.]

<<<<<<< HEAD
* `npm test` (Runs `ember try:testall` to test your Addon against multiple Ember versions)
* `ember test`
* `ember test --server`
=======
>>>>>>> 0888853... message

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

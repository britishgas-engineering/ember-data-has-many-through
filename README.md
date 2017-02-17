# Ember-data-has-many-through

A small Addon to concatenate array of arrays, including promiseArrays / Ember Data hasMany relationships, it provides three macros:
* `concat` allows to concatenate (Ember) arrays of (Ember) arrays.
* `hasManyThroughNonObject` allows to concatenate (Ember) arrays of hasMany relationships.
* `hasManyThrough` allows to concatenate hasMany relationships (or arrays of Ember Objects) of hasMany relationships.

## concat

This is the standard transposition of javascript's `concat` method to Ember arrays:

``````javascript
// models/parent.js
import DS from 'ember-data';
import concat from 'dummy/macros/concat';

export default DS.Model.extend({
  children: DS.hasMany('child'),
  // or any other Ember Array
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

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your Addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).

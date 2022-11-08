<<<<<<< HEAD
# Ember-data-has-many-through
=======
# ember-data-has-many-through
>>>>>>> 5aae312 (v3.12.0...v4.8.0)

A small Addon to concatenate array of arrays, including promiseArrays / Ember Data hasMany relationships, it provides three macros:
* `concat` allows to concatenate arrays of Ember Objects containing arrays.
* `hasManyThroughNonObject` allows to concatenate hasMany relationships containing arrays.
* `hasManyThrough` allows to concatenate hasMany relationships (or arrays of Ember Objects) containing hasMany relationships.

## concat

<<<<<<< HEAD
This is the standard transposition of javascript's `concat` method to Ember arrays:

``````javascript
// models/parent.js
import DS from 'ember-data';
import concat from 'dummy/macros/concat';
=======
## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above
* Node.js v14 or above
>>>>>>> 5aae312 (v3.12.0...v4.8.0)

export default DS.Model.extend({
  children: DS.hasMany('child'),
  // or any other Array of Ember Objects containing arrays
  filteredChildren: computed.filterBy('children', 'filterMe', true),
  concatArray: concat('filteredChildren', 'simpleArray')
});
``````

<<<<<<< HEAD
``````javascript
// models/child.js
import DS from 'ember-data';
=======
## Installation
>>>>>>> 5aae312 (v3.12.0...v4.8.0)

export default DS.Model.extend({
  filterMe: true,
  simpleArray: []
});
``````

## hasManyThroughNonObject

<<<<<<< HEAD
Given an Ember-Data `parent` model with a hasMany `children` relationship on a `child` model that has a `simpleArray` Ember array,
then you can use the `hasManyThroughNonObject` computed property provided by this addon to concatenate all the `simpleArray` of `child` models
into a single `simpleArray` property on the `parent` model.
=======
## Usage
>>>>>>> 5aae312 (v3.12.0...v4.8.0)

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

<<<<<<< HEAD
``````javascript
// models/child.js
import DS from 'ember-data';
=======
## Contributing
>>>>>>> 5aae312 (v3.12.0...v4.8.0)

export default DS.Model.extend({
  simpleArray: []
});
``````

## hasManyThrough

<<<<<<< HEAD
Given an Ember-Data `parent` model with a hasMany `children` relationship on a `child` model that itself has a hasMany `childrenOfChild` 
relationship (or a `childrenOfChildArray` standard array), then you can use the `hasManyThrough` computed property provided by this addon to 
concatenate all the `childrenOfChild` of child models into a single `childrenOfChild` property on the `parent` model.
=======
## License
>>>>>>> 5aae312 (v3.12.0...v4.8.0)

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

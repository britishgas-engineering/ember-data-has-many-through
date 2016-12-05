# Ember-data-has-many-through

A small Addon to forward hasMany of hasMany relationships to the grand-parent.

Given an Ember-Data `parent` model with a hasMany `children` relationship on a `child` model that itself has a hasMany `childrenOfChild` relationship,
then you can use the `hasManyThrough` computed property provided by this Addon to concatenate all the `childrenOfChild` of `child` models
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

See the `test/dummy app` for further examples.

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

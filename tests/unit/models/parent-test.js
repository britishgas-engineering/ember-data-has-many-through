import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForModel('parent', 'Unit | Model | parent', {
  needs: [
    'model:child',
    'model:child-of-child'
  ]
});

test('it exists', function (assert) {
  var model = this.subject();
  assert.ok(!!model);
});

test('hasManyThrough on hasMany of one hasMany', function (assert) {
  let store = this.store(),
    childOfChild1, childOfChild2, child, parent;
  parent = this.subject();
  Ember.run(() => {
    childOfChild1 = store.createRecord('child-of-child');
    childOfChild2 = store.createRecord('child-of-child');
    child = store.createRecord('child');
    parent.get('children').then((children) => {
      child.get('childrenOfChild').then((childrenOfChild) => {
        let arrayOfChildOfChild = [childOfChild1];

        childrenOfChild.pushObjects(arrayOfChildOfChild);
        child.get('childrenOfChildArray').pushObjects(arrayOfChildOfChild);
        children.pushObject(child);
        parent.get('childrenOfChild').then((res) => {
          assert.deepEqual(
            res,
            arrayOfChildOfChild,
            'the hasManyThrough property forwards the hasMany of one hasMany child'
          );
          assert.deepEqual(
            parent.get('childrenOfChild.content'),
            arrayOfChildOfChild,
            'the hasManyThrough property is a promiseArray'
          );
        });
        parent.get('childrenOfChildArray').then((res) => {
          assert.deepEqual(
            res,
            arrayOfChildOfChild,
            'the hasManyThrough property forwards the CP array of one hasMany child'
          );
          assert.deepEqual(
            parent.get('childrenOfChildArray.content'),
            arrayOfChildOfChild,
            'the hasManyThrough property is a promiseArray'
          );
        });
        parent.get('childrenOfChildren').then((res) => {
          assert.deepEqual(
            res,
            arrayOfChildOfChild,
            'the hasManyThrough property can be aliased to another property name'
          );
        });
        Ember.RSVP.all([
          parent.get('childrenOfChild'),
          parent.get('childrenOfChildArray'),
          parent.get('childrenOfChildren')
        ]).then(() => {
          arrayOfChildOfChild = [childOfChild1, childOfChild2];
          childrenOfChild.pushObjects(arrayOfChildOfChild);
          child.get('childrenOfChildArray').pushObjects(arrayOfChildOfChild);
          children.pushObject(child);
          parent.get('childrenOfChild').then((res) => {
            assert.deepEqual(
              res,
              arrayOfChildOfChild,
              'the hasManyThrough property forwards the hasMany of one hasMany child after adding a record'
            );
            assert.deepEqual(
              parent.get('childrenOfChild.content'),
              arrayOfChildOfChild,
              'the hasManyThrough property is a promiseArray after adding a record'
            );
          });
          parent.get('childrenOfChildArray').then((res) => {
            assert.deepEqual(
              res,
              arrayOfChildOfChild,
              'the hasManyThrough property forwards the CP array of one hasMany child after adding a record'
            );
            assert.deepEqual(
              parent.get('childrenOfChildArray.content'),
              arrayOfChildOfChild,
              'the hasManyThrough property is a promiseArray after adding a record'
            );
          });
          parent.get('childrenOfChildren').then((res) => {
            assert.deepEqual(
              res,
              arrayOfChildOfChild,
              'the hasManyThrough property can be aliased to another property name after adding a record'
            );
          });
        });
      });
    });
  });
});

test('hasManyThrough on hasMany of several hasMany', function (assert) {
  let store = this.store(),
    childOfChild1, childOfChild2, childOfChild3 , child1, child2, parent;
  parent = this.subject();
  Ember.run(() => {
    childOfChild1 = store.createRecord('child-of-child');
    childOfChild2 = store.createRecord('child-of-child');
    childOfChild3 = store.createRecord('child-of-child');
    child1 = store.createRecord('child');
    child2 = store.createRecord('child');
    let arrayOfChildOfChild = [childOfChild1, childOfChild2, childOfChild3];
    parent.get('children').then((children) => {
      let prom = [
        child1.get('childrenOfChild').then((childrenOfChild) => {
          childrenOfChild.pushObjects([childOfChild1, childOfChild2]);
          child1.get('childrenOfChildArray').pushObjects([childOfChild1, childOfChild2]);
        }),
        child2.get('childrenOfChild').then((childrenOfChild) => {
          childrenOfChild.pushObjects([childOfChild2, childOfChild3]);
          child2.get('childrenOfChildArray').pushObjects([childOfChild2, childOfChild3]);
        })
      ];
      return Ember.RSVP.all(prom).then(() => {
        children.pushObjects([child1, child2]);
        return parent.get('childrenOfChild');
      });
    }).then((res) => {
      assert.deepEqual(
        res,
        arrayOfChildOfChild,
        'the hasManyThrough property forwards the hasMany of two hasMany children'
      );
      assert.equal(
        res.get('length'),
        3,
        'the hasManyThrough property removes duplicates from the final array'
      );
      return parent.get('childrenOfChildArray');
    }).then((res) => {
      assert.deepEqual(
        res,
        arrayOfChildOfChild,
        'the hasManyThrough property forwards the CP array of two hasMany children'
      );
      assert.equal(
        res.get('length'),
        3,
        'the hasManyThrough property removes duplicates from the final array'
      );
    }).then(() => {
      return childOfChild1.destroyRecord();
    }).then(() => {
      return parent.get('childrenOfChild');
    }).then(() => {
      assert.deepEqual(
        parent.get('childrenOfChild.content'),
        [childOfChild2, childOfChild3],
        'the hasManyThrough property removes destroyed records'
      )
      return parent.get('childrenOfChildArray');
    }).then(() => {
      assert.deepEqual(
        parent.get('childrenOfChildArray.content'),
        [childOfChild2, childOfChild3],
        'the hasManyThrough property removes destroyed records of the CP array'
      )
    }).then(() => {
      return childOfChild2.destroyRecord();
    }).then(() => {
      return parent.get('childrenOfChild');
    }).then(() => {
      assert.deepEqual(
        parent.get('childrenOfChild.content'),
        [childOfChild3],
        'the hasManyThrough property removes destroyed records taking properly into account duplicates'
      )
      return parent.get('childrenOfChildArray');
    }).then(() => {
      assert.deepEqual(
        parent.get('childrenOfChildArray.content'),
        [childOfChild3],
        'the hasManyThrough property removes destroyed records of the CP array'
      )
    });
  });
});

test('hasManyThroughNonOject on hasMany of several hasMany', function (assert) {
  let store = this.store(),
    child1, child2, parent;
  parent = this.subject();
  Ember.run(() => {
    child1 = store.createRecord('child');
    child2 = store.createRecord('child');
    let arrayOfChildOfChild = ['childOfChild1', 'childOfChild2', 'childOfChild3'];
    parent.get('children').then((children) => {
      child1.set('simpleArray', ['childOfChild1', 'childOfChild2']);
      child2.set('simpleArray', ['childOfChild2', 'childOfChild3']);
      children.pushObjects([child1, child2]);
      return parent.get('simpleArray');
    }).then((res) => {
      assert.deepEqual(
        res,
        arrayOfChildOfChild,
        'the hasManyThroughNonObject property forwards the hasMany of two hasMany children'
      );
      assert.equal(
        res.get('length'),
        3,
        'the hasManyThroughNonObject property removes duplicates from the final array'
      );
    }).then(() => {
        child1.get('simpleArray').removeObject('childOfChild1');
        return parent.get('simpleArray');
    }).then(() => {
      assert.deepEqual(
        parent.get('simpleArray.content'),
        ['childOfChild2', 'childOfChild3'],
        'the hasManyThrough property removes destroyed records'
      )
    });
  });
});

test('concat', function (assert) {
  let store = this.store(),
    child1, child2, parent;
  parent = this.subject();
  Ember.run(() => {
    child1 = store.createRecord('child');
    child2 = store.createRecord('child');
    let arrayOfChildOfChild = ['childOfChild1', 'childOfChild2', 'childOfChild2', 'childOfChild3'];
    parent.get('children').then((children) => {
      child1.set('simpleArray', ['childOfChild1', 'childOfChild2']);
      child2.set('simpleArray', ['childOfChild2', 'childOfChild3']);
      children.pushObjects([child1, child2]);
      return parent.get('concatArray');
    }).then((res) => {
      assert.deepEqual(
        res,
        arrayOfChildOfChild,
        'the concat property forwards the hasMany of two hasMany children'
      );
      assert.equal(
        res.get('length'),
        4,
        'the concat property does not remove duplicates from the final array'
      );
    }).then(() => {
        child1.get('simpleArray').removeObject('childOfChild1');
        return parent.get('simpleArray');
    }).then(() => {
      assert.deepEqual(
        parent.get('simpleArray.content'),
        ['childOfChild2', 'childOfChild3'],
        'the concat property removes destroyed records'
      )
    });
  });
});

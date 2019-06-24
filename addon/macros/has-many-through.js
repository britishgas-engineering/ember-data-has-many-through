import { computed } from '@ember/object';
import RSVP from 'rsvp';
import DS from 'ember-data';
import EmberObject from '@ember/object';

/**
  @method hasManyThrough
  @param hasMany child
  @param hasMany childOfChild
*/

export default function (...args) {
  const childKey = args[0];
  let childOfChildKey = args[1];

  // dont key on `${childKey}.@each.${childOfChildKey}` or it will be run several times
  // BUT implemented that way it wouldn't update when childOfChildKey records are
  // deleted without the observer `notify${childKey.classify()}OnDelete`
  return computed(`${childKey}.@each`, function (key) {
    childOfChildKey = childOfChildKey || key;
    const self = this;
    const observerForChildOfChild = function () {
      if (!self.isDestroyed) {
        self.notifyPropertyChange(key);
      }
    };

    return DS.PromiseArray.create({
      promise: this.get(childKey).then((children) => {
        const all = [];
        const res = [];
        let isBelongsTo;
        //children could be undefined for an API error, for example
        children = children || [];
        children.forEach((child) => {
          // takes into account the case where the hasMany on the child
          // is not a promise (MF.Array for example)
          // or undefined (just a property returning null)
          const childOfChildIsPromise = child && child.get(childOfChildKey).then;
          let prom = childOfChildIsPromise ?
            child.get(childOfChildKey) :
            RSVP.resolve(child.get(childOfChildKey));

          all.pushObject(
            prom.then((childrenOfChild) => {
              if (childrenOfChild) {
                isBelongsTo = !childrenOfChild.toArray;
                res.pushObjects(isBelongsTo ? [childrenOfChild] : childrenOfChild.toArray());
              } else {
                isBelongsTo=true;
              }
            })
          );
        });
        return RSVP.all(all).then(() => {
          children.forEach((child) => {
            // add observer for when a childOfChild is added / destroyed
            if (isBelongsTo) {
              child.removeObserver(`${childOfChildKey}.isDeleted`, self, observerForChildOfChild);
              //child.removeObserver(`${childOfChildKey}.isRejected`, self, observerForRejected);
              //child.addObserver(`${childOfChildKey}.isRejected`, self, observerForRejected);
              child.addObserver(`${childOfChildKey}.isDeleted`, self, observerForChildOfChild);
            } else if (child.get(`${childOfChildKey}.firstObject`) instanceof EmberObject) {
              child.removeObserver(`${childOfChildKey}.@each.isDeleted`, self, observerForChildOfChild);
              //child.removeObserver(`${childOfChildKey}.@each.isRejected`, self, observerForRejected);
              //child.addObserver(`${childOfChildKey}.@each.isRejected`, self, observerForRejected);
              child.addObserver(`${childOfChildKey}.@each.isDeleted`, self, observerForChildOfChild);
            } else {
              child.removeObserver(`${childOfChildKey}.[]`, self, observerForChildOfChild);
              //child.removeObserver(`${childOfChildKey}.@each.isRejected`, self, observerForRejected);
              //child.addObserver(`${childOfChildKey}.@each.isRejected`, self, observerForRejected);
              child.addObserver(`${childOfChildKey}.[]`, self, observerForChildOfChild);
            }
          });
          // remove duplicates
          return res.filter(function (item, pos) {
            return item && res.indexOf(item) === pos
            && (!item.isDeleted || !item.get('isDeleted'))
            && !item.isDestroyed//ED 2.14.10
          });
        }, (res) => {
          children.forEach((child) => {
            if (isBelongsTo) {
              child.removeObserver(`${childOfChildKey}.isRejected`, self, observerForChildOfChild);
              child.addObserver(`${childOfChildKey}.isRejected`, self, observerForChildOfChild);
            } else {
              child.removeObserver(`${childOfChildKey}.@each.isRejected`, self, observerForChildOfChild);
              child.addObserver(`${childOfChildKey}.@each.isRejected`, self, observerForChildOfChild);
            }
          });
          return RSVP.reject(res);
        });
      })
    });
  });
}

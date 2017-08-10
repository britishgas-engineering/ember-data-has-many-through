import Ember from 'ember';
import DS from 'ember-data';
const {computed, RSVP} = Ember;

/**
  @method hasManyThrough
  @param hasMany child
  @param hasMany childOfChild
*/

export default function (...args) {
  let childKey = args[0],
    childOfChildKey = args[1];

  // dont key on `${childKey}.@each.${childOfChildKey}` or it will be run several times
  // BUT implemented that way it wouldn't update when childOfChildKey records are
  // deleted without the observer `notify${childKey.classify()}OnDelete`
  return computed(`${childKey}.@each`, function (key) {
    childOfChildKey = childOfChildKey || key;
    let self = this,
    observerFunction = function () {
      if (!self.isDestroyed) {
        self.notifyPropertyChange(key);
      }
    };

    return DS.PromiseArray.create({
      promise: this.get(childKey).then((children) => {
        let all = [],
          res = [];
        children.forEach((child) => {
          // takes into account the case where the hasMany on the child
          // is not a promise (MF.Array for example)
          let prom = child.get(childOfChildKey).then
            ? child.get(childOfChildKey)
            : RSVP.resolve(child.get(childOfChildKey));

          all.pushObject(
            prom.then((childrenOfChild) => {
              if (childrenOfChild) {
                res.pushObjects(childrenOfChild.toArray ? childrenOfChild.toArray() : [childrenOfChild]);
              }
            })
          );
        });
        return RSVP.all(all).then(() => {
          children.forEach((child) => {
            // add observer for when a childOfChild is added / destroyed
            child.removeObserver(`${childOfChildKey}.@each.isDeleted`, self, observerFunction);
            child.addObserver(`${childOfChildKey}.@each.isDeleted`, self, observerFunction);
          });
          // remove duplicates
          return res.filter(function (item, pos) {
            return res.indexOf(item) === pos
            && (!item.isDeleted || !item.get('isDeleted'));
          });
        });
      })
    });
  });
}

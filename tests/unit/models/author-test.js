import { module } from 'qunit';
import { test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import { all } from 'rsvp';
import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import ArrayProxy from '@ember/array/proxy';
import { reads } from '@ember/object/computed';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';

let memPromise;
let memPromise2;

module('Unit | Model | author', function (hooks) {
  setupTest(hooks);
  test('hasManyThrough on hasMany of one hasMany', function (assert) {
    assert.expect(10);

    let store = this.owner.lookup('service:store'),
      chapter1,
      chapter2,
      book,
      author;
    author = store.createRecord('author', {});
    run(() => {
      chapter1 = store.createRecord('chapter');
      chapter2 = store.createRecord('chapter');
      book = store.createRecord('book');
      return author.get('books').then((books) => {
        return book.get('chapters').then((chapters) => {
          const arrayOfChapter = [chapter1];

          chapters.pushObjects(arrayOfChapter);
          book.get('chaptersArray').pushObjects(arrayOfChapter);
          books.pushObject(book);
          return author
            .get('chapters')
            .then((chapters) => {
              assert.deepEqual(
                chapters,
                arrayOfChapter,
                'the hasManyThrough property forwards the hasMany of one hasMany book'
              );
              assert.deepEqual(
                author.get('chapters.content'),
                arrayOfChapter,
                'the hasManyThrough property is a promiseArray'
              );
              return author.get('chaptersArray');
            })
            .then((chaptersArray) => {
              assert.deepEqual(
                chaptersArray,
                arrayOfChapter,
                'the hasManyThrough property forwards the CP array of one hasMany book'
              );
              assert.deepEqual(
                author.get('chaptersArray.content'),
                arrayOfChapter,
                'the hasManyThrough property is a promiseArray'
              );
              return author.get('chapters');
            })
            .then((chapters) => {
              assert.deepEqual(
                chapters,
                arrayOfChapter,
                'the hasManyThrough property can be aliased to another property name'
              );
              return all([author.get('chapters'), author.get('chaptersArray')]);
            })
            .then(() => {
              const arrayOfChapter = [chapter1, chapter2];
              chapters.pushObjects(arrayOfChapter);
              book.get('chaptersArray').pushObjects(arrayOfChapter);
              books.pushObject(book);
              return author
                .get('chapters')
                .then((chapters) => {
                  assert.deepEqual(
                    chapters,
                    arrayOfChapter,
                    'the hasManyThrough property forwards the hasMany of one hasMany book after adding a record'
                  );
                  assert.deepEqual(
                    author.get('chapters.content'),
                    arrayOfChapter,
                    'the hasManyThrough property is a promiseArray after adding a record'
                  );
                  return author.get('chaptersArray');
                })
                .then((chaptersArray) => {
                  assert.deepEqual(
                    chaptersArray,
                    arrayOfChapter,
                    'the hasManyThrough property forwards the CP array of one hasMany book after adding a record'
                  );
                  assert.deepEqual(
                    author.get('chaptersArray.content'),
                    arrayOfChapter,
                    'the hasManyThrough property is a promiseArray after adding a record'
                  );
                  return author.get('chapters');
                })
                .then((chapters) => {
                  assert.deepEqual(
                    chapters,
                    arrayOfChapter,
                    'the hasManyThrough property can be aliased to another property name after adding a record'
                  );
                });
            });
        });
      });
    });
    return settled();
  });

  test('hasManyThrough on hasMany of one hasMany, promises failing initially', function (assert) {
    assert.expect(4);

    const PromiseArray = ArrayProxy.extend(PromiseProxyMixin, {
      meta: reads('content.meta'),
    });

    const PromiseObject = ObjectProxy.extend(PromiseProxyMixin);

    let store = this.owner.lookup('service:store'),
      book,
      author;
    author = store.createRecord('author', {});
    run(() => {
      book = store.createRecord('book');
      return author
        .get('books')
        .then((books) => {
          books.pushObject(book);
          return author.get('books');
        })
        .then(() => {
          const promise = RSVP.reject();
          memPromise = book.get('chapters.promise');
          book
            .get('chapters')
            .set('promise', PromiseArray.create({ promise }));
          book.set('chapters.isFulfilled', false);
          book.set('chapters.isRejected', true);
          const promise2 = RSVP.reject();
          memPromise2 = book.get('chapter.promise');
          book
            .get('chapter')
            .set('promise', PromiseObject.create({ promise: promise2 }));
          book.set('chapter.isFulfilled', false);
          book.set('chapter.isRejected', true);
          return book.get('chapters');
        })
        .catch(() => {
          return book.get('chapter');
        })
        .catch(() => {
          return author.get('chapters');
        })
        .catch(() => {
          assert.ok(
            true,
            'hasManyThrough updates to rejected when one childofchild hasMany promise rejects'
          );
          return author.get('chaptersBelongsTo');
        })
        .catch(() => {
          assert.ok(
            true,
            'hasManyThrough updates to rejected when one childofchild belongsTo promise rejects'
          );
          book.get('chapters').set('promise', memPromise);
          book.get('chapter').set('promise', memPromise2);
          book.set('chapters.isFulfilled', true);
          book.set('chapter.isFulfilled', true);
          book.set('chapters.isRejected', false);
          book.set('chapter.isRejected', false);
          return [author.get('chapters'), author.get('chapter')];
        })
        .then(() => {
          assert.ok(
            true,
            'hasManyThrough updates to fulfilled when one childofchild hasMany promise goes from reject to fulfill'
          );
          assert.ok(
            true,
            'hasManyThrough updates to fulfilled when one childofchild belongsTo promise goes from reject to fulfill'
          );
        });
    });
    return settled();
  });

  test('hasManyThrough on hasMany of several hasMany', function (assert) {
    assert.expect(8);

    let store = this.owner.lookup('service:store'),
      book1,
      book2,
      chapter1,
      chapter2,
      chapter3,
      author;
    author = store.createRecord('author', {});
    run(() => {
      chapter1 = store.createRecord('chapter');
      chapter2 = store.createRecord('chapter');
      chapter3 = store.createRecord('chapter');
      book1 = store.createRecord('book');
      book2 = store.createRecord('book');
      let arrayOfChapter = [chapter1, chapter2, chapter3];
      return author
        .get('books')
        .then((books) => {
          let prom = [
            book1.get('chapters').then((chapters) => {
              chapters.pushObjects([chapter1, chapter2]);
              book1.get('chaptersArray').pushObjects([chapter1, chapter2]);
            }),
            book2.get('chapters').then((chapters) => {
              chapters.pushObjects([chapter2, chapter3]);
              book2.get('chaptersArray').pushObjects([chapter2, chapter3]);
            }),
          ];
          return all(prom).then(() => {
            books.pushObjects([book1, book2]);
            return author.get('chapters');
          });
        })
        .then((res) => {
          assert.deepEqual(
            res,
            arrayOfChapter,
            'the hasManyThrough property forwards the hasMany of two hasMany books'
          );
          assert.deepEqual(
            res.get('length'),
            3,
            'the hasManyThrough property removes duplicates from the final array'
          );
          return author.get('chaptersArray');
        })
        .then((res) => {
          assert.deepEqual(
            res,
            arrayOfChapter,
            'the hasManyThrough property forwards the CP array of two hasMany books'
          );
          assert.deepEqual(
            res.get('length'),
            3,
            'the hasManyThrough property removes duplicates from the final array'
          );
          return chapter1.destroyRecord();
        })
        .then(() => {
          return author.get('chapters');
        })
        .then(() => {
          assert.deepEqual(
            author.get('chapters.content'),
            [chapter2, chapter3],
            'the hasManyThrough property removes destroyed records'
          );
          return author.get('chaptersArray');
        })
        .then(() => {
          assert.deepEqual(
            author.get('chaptersArray.content'),
            [chapter2, chapter3],
            'the hasManyThrough property removes destroyed records of the CP array'
          );
          return chapter2.destroyRecord();
        })
        .then(() => {
          return author.get('chapters');
        })
        .then(() => {
          assert.deepEqual(
            author.get('chapters.content'),
            [chapter3],
            'the hasManyThrough property removes destroyed records taking properly into account duplicates'
          );
          return author.get('chaptersArray');
        })
        .then(() => {
          assert.deepEqual(
            author.get('chaptersArray.content'),
            [chapter3],
            'the hasManyThrough property removes destroyed records of the CP array'
          );
          return true;
        });
    });
    return settled();
  });

  test('hasManyThrough on hasMany of one or zero belongsTo', function (assert) {
    assert.expect(3);

    let store = this.owner.lookup('service:store'),
      book1,
      book2,
      chapter1,
      chapter2,
      author;
    author = store.createRecord('author', {});
    run(() => {
      chapter1 = store.createRecord('chapter');
      chapter2 = store.createRecord('chapter');
      book1 = store.createRecord('book');
      book2 = store.createRecord('book');
      return author
        .get('books')
        .then((books) => {
          book1.set('chapter', chapter1);
          book2.set('chapter', chapter2);
          books.pushObjects([book1, book2]);
          return author.get('chaptersBelongsTo');
        })
        .then((res) => {
          assert.deepEqual(
            res,
            [chapter1, chapter2],
            'the hasManyThrough property forwards the hasMany of belongsTo chapter'
          );
          return chapter1.destroyRecord();
        })
        .then(() => {
          return author.get('chaptersBelongsTo');
        })
        .then(() => {
          assert.deepEqual(
            author.get('chaptersBelongsTo.content'),
            [chapter2],
            'the hasManyThrough property removes destroyed records'
          );
          return chapter2.destroyRecord();
        })
        .then(() => {
          return author.get('chaptersBelongsTo');
        })
        .then(() => {
          assert.deepEqual(
            author.get('chaptersBelongsTo.content'),
            [],
            'the hasManyThrough property removes destroyed records'
          );
          return true;
        });
    });
    return settled();
  });

  test('hasManyThrough on hasMany of several non promise hasMany', async function (assert) {
    assert.expect(3);

    let store = this.owner.lookup('service:store'),
      book1,
      book2,
      author;
    author = store.createRecord('author', {});
    run(() => {
      book1 = store.createRecord('book');
      book2 = store.createRecord('book');
      let arrayOfChapter = ['chapter1', 'chapter2', 'chapter3'];
      author
        .get('books')
        .then((books) => {
          book1.set('simpleArray', ['chapter1', 'chapter2']);
          book2.set('simpleArray', ['chapter2', 'chapter3']);
          books.pushObjects([book1, book2]);
          return author.get('simpleArray');
        })
        .then((res) => {
          assert.deepEqual(
            res,
            arrayOfChapter,
            'the hasManyThrough property forwards the hasMany of two hasMany books'
          );
          assert.deepEqual(
            res.get('length'),
            3,
            'the hasManyThrough property removes duplicates from the final array'
          );
        })
        .then(async () => {
          book1.get('simpleArray').removeObject('chapter1');

          await settled();

          return author.get('simpleArray');
        })
        .then(() => {
          assert.deepEqual(
            author.get('simpleArray.content'),
            ['chapter2', 'chapter3'],
            'the hasManyThrough property removes destroyed records'
          );
        });
    });
  });

  test('concat', function (assert) {
    assert.expect(3);

    let store = this.owner.lookup('service:store'),
      chapter1,
      chapter2,
      author;
    author = store.createRecord('author', {});
    run(() => {
      chapter1 = store.createRecord('book');
      chapter2 = store.createRecord('book');
      let arrayOfChapter = ['chapter1', 'chapter2', 'chapter2', 'chapter3'];
      author
        .get('books')
        .then((books) => {
          chapter1.set('simpleArray', ['chapter1', 'chapter2']);
          chapter2.set('simpleArray', ['chapter2', 'chapter3']);
          books.pushObjects([chapter1, chapter2]);
          return author.get('concatArray');
        })
        .then((res) => {
          assert.deepEqual(
            res,
            arrayOfChapter,
            'the concat property forwards the hasMany of two hasMany books'
          );
          assert.deepEqual(
            res.get('length'),
            4,
            'the concat property does not remove duplicates from the final array'
          );
        })
        .then(() => {
          chapter1.get('simpleArray').removeObject('chapter1');
          return author.get('simpleArray');
        })
        .then(() => {
          assert.deepEqual(
            author.get('simpleArray.content'),
            ['chapter2', 'chapter3'],
            'the concat property removes destroyed records'
          );
        });
    });
    return settled();
  });
});

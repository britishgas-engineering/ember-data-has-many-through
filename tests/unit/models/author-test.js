import { all } from 'rsvp';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | author', function(hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    var model = run(() => this.owner.lookup('service:store').createRecord('author'));
    assert.ok(!!model);
  });

  test('hasManyThrough on hasMany of one hasMany', function (assert) {
    let store = this.owner.lookup('service:store'),
      chapter1, chapter2, book, author;
    author = run(() => this.owner.lookup('service:store').createRecord('author'));
    run(() => {
      chapter1 = store.createRecord('chapter');
      chapter2 = store.createRecord('chapter');
      book = store.createRecord('book');
      author.get('books').then((books) => {
        book.get('chapters').then((chapters) => {
          let arrayOfChapter = [chapter1];

          chapters.pushObjects(arrayOfChapter);
          book.get('chaptersArray').pushObjects(arrayOfChapter);
          books.pushObject(book);
          author.get('chapters').then((res) => {
            assert.deepEqual(
              res,
              arrayOfChapter,
              'the hasManyThrough property forwards the hasMany of one hasMany book'
            );
            assert.deepEqual(
              author.get('chapters.content'),
              arrayOfChapter,
              'the hasManyThrough property is a promiseArray'
            );
          });
          author.get('chaptersArray').then((res) => {
            assert.deepEqual(
              res,
              arrayOfChapter,
              'the hasManyThrough property forwards the CP array of one hasMany book'
            );
            assert.deepEqual(
              author.get('chaptersArray.content'),
              arrayOfChapter,
              'the hasManyThrough property is a promiseArray'
            );
          });
          author.get('chapters').then((res) => {
            assert.deepEqual(
              res,
              arrayOfChapter,
              'the hasManyThrough property can be aliased to another property name'
            );
          });
          all([
            author.get('chapters'),
            author.get('chaptersArray'),
            author.get('chapters')
          ]).then(() => {
            arrayOfChapter = [chapter1, chapter2];
            chapters.pushObjects(arrayOfChapter);
            book.get('chaptersArray').pushObjects(arrayOfChapter);
            books.pushObject(book);
            author.get('chapters').then((res) => {
              assert.deepEqual(
                res,
                arrayOfChapter,
                'the hasManyThrough property forwards the hasMany of one hasMany book after adding a record'
              );
              assert.deepEqual(
                author.get('chapters.content'),
                arrayOfChapter,
                'the hasManyThrough property is a promiseArray after adding a record'
              );
            });
            author.get('chaptersArray').then((res) => {
              assert.deepEqual(
                res,
                arrayOfChapter,
                'the hasManyThrough property forwards the CP array of one hasMany book after adding a record'
              );
              assert.deepEqual(
                author.get('chaptersArray.content'),
                arrayOfChapter,
                'the hasManyThrough property is a promiseArray after adding a record'
              );
            });
            author.get('chapters').then((res) => {
              assert.deepEqual(
                res,
                arrayOfChapter,
                'the hasManyThrough property can be aliased to another property name after adding a record'
              );
            });
          });
        });
      });
    });
  });

  test('hasManyThrough on hasMany of several hasMany', function (assert) {
    let store = this.owner.lookup('service:store'),
      book1, book2, chapter1, chapter2, chapter3, author;
    author = run(() => this.owner.lookup('service:store').createRecord('author'));
    run(() => {
      chapter1 = store.createRecord('chapter');
      chapter2 = store.createRecord('chapter');
      chapter3 = store.createRecord('chapter');
      book1 = store.createRecord('book');
      book2 = store.createRecord('book');
      let arrayOfChapter = [chapter1, chapter2, chapter3];
      author.get('books').then((books) => {
        let prom = [
          book1.get('chapters').then((chapters) => {
            chapters.pushObjects([chapter1, chapter2]);
            book1.get('chaptersArray').pushObjects([chapter1, chapter2]);
          }),
          book2.get('chapters').then((chapters) => {
            chapters.pushObjects([chapter2, chapter3]);
            book2.get('chaptersArray').pushObjects([chapter2, chapter3]);
          })
        ];
        return all(prom).then(() => {
          books.pushObjects([book1, book2]);
          return author.get('chapters');
        });
      }).then((res) => {
        assert.deepEqual(
          res,
          arrayOfChapter,
          'the hasManyThrough property forwards the hasMany of two hasMany books'
        );
        assert.equal(
          res.get('length'),
          3,
          'the hasManyThrough property removes duplicates from the final array'
        );
        return author.get('chaptersArray');
      }).then((res) => {
        assert.deepEqual(
          res,
          arrayOfChapter,
          'the hasManyThrough property forwards the CP array of two hasMany books'
        );
        assert.equal(
          res.get('length'),
          3,
          'the hasManyThrough property removes duplicates from the final array'
        );
      }).then(() => {
        return chapter1.destroyRecord();
      }).then(() => {
        return author.get('chapters');
      }).then(() => {
        assert.deepEqual(
          author.get('chapters.content'),
          [chapter2, chapter3],
          'the hasManyThrough property removes destroyed records'
        )
        return author.get('chaptersArray');
      }).then(() => {
        assert.deepEqual(
          author.get('chaptersArray.content'),
          [chapter2, chapter3],
          'the hasManyThrough property removes destroyed records of the CP array'
        )
      }).then(() => {
        return chapter2.destroyRecord();
      }).then(() => {
        return author.get('chapters');
      }).then(() => {
        assert.deepEqual(
          author.get('chapters.content'),
          [chapter3],
          'the hasManyThrough property removes destroyed records taking properly into account duplicates'
        )
        return author.get('chaptersArray');
      }).then(() => {
        assert.deepEqual(
          author.get('chaptersArray.content'),
          [chapter3],
          'the hasManyThrough property removes destroyed records of the CP array'
        )
      });
    });
  });

  test('hasManyThrough on hasMany of one or zero belongsTo', function (assert) {
    let store = this.owner.lookup('service:store'),
      book1, book2, chapter1, chapter2, author;
    author = run(() => this.owner.lookup('service:store').createRecord('author'));
    run(() => {
      chapter1 = store.createRecord('chapter');
      chapter2 = store.createRecord('chapter');
      book1 = store.createRecord('book');
      book2 = store.createRecord('book');
      author.get('books').then((books) => {
        book1.set('chapter', chapter1);
        book2.set('chapter', chapter2);
        books.pushObjects([book1, book2]);
        return author.get('chaptersBelongsTo');
      }).then((res) => {
        assert.deepEqual(
          res,
          [chapter1, chapter2],
          'the hasManyThrough property forwards the hasMany of belongsTo chapter'
        );
        return true;
      }).then(() => {
        return chapter1.destroyRecord();
      }).then(() => {
        return author.get('chaptersBelongsTo');
      }).then(() => {
        assert.deepEqual(
          author.get('chaptersBelongsTo.content'),
          [chapter2],
          'the hasManyThrough property removes destroyed records'
        )
        return true;
      }).then(() => {
        return chapter2.destroyRecord();
      }).then(() => {
        return author.get('chaptersBelongsTo');
      }).then(() => {
        assert.deepEqual(
          author.get('chaptersBelongsTo.content'),
          [],
          'the hasManyThrough property removes destroyed records'
        )
        return true;
      });
    });
  });

  test('hasManyThroughNonOject on hasMany of several hasMany', function (assert) {
    let store = this.owner.lookup('service:store'),
      book1, book2, author;
    author = run(() => this.owner.lookup('service:store').createRecord('author'));
    run(() => {
      book1 = store.createRecord('book');
      book2 = store.createRecord('book');
      let arrayOfChapter = ['chapter1', 'chapter2', 'chapter3'];
      author.get('books').then((books) => {
        book1.set('simpleArray', ['chapter1', 'chapter2']);
        book2.set('simpleArray', ['chapter2', 'chapter3']);
        books.pushObjects([book1, book2]);
        return author.get('simpleArray');
      }).then((res) => {
        assert.deepEqual(
          res,
          arrayOfChapter,
          'the hasManyThroughNonObject property forwards the hasMany of two hasMany books'
        );
        assert.equal(
          res.get('length'),
          3,
          'the hasManyThroughNonObject property removes duplicates from the final array'
        );
      }).then(() => {
          book1.get('simpleArray').removeObject('chapter1');
          return author.get('simpleArray');
      }).then(() => {
        assert.deepEqual(
          author.get('simpleArray.content'),
          ['chapter2', 'chapter3'],
          'the hasManyThrough property removes destroyed records'
        )
      });
    });
  });

  test('concat', function (assert) {
    let store = this.owner.lookup('service:store'),
      chapter1, chapter2, author;
    author = run(() => this.owner.lookup('service:store').createRecord('author'));
    run(() => {
      chapter1 = store.createRecord('book');
      chapter2 = store.createRecord('book');
      let arrayOfChapter = ['chapter1', 'chapter2', 'chapter2', 'chapter3'];
      author.get('books').then((books) => {
        chapter1.set('simpleArray', ['chapter1', 'chapter2']);
        chapter2.set('simpleArray', ['chapter2', 'chapter3']);
        books.pushObjects([chapter1, chapter2]);
        return author.get('concatArray');
      }).then((res) => {
        assert.deepEqual(
          res,
          arrayOfChapter,
          'the concat property forwards the hasMany of two hasMany books'
        );
        assert.equal(
          res.get('length'),
          4,
          'the concat property does not remove duplicates from the final array'
        );
      }).then(() => {
          chapter1.get('simpleArray').removeObject('chapter1');
          return author.get('simpleArray');
      }).then(() => {
        assert.deepEqual(
          author.get('simpleArray.content'),
          ['chapter2', 'chapter3'],
          'the concat property removes destroyed records'
        )
      });
    });
  });
});

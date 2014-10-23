var eventcollector_fn = require('../');


module.exports = {
  'not positive arguments throw': function(test) {
    test.throws(function() {
      eventcollector_fn(0);
    });

    test.throws(function() {
      eventcollector_fn(1.123);
    });

    test.throws(function() {
      eventcollector_fn(-2);
    });

    test.throws(function() {
      eventcollector_fn('foo');
    });

    test.throws(function() {
      eventcollector_fn(true);
    });

    test.done();
  },

  '1 event': function(test) {
    test.expect(4);
    var ec = eventcollector_fn(1);

    ec.on('done', function(fired, total, data) {
      test.equal(1, fired);
      test.equal(1, total);
      test.equal(data, 'event1');
    });

    ec.on('alldone', function(total) {
      test.equal(1, total);
      test.done();
    });

    process.nextTick(function() {
      ec.done('event1');
    });
  },

  '2 events': function(test) {
    test.expect(7);
    var ec = eventcollector_fn(2);

    ec.once('done', function(fired, total, data) {
      test.equal(1, fired);
      test.equal(2, total);
      test.equal(data, 'event1');

      ec.once('done', function(fired, total, data) {
        test.equal(2, fired);
        test.equal(2, total);
        test.equal(data, 'event2');
      });
    });

    ec.on('alldone', function(total) {
      test.equal(2, total);
      test.done();
    });

    process.nextTick(function() {
      ec.done('event1');
    });

    process.nextTick(function() {
      ec.done('event2');
    });
  },

  'timeout expires': function(test) {
    test.expect(2);
    var ec = eventcollector_fn(1, 50);

    ec.on('timeout', function(fired, total) {
      test.equal(0, fired);
      test.equal(1, total);
      test.done();
    });
  },

  'don\'t emit after destroy': function(test) {
    test.expect(0);
    var ec = eventcollector_fn(1, 100);

    ec.once('done', function() {
      test.ok(false);
    });

    ec.on('timeout', function() {
      test.ok(false);
    });

    process.nextTick(function() {
      ec.destroy();
    });

    setTimeout(function() {
      ec.done('event1');
    }, 50);

    setTimeout(function() {
      test.done();
    }, 150);
  }
};

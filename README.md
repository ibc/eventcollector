# eventcollector

Node/JavaScript library for collecting multiple events into a single one.

Sometimes one needs to wait for various events to be emitted before doing something else. There are many solutions for this subject but most of them require passing the event callbacks to that library/module. While this is good in certain cases it is not so nice when one wants to code events within a prototype method of a custom class in a OO fashion.

**eventcollector** provides a different approach in which the user just needs to invoke a library method within his callback definitions.

## Install in Node

```bash
$ npm install eventcollector
```

## Install with Bower

```bash
$ bower install eventcollector
```

## Manual installation for Browser apps

Take the browserified file at `build/eventcollector.bundle.js` and include it in your HTML:

```html
<script src='js/eventcollector.bundle.js'></script>
```

The browserified file exports the `window.eventcollector` function.


## Usage

### In Node

```js
// We expect 2 events.
var ec = require('eventcollector')(2);

ec.on('done', function(fired, total, data) {
  console.log('event %d of %d emitted', fired, total);
  console.log('event description:', data);
});

ec.on('alldone', function(total) {
  console.log('all the required %d events have been emitted', total);
  // Continue your work here.
});

// Event #1.
process.nextTick(function() {
  // Notify the eventcollector.
  ec.done('event #1');
});

// Event #2.
setTimeout(function() {
  // Notify the eventcollector.
  ec.done('event #2');
}, 1000);
```

produces:

```
event 1 of 2 emitted
event description: event #1

... (1 second) ...

event 2 of 2 emitted
event description: event #2
all the required 2 events have been emitted
```

### In the Browser

```html
<script src='js/eventcollector.bundle.js'></script>

<script>
  var ec = window.eventcollector(2);

  ec.on('alldone', function(total) {
    // ...
  });
</script>
```


## Documentation

### Function `eventcollector(total, timeout)`

In Node:
```js
var eventcollector = require('eventcollector');

var ec = eventcollector(total, timeout);
```

In the Browser:
```js
var ec = window.eventcollector(total, timeout);
```

Returns an instance of `EventCollector`.
* param `{Number}` **total**: Number of events expected.
* param `{Number}` **timeout** *(optional)*: Emit 'timeout' if the required events have not fired before this value (in ms).

### Class `EventCollector`

The main class. It is an [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

#### Method `done(data)`

Tell the `EventCollector` instance that an event has been emitted.
* param `{Object}` **data** *(optional)*: Custom data about the emitted event.

#### Method `destroy()`

Destroy the `EventCollector` instance. No more events will be emitted.

#### Event 'done'

Emitted for each fired event (this is, after each call to `done()`).
* param `{Number}` **fired**: Number of fired events.
* param `{Number}` **total**: Total number of required events to fire.
* param `{Object}` **data**: The same custom data as provided in the `done()` method.

#### Event 'alldone'

Emitted when all the required events have fired.
* param `{Number}` **total**: Total number of required events to fire.

#### Event 'timeout'

Emitted if the given timeout expires before all the required events have fired.
* param `{Number}` **fired**: Number of fired events.
* param `{Number}` **total**: Total number of required events to fire.

*IMPORTANT:* New 'done' events after the timeout will still be emitted unless the user calls `destroy()`.


## Release History

### 0.1.3 (2014-10-24)
* Remove 'error' event by ensuring `done()` is ignored once all the required events have been emitted.

### 0.1.2 (2014-10-23)
* Complete documentation.

### 0.1.1 (2014-10-23)
* Added a browserified file for using the library into Web applications.
* Register **eventcollector** as a [Bower](http://bower.io/) package.

### 0.1.0 (2014-10-23)
* First release.

## License

Copyright (c) 2014 Iñaki Baz Castillo
Licensed under the MIT license.

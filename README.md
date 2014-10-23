# eventcollector

Node/JavaScript library for collecting multiple events into a single one.

Sometimes one needs to wait for various events to be emitted before doing something else. There are many solutions for this subject but most of them require passing the event callbacks to that library/module. While this is good in certain cases it is not so nice when one wants to code events within a prototype method of a custom class in a OO fashion.

**eventcollector** provides a different approach in which the user just needs to invoke a library method within his callback definitions.

## Install in Node

`npm install eventcollector`

## Usage

```
// We expect 2 events.
var eventcollector = require('eventcollector')(2);

eventcollector.on('done', function(fired, total, data) {
  console.log('event %d of %d emitted', fired, total);
  console.log('event description:', data);
});

eventcollector.on('alldone', function(total) {
  console.log('all the required %d events have been emitted', total);
  // Continue your work here.
});

// Event #1.
process.nextTick(function() {
  // Notify the eventcollector.
  eventcollector.done('event #1');
});

// Event #2.
setTimeout(function() {
  // Notify the eventcollector.
  eventcollector.done('event #2');
}, 1000);
```

produces:

```
event 1 of 2 emitted
event description: event #1
... (1 second)
event 2 of 2 emitted
event description: event #2
all the required 2 events have been emitted
```


## Documentation

### `var eventcollector = require(eventcollector)(total, timeout)`

Returns an instance of `EventCollector`.
* param `total`: Number of events expected.
* param `timeout` (optional): Emit 'timeout' if the required events have not fired before this value (in ms).

### `eventcollector.done(data)`

Tell the `EventCollector` instance that an event has been emitted.
* param `data` (optional): Custom data about the emitted event.

### `eventcollector.destroy`

Destroy the `EventCollector` instance. No more events will be emitted.

### Event 'done'

Emitted for each fired event (this is, after each call to `done()`).
* param `fired`: Number of fired events.
* param `total`: Total number of required events to fire.
* param `data`: The same custom data as provided in the `done()` method.

### Event 'alldone'

Emitted when all the required events have fired.
* param `total`: Total number of required events to fire.

### Event 'timeout'

Emitted if the given timeout expires before all the required events have fired.
* param `fired`: Number of fired events.
* param `total`: Total number of required events to fire.

*IMPORTANT:* new 'done' events after the timeout will still be emitted unless the user calls `destroy()`.

### Event 'error'

Emitted in case of error. For example, when expecting 2 events and calling `done()` more than 2 times.
* param `error`: `Error` instance.


## Release History

### 0.1.0 (2014-10-23)

* First release.


## License
Copyright (c) 2014 Iñaki Baz Castillo
Licensed under the MIT license.

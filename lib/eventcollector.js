/**
 * Dependencies.
 */

var events = require('events');
var util = require('util');


/**
 * Emitted for each fired event. May be useful to display a progress bar.
 *
 * @event done
 * @param {Number} fired  Number of fired events.
 * @param {Number} total  Total number of required events to fire.
 * @param {Object} [data] Optional data about the fired event.
 */

var EVENT_DONE = 'done';


/**
 * Emitted when all the required events have fired.
 *
 * @event alldone
 * @param {Number} total  Number of required events to fire.
 */

var EVENT_ALLDONE = 'alldone';


/**
 * Emitted if the given timeout expires before all the required events have
 * fired.
 *
 * @event timeout
 * @param {Number} fired  Number of fired events.
 * @param {Number} total  Total number of required events to fire.
 */

var EVENT_TIMEOUT = 'timeout';


/**
 * Emitted in case of error. For example, when expecting 2 events and calling
 * `done()` more than 2 times.
 *
 * @event error
 * @param {Error} error
 */

var EVENT_ERROR = 'error';


function isPositiveInteger(x) {
  return (typeof x === 'number') && (x % 1 === 0) && (x > 0);
}


/**
 * EventCollector class.
 *
 * @class EventCollector
 * @constructor
 * @param {Number} total  Number of events that must fire.
 */

var EventCollector = function(total, timeout) {
  events.EventEmitter.call(this);

  if (! isPositiveInteger(total)) {
    throw new Error('`total` must be a positive integer');
  }

  if (timeout && ! isPositiveInteger(timeout)) {
    throw new Error('`timeout` must be a positive integer');
  }

  this.destroyed = false;
  this.total = total;
	this.fired = 0;
  if (timeout) {
    this.timer = setTimeout(function() {
      this.onTimeout();
    }.bind(this), timeout);
  }
};

util.inherits(EventCollector, events.EventEmitter);


/**
 * Tell the EventCollector that a required event has been emitted.
 *
 * @method done
 * @param {Object} [data]  Optional data about the fired event.
 * @chainable
 */

EventCollector.prototype.done = function(data) {
  if (this.destroyed) { return; }

  this.fired++;

  if (this.fired > this.total) {
    this.emit(EVENT_ERROR, '`done` called more times than required');
  }

  this.emit(EVENT_DONE, this.fired, this.total, data);

  if (this.fired === this.total) {
    clearTimeout(this.timer);
    this.emit(EVENT_ALLDONE, this.total);
  }

  return this;
};


/**
 * Destroy the EventCollector. No more events will be emitted.
 *
 * @method destroy
 */

EventCollector.prototype.destroy = function() {
  this.destroyed = true;

  clearTimeout(this.timer);
};


/**
 * Timeout expired.
 *
 * @private
 * @method onTimeout
 */

EventCollector.prototype.onTimeout = function() {
  if (this.destroyed) { return; }

  this.emit(EVENT_TIMEOUT, this.fired, this.total);
};


/**
 * Export a function returning an instance of EventCollector.
 *
 *     var eventcollector = require('eventcollector')(2, 5000);
 */

module.exports = function(total, timeout) {
  return new EventCollector(total, timeout);
};

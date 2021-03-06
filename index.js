'use strict';

var slice = Array.prototype.slice;
var mediator = require('nk-mediator');
var _ = require('vue').util;
var bind = require('component-bind');

module.exports = {
  created: function() {
    this._pubsubList = Object.create(null);

    var events = this.$options.mediator;
    var methods = this.$options.methods;

    if (events) {
      Object.keys(events).forEach(function(event) {
        var callback = events[event];
        var type = typeof callback;

        if (type === 'function') {
          this.sub(event, bind(this, callback));
          return;
        }

        if (type === 'string') {
          var method = methods && methods[callback];

          if (method) {
            this.sub(event, bind(this, method));
            return;
          }

          _.warn(
            'Unknown method: "' + callback + '" when '
            + 'registering callback for mediator'
            + ': "' + event + '".'
          );
          return;
        }
      }, this);
    }
  },

  beforeDestroy: function() {
    this.unsubAll();
  },

  methods: {
    pub: function() {
      mediator.pub.apply(mediator, arguments);
    },

    sub: function(event, callback) {
      if (!this._pubsubList[event]) {
        this._pubsubList[event] = [];
      }

      this._pubsubList[event].push(callback);

      mediator.sub.apply(mediator, arguments);
    },

    subOnce: function() {
      var self = this;
      var args = slice.call(arguments);
      var fn = args[1];
      args[1] = callback;

      this.sub.apply(this, args);

      function callback() {
        fn.apply(this, arguments);
        self.unsub.apply(self, args);
      }
    },

    unsub: function(event, callback) {
      mediator.unsub.apply(mediator, arguments);

      var callbacks = this._pubsubList[event];
      if (!callbacks) return;

      if (arguments.length === 1) {
        delete this._pubsubList[event];
        return;
      }

      callbacks.forEach(function(cb, index) {
        if (callback === cb) {
          callbacks.splice(index, 1);
          return false;
        }
      });
    },

    unsubAll: function() {
      var list = this._pubsubList;
      Object.keys(list).forEach(function(event) {
        list[event].forEach(function(cb) {
          mediator.unsub(event, cb);
        });
      });

      this._pubsubList = Object.create(null);
    }
  }
};

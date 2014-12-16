/*global describe, it */
'use strict';

var assert = require('assert');
var mediatorMixin = require('vue-mediator-mixin');
var mediator = require('nk-mediator');
var Vue = require('vue');

describe('vue-mediator-mixin', function() {
  it('should subscribe', function() {
    var View = Vue.extend({
      mixins: [mediatorMixin],
      created: function() {
        this.numCalls = 0;
        this.sub('test', function() {
          this.numCalls++;
        }.bind(this));
      }
    });

    var v = new View();
    mediator.pub('test');
    mediator.pub('test');

    assert(v.numCalls === 2);
  });

  it('should subscribe once', function() {
    var View = Vue.extend({
      mixins: [mediatorMixin],
      created: function() {
        this.numCalls = 0;
        this.subOnce('test', function() {
          this.numCalls++;
        }.bind(this));
      }
    });

    var v = new View();
    mediator.pub('test');
    mediator.pub('test');

    assert(v.numCalls, 1);
  });

  it('should publish', function() {
    var View = Vue.extend({
      mixins: [mediatorMixin],
      created: function() {
        this.pub('test', 'foo');
      }
    });

    var called;
    mediator.sub('test', function(value) {
      called = value;
    });

    new View();

    assert(called === 'foo');
  });

  it('should unsubscribe', function() {
    var View = Vue.extend({
      mixins: [mediatorMixin],
      created: function() {
        this.numCalls = 0;
        this.sub('test', function() {
          this.unsub();
          this.numCalls++;
        }.bind(this));
      }
    });

    var v = new View();
    mediator.pub('test');
    mediator.pub('test');

    assert(v.numCalls === 1);
  });

  it('should subscribe via vm options (function)', function() {
    var View = Vue.extend({
      mixins: [mediatorMixin],
      data: function() {
        return {
          called: false
        };
      },
      mediator: {
        'test': function() {
          this.called = true;
        }
      }
    });

    var v = new View();
    mediator.pub('test');
    mediator.pub('test');

    assert(v.called === true);
  });

  it('should subscribe via vm options (string)', function() {
    var View = Vue.extend({
      mixins: [mediatorMixin],
      data: function() {
        return {
          called: false
        };
      },
      mediator: {
        'test': 'testCallback'
      },
      methods: {
        testCallback: function() {
          this.called = true;
        }
      }
    });

    var v = new View();
    mediator.pub('test');

    assert(v.called === true);
  });

  it('should unsuball when the vm is destroyed', function() {
    var numCallsOpt = 0;
    var numCallsSub = 0;

    var View = Vue.extend({
      mixins: [mediatorMixin],
      mediator: {
        'test': 'testCallback'
      },
      created: function() {
        this.sub('test', function() {
          numCallsSub++;
        });
      },
      methods: {
        testCallback: function() {
          numCallsOpt++;
        }
      }
    });

    var v = new View();
    mediator.pub('test');
    v.$destroy();
    mediator.pub('test');

    assert(numCallsOpt === 1);
    assert(numCallsSub === 1);
  });
});

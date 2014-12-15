# vue-mediator-mixin

[Vue.js](https://github.com/yyx990803/vue/) wrapper for 
[nk-mediator](https://github.com/nk-components/mediator).

## Install

With [npm](http://npmjs.org) do:

```bash
$ npm install vue-mediator-mixin --save-dev
```

## Usage

```js
var Vue = require('vue');
var mediatorMixin = require('vue-mediator-mixin');

var Component = Vue.extend({
  mixins: [mediatorMixin],
  ready: function() {
    this.sub('channel:type', this._onEvent);
  },

  methods: {
    _onEvent: function() {
      console.log('channel:type fired!');
    }
  }
});

module.exports = Header;
```

Like Vue's [`events`](http://vuejs.org/api/options.html#events), you can 
subscribe to mediator's events using vm options:

```js
var Vue = require('vue');
var mediatorMixin = require('vue-mediator-mixin');

var Component = Vue.extend({
  mixins: [mediatorMixin],
  mediator: {
    'channel:type': '_onEvent',
    'foo:bar': function() {
    }
  },

  methods: {
    _onEvent: function() {
      console.log('channel:type fired!');
    }
  }
});

module.exports = Header;
```

## API

### `.pub(eventName, data...)`

### `.sub(eventName, callback)`

### `.subOnce(eventName, callback)`

### `.unsub(eventName, callback [optional])`

### `.unsubAll()`

## License

MIT

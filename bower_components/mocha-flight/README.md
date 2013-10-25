# mocha-flight [![Build Status](https://travis-ci.org/flightjs/mocha-flight.png?branch=master)](https://travis-ci.org/flightjs/mocha-flight)

Extensions to the Mocha test framework for use with [Flight](https://github.com/flightjs/flight)

## Installation

We recommend that you use [Bower](http://bower.io/):

```bash
bower install --save-dev mocha-flight
```

Alternatively, you can include
[mocha-flight.js](https://raw.github.com/flightjs/mocha-flight/master/lib/mocha-flight.js)
in your app and load it in your test runner.

N.B. mocha-flight depends on [Mocha](https://github.com/visionmedia/mocha)

## Usage

These examples use the [chai.js](http://chaijs.com/) assertion library.

### Components

```javascript
describeComponent('path/to/component', function () {
  beforeEach(function () {
    setupComponent();
  });

  it('should do x', function () {
    // a component instance is now accessible as `this.component`
    // the component root node is attached to the DOM
    // the component root node is also available as this.$node
  });
});
```

### Mixins

```javascript
describeMixin('path/to/mixin', function () {
  // initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
  });

  it('should do x', function () {
    expect(this.component.doSomething()).to.equal(expected);
  });
});
```

### Event spy

You will need to use a library like [sinon.js](https://github.com/cjohansen/Sinon.JS).

### setupComponent

```javascript
setupComponent(optionalFixture, optionalOptions);
```

Calling `setupComponent` twice will create an instance, tear it down and create a new one.

#### HTML Fixtures

```javascript
describeComponent('ui/twitter_profile', function () {
  // is the component attached to the fixture?
  it('this.component.$node has class "foo"', function () {
    setupComponent('<span class="foo">Test</span>');
    expect(this.component.$node.find('span').hasClass('foo')).to.be.ok();
  });
});
```

#### Component Options

```javascript
describeComponent('data/twitter_profile', function() {
  // is the option set correctly?
  it('this.component.attr.baseUrl is set', function() {
    setupComponent({
      baseUrl: 'http://twitter.com/1.1/'
    });
    expect(this.component.attr.baseUrl).to.equal('http://twitter.com/1.1/');
  });
});
```

## Teardown

Components are automatically torn down after each test.

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to review
the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

## License

Copyright (c) 2013 Naoya Inada <naoina@kuune.org>

Licensed under the MIT License

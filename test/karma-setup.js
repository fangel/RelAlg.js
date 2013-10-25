var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/_test\.js$/.test(file));
});

require.config({
  baseUrl: '/base/lib/relalg',
  paths: {
    "relalg": '.', // Annoying work-around for the Ace WebWorker name-space thingy
    "bootstrap": "/base/bower_components/bootstrap/dist/js/bootstrap",
    "jquery": "/base/bower_components/jquery/jquery",
    "flight": "/base/bower_components/flight",
    "d3": "/base/bower_components/d3/d3",
    "deep-equal": "/base/bower_components/deep-equal/index",
    "chai": "/base/bower_components/chai/chai",
    "sinon": "/base/bower_components/sinon/lib/sinon",
    "ace": "/base/bower_components/ace/lib/ace",
    "mocha-flight": "/base/bower_components/mocha-flight/lib/mocha-flight",
    "es5-shim": "/base/bower_components/es5-shim"
  },
  shim: {
    'd3': {
      exports: 'd3'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'mocha-flight': {
      deps: ['es5-shim/es5-shim'],
      init: function() {
        mocha.setup('mocha-flight')
      }
    }
  },
  deps: ['mocha-flight'].concat(tests),
  callback: __karma__.start
});

var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/_test\.js$/.test(file));
});

require.config({
  baseUrl: '/base/lib/relalg',
  paths: {
    "relalg": '.', // Annoying work-around for the Ace WebWorker name-space thingy
    "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
    "jquery": "../bower_components/jquery/jquery",
    "flight": "../bower_components/flight",
    "d3": "../bower_components/d3/d3",
    "deep-equal": "/base/bower_components/deep-equal/index",
    "chai": "/base/bower_components/chai/chai",
    "ace": "../bower_components/ace/lib/ace"
  },
  shim: {
    'd3': {
      exports: 'd3'
    },
    'bootstrap': {
      deps: ['jquery']
    }
  },
  deps: tests,
  callback: __karma__.start
});

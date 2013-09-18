var requirejs = require("requirejs")

requirejs.config({
  baseUrl: __dirname + "/../lib",
  paths: {
    "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
    "jquery": "../bower_components/jquery/jquery",
    "flight": "../bower_components/flight",
    "d3": "../bower_components/d3/d3",
    "deep-equal": "../bower_components/deep-equal/index"
  },
  shim: {
    'd3': {
      exports: 'd3'
    },
    'bootstrap': {
      deps: ['jquery']
    }
  }
});

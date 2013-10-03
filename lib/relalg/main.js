require.config({
  paths: {
    "relalg": '.', // Annoying work-around for the Ace WebWorker name-space thingy
    "bootstrap": "../../bower_components/bootstrap/dist/js/bootstrap",
    "jquery": "../../bower_components/jquery/jquery",
    "flight": "../../bower_components/flight",
    "d3": "../../bower_components/d3/d3",
    "deep-equal": "../../bower_components/deep-equal/index",
    "ace": "../../bower_components/ace/lib/ace"
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

define(['./web/app'], function(initialize) {
  initialize()
})
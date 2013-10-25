/*
 * PhantomJS Script for taking an expression and rendering it as a SVG-graph.
 * Because the graphing functionality relies on measuring elements to place
 * them correctly, this needs to be done in a setting that actually supports
 * SVG, which is why I've settled on PhantomJS. However, the interaction
 * facilities of PhantomJS is limited, so this requires a few silly
 * work-arounds to work.
 * Ideally this should work without having Bower install all of its components
 * which is why RequireJS, deep-equal and d3 are loaded from `node_modules`.
 */

/**
 * This file is meant to be interpreted by PhantomJS!
 */

var system = require("system")
  , page = require("webpage").create()
  , content = '<html><head><title></title></head><body><div id="graph"></div></body></html>'

// First we create a "host"-page with nothing more than a staging-div in it.
page.setContent(content, 'file://' + phantom.libraryPath + '/relalg-graph')

// Then we inject RequireJS from the NPM installation
page.injectJs('../../../node_modules/requirejs/require.js')

// Setup a handler of `console.log()` calls
page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
}

// And listen for script-errors on our "host"-page, and bail if we get any
page.onError = function(msg, trace) {
  system.stderr.write(msg)
  phantom.exit(1)
}

// We use the (experimental?) callback support of PhantomJS to pass data back
// into PhantomJS from the sandboxed "host"-page.
page.onCallback = function(data) {
  system.stdout.write(data)
  phantom.exit()
}

// Now evaluate some JS in the "host"-page sandbox
page.evaluate(function(basedir, cmd) {
  // the NPM edition of deep-equal attempts to assign module.exports, which
  // fail without this shim
  window.module = {}

  requirejs.config({
    baseUrl: basedir,
    paths: {
      "relalg": ".",
      "deep-equal": "../../node_modules/deep-equal/index",
      "d3": "../../node_modules/d3/d3"
    },
    shim: {
      // And because we're using the NPM version of deep-equal, we need a shim
      "deep-equal": {exports: 'deepEqual'},
      'd3': { exports: 'd3' }
    }
  });

  // Add in our style-sheet
  var css = document.createElement('link')
  css.href = basedir + '/../../css/svg.css'
  css.type = 'text/css'
  css.rel  = 'stylesheet'
  document.getElementsByTagName('head')[0].appendChild(css)

  // Now we can require the files we need to graph with..
  // Note that we use `relalg/web/graph`, but because this is within PhantomJS
  // we can actually use the file correctly. So this is not a mistake.
  require(['relalg/parse', 'relalg/web/graph'], function(Parse, drawGraph) {
    // And call window.callPhantom to get data back out of the sandbox.
    var AST = Parse(cmd)
    drawGraph(AST, '#graph')
    window.callPhantom(document.getElementById('graph').innerHTML)
  })
}, phantom.libraryPath + "/../../../lib/relalg", system.args[1])

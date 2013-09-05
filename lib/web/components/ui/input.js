/*
 * This file contains the input-component, responsible for handling the main
 * area for entering expressions into..
 */
define(['flight/lib/component'], function(defineComponent)  {
  return defineComponent(input);

  function input() {
    this.defaultAttrs({
          evaluateSelector: '.evaluate',
          graphSelector: '.graph',
          textareaSelector: 'textarea',
        });
      
    this.getInput = function() {
      return this.select('textareaSelector').val()
    }
        
    this.evaluate = function(e) {
      this.trigger('evaluate', {
        expression: this.getInput()
      });
    }
        
    this.graph = function(e) {
      this.trigger('graph', {
        expression: this.getInput()
      });
    }
        
    this.after('initialize', function() {
      this.on('click', {
        evaluateSelector: this.evaluate,
        graphSelector: this.graph,
      });
      this.on(document, 'parseError', function(e, data) {
        console.log('parse error!')
        console.log(data)
      })
    });
  }
})
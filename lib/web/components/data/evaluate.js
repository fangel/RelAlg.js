/*
 * This file contains the evaluate component
 */
define(['flight/lib/component', './parse', 'evaluate'], function(defineComponent, withParse, evaluateExpression) {
  return defineComponent(evaluate, withParse)
  
  function evaluate() {
    this.after('initialize', function() {
      this.on('evaluate', function(e, data) {
        var AST = this.parse(data.expression)
        if (AST) {
          console.log('evaluate: ')
          console.log(AST)
          console.log("" + evaluateExpression(AST))
        }
      })
    })
  }
})
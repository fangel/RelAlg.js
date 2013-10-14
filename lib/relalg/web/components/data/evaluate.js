/*
 * This file contains the evaluate component
 */
define(['flight/lib/component', './parse', '../../../tree', '../../../evaluate'],
       function(defineComponent, withParse, Tree, evaluateExpression) {
  return defineComponent(evaluate, withParse)
  
  function evaluate() {
    var ENV

    this.defaultAttrs({})

    this.enviromentChange = function(e, data) {
      ENV = data.ENV
    }

    this.after('initialize', function() {
      this.on(document, 'enviromentChange', this.enviromentChange)
      this.on('evaluate', function(e, data) {
        var AST = this.parse(data.expression)
        if (AST) {
          var name = (AST instanceof Tree.Assignment) ? AST.name : undefined
            , existing = !!ENV[name]

          evaluateExpression(AST, ENV)

          if (!existing)
            this.trigger('relationAdded', {name: name})
          this.trigger('uiRelationSelected', {name: name})
        }
      })
    })
  }
})
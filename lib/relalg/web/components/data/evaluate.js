/*
 * This file contains the evaluate component
 */
define(['flight/lib/component', './parse', '../../../tree', '../../../evaluate'],
       function(defineComponent, withParse, Tree, evaluateExpression) {
  return defineComponent(evaluate, withParse)
  
  function evaluate() {
    this.defaultAttrs({
      dataStore: undefined
    })

    this.after('initialize', function() {
      this.on('evaluate', function(e, data) {
        var AST = this.parse(data.expression)
        if (AST) {
          var name = (AST instanceof Tree.Assignment) ? AST.name : undefined
            , existing = !!this.attr.dataStore[name]

          evaluateExpression(AST, this.attr.dataStore)

          if (!existing)
            this.trigger('relationAdded', {name: name})
          this.trigger('relationSelected', {name: name })
        }
      })
    })
  }
})
/*
 * This file contains the evaluate component
 */
define(['flight/lib/component', './parse', '../../../tree', '../../../relation', '../../../evaluate'],
       function(defineComponent, withParse, Tree, Relation, evaluateExpression) {
  return defineComponent(evaluate, withParse)
  
  function evaluate() {
    this.after('initialize', function() {
      this.on('evaluate', function(e, data) {
        var AST = this.parse(data.expression)
        if (AST) {
          var name = (AST instanceof Tree.Assignment) ? AST.name : undefined
            , existing = !!Relation.storage[name]

          evaluateExpression(AST)

          if (!existing)
            this.trigger('relationAdded', {name: name})
          this.trigger('relationSelected', {name: name })
        }
      })
    })
  }
})
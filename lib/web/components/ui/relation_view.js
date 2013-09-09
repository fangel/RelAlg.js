/*
 * This file contains the input-component, responsible for handling the main
 * area for entering expressions into..
 */
define(['jquery', 'flight/lib/component', 'relation'], function($, defineComponent, Relation)  {
  return defineComponent(relation_view)

  function relation_view() {
    this.defaultAttrs({
    })
    
    this.relationSelected = function(e, data) {
      this.$node.html(data.name)
      console.log(Relation.get(data.name))
    }
    
    this.after("initialize", function() {
      this.on(document, 'relationSelected', this.relationSelected)
    })
  }
})

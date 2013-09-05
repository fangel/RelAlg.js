/*
 * This file contains the relations-component responsible for getting data in
 * and out of the Relation-storage
 */
define(['flight/lib/component', 'relation'], function(defineComponent, Relation)  {
  return defineComponent(relations);

  function relations() {
    this.after("initialize", function() {
      for (var name in Relation.storage) {
        this.trigger('relationAdded', {name: name});
      }
      this.trigger('relationSelected', {name: Object.keys(Relation.storage)[0] })
    })
  }
})

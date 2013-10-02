/*
 * This file contains the relations-component responsible for getting data in
 * and out of the Relation-storage
 */
define(['flight/lib/component', 'relation'], function(defineComponent, Relation)  {
  return defineComponent(relations)

  function relations() {
    this.cellChange = function(e, data) {
      Relation.storage[data.relation].data[data.row][data.cell] = data.newValue
      this.trigger('enviromentChange', {name: data.relation })
      this.trigger('relationSelected', {name: data.relation })
    }

    this.headerChange = function(e, data) {
      var header = Relation.storage[data.relation].header
      header[header.indexOf(data.from)] = data.to
      this.trigger('enviromentChange', {name: data.relation })
      this.trigger('relationSelected', {name: data.relation })
    }

    this.after("initialize", function() {
      this.on(document, 'uiCellChanged', this.cellChange)
      this.on(document, 'uiHeaderChanged', this.headerChange)

      for (var name in Relation.storage) {
        this.trigger('relationAdded', {name: name})
      }
      this.trigger('relationSelected', {name: Object.keys(Relation.storage)[0] })
    })
  }
})

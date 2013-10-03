/*
 * This file contains the relations-component responsible for getting data in
 * and out of the Relation-data-storage
 */
define(['flight/lib/component', '../../../relation'], function(defineComponent, Relation)  {
  return defineComponent(relations)

  function relations() {
    this.defaultAttrs({
      dataStore: undefined
    })
    
    this.cellChange = function(e, data) {
      this.attr.dataStore[data.relation].data[data.row][data.cell] = data.newValue
      this.trigger('enviromentChange', {name: data.relation })
      this.trigger('relationSelected', {name: data.relation })
    }

    this.headerChange = function(e, data) {
      // Equivalent to evaluating
      // {data.relation} := Rename[{data.from}/{data.to}]({data.relation})
      var header = this.attr.dataStore[data.relation].header
      header[header.indexOf(data.from)] = data.to
      this.trigger('enviromentChange', {name: data.relation })
      this.trigger('relationSelected', {name: data.relation })
    }

    this.addRelation = function(e, data) {
      // Equivalent to evaluting
      // {name} := [[''] -> ['']]
      var name = data.name
      if (this.attr.dataStore[name]) {
        for (var i = 2; this.attr.dataStore[name + i]; i++);
        name = name + i
      }
      this.attr.dataStore[name] = new Relation([''], [['']])
      this.trigger('relationAdded', {name: name})
      this.trigger('relationSelected', {name: name })
      this.trigger('enviromentChange', {name: name })
      return name
    }

    this.removeRelation = function(e, data) {
      delete this.attr.dataStore[data.name]
      this.trigger('relationRemoved', {name: data.name })
      this.trigger('relationSelected', {name: Object.keys(this.attr.dataStore)[0] })
      this.trigger('enviromentChange', {name: undefined })
    }

    this.addRow = function(e, data) {
      // Equivalent to evaluating
      // {data.relation} := {data.relation} Union [[{schema}] -> ['', ... ,'']]
      var relation = this.attr.dataStore[data.relation]
      var newRow = relation.header.map(function() { return '' })
      relation.data.push(newRow)
      this.trigger('relationSelected', {name: data.relation })
      this.trigger('enviromentChange', {name: data.relation })
    }

    this.addColumn = function(e, data) {
      // Equivalent to evaluating
      // {data.relation} := {data.relation} X [['{data.name}'] -> ['']]
      var name = data.name
      var header = this.attr.dataStore[data.relation].header
      if (header.indexOf(name) != -1) {
        for (var i = 2; header.indexOf(name + '_' + i) != -1; i++);
        name = name + '_' + i
      }

      this.attr.dataStore[data.relation].header.push(name)
      this.attr.dataStore[data.relation].data.map(function(oldRow) {
        oldRow.push('')
        return oldRow
      })
      this.trigger('relationSelected', {name: data.relation })
      this.trigger('enviromentChange', {name: data.relation })
    }

    this.after("initialize", function() {
      this.on(document, 'uiCellChanged', this.cellChange)
      this.on(document, 'uiHeaderChanged', this.headerChange)
      this.on(document, 'uiAddRelation', this.addRelation)
      this.on(document, 'uiRemoveRelation', this.removeRelation)
      this.on(document, 'uiAddRow', this.addRow)
      this.on(document, 'uiAddColumn', this.addColumn)

      for (var name in this.attr.dataStore) {
        this.trigger('relationAdded', {name: name})
      }
      this.trigger('relationSelected', {name: Object.keys(this.attr.dataStore)[0] })
    })
  }
})

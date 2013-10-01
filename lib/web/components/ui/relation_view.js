/*
 * This file contains the input-component, responsible for handling the main
 * area for entering expressions into..
 */
define(['jquery', 'flight/lib/component', 'relation', 'tree', 'util/htmlify'], function($, defineComponent, Relation, Tree, htmlify)  {
  return defineComponent(relation_view)

  function relation_view() {
    this.defaultAttrs({
      'title': 'h1',
      'tableHeader': '.table thead',
      'tableBody': '.table tbody'
    })
    
    this.relationSelected = function(e, data) {
      var relation = Relation.get(data.name)

      this.select('title').html(htmlify(new Tree.RelationReference(data.name)))

      var header = relation.header.map(function(attr) {
        return $('<th>').text(attr)
      })
      this.select('tableHeader').empty().append($('<tr>').append(header))

      var rows = relation.data.reduce(function(tableBody, row) {
        return tableBody.append($('<tr>').append(row.map(function(cell) {
          return $('<td>').text(cell)
        })))
      }, this.select('tableBody').empty())
    }

    this.after("initialize", function() {
      this.on(document, 'relationSelected', this.relationSelected)
    })
  }
})

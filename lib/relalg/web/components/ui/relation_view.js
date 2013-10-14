/*
 * This file contains the input-component, responsible for handling the main
 * area for entering expressions into..
 */
define(['jquery', 'flight/lib/component', '../../../tree', '../../../util/htmlify'],
       function($, defineComponent, Tree, htmlify)  {
  return defineComponent(relation_view)

  function relation_view() {
    var selectedRelation

    this.defaultAttrs({
      'title': 'h1',
      'tableHeader': '.table thead',
      'tableBody': '.table tbody',
      'headerCell': '.table thead th',
      'bodyCell': '.table tbody td',
      'addRow': '.addRow',
      'addColumn': '.addColumn',
    })

    this.relationSelected = function(e, data) {
      var name     = data.name
        , relation = data.relation

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

      selectedRelation = data.name
    }

    this.headerCellClicked = function(e) {
      var $cell = $(e.target)
        , value = $cell.text()
        , $input = $('<input>').attr('type', 'text').val(value)

      $cell.empty().append($input)
      $input.focus().on('blur', this.headerCellChanged.bind(this, value))
    }

    this.headerCellChanged = function(oldValue, e) {
      this.trigger('uiHeaderChanged', {
        relation: selectedRelation,
        from: oldValue,
        to: $(e.target).val()
      })
    }

    this.bodyCellClicked = function(e) {
      var $cell = $(e.target)
        , $row = $cell.parent()
        , $tbody = $row.parent()
        , $cells = $('td', $row)
        , $rows = $('tr', $tbody)
        , value = $cell.text()
        , $input = $('<input>').attr('type', 'text').val(value)
      for (var cell=0; cell < $cells.length; cell++)
        if ($cells[cell] == $cell[0]) break
      for (var row=0; row < $rows.length; row++)
        if ($rows[row] == $row[0]) break

      $cell.empty().append($input)
      $input.focus().on('blur', this.bodyCellChanged.bind(this, row, cell))
    }

    this.bodyCellChanged = function(row, cell, e) {
      this.trigger('uiCellChanged', {
        relation: selectedRelation,
        row: row,
        cell: cell,
        newValue: $(e.target).val()
      })
    }

    this.addRow = function() {
      this.trigger('uiAddRow', { relation: selectedRelation })
    }

    this.addColumn = function() {
      var name = window.prompt('Enter the name of your new column')
      this.trigger('uiAddColumn', { relation: selectedRelation, name: name })
    }

    this.after("initialize", function() {
      this.on(document, 'relationSelected', this.relationSelected)
      this.on('click', {
        addRow: this.addRow,
        addColumn: this.addColumn
      })
      this.$node.delegate(this.attr.headerCell, 'click', this.headerCellClicked.bind(this))
      this.$node.delegate(this.attr.bodyCell, 'click', this.bodyCellClicked.bind(this))
    })
  }
})

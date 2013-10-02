/*
 * This file contains the input-component, responsible for handling the main
 * area for entering expressions into..
 */
define(['jquery', 'flight/lib/component', 'tree', 'util/htmlify'], function($, defineComponent, Tree, htmlify)  {
  return defineComponent(relation_list)

  function relation_list() {
    var selectedRelation

    this.defaultAttrs({
          tailSelector: '.nav-list .divider',
          itemSelector: '.nav-list .relation',
          linkSelector: '.nav-list .relation a',
          addSelector: '.nav-list .btn-group .add',
          removeSelector: '.nav-list .btn-group .remove'
    })
    
    this.relationAdded = function(e, data) {
      var li = $('<li>')
        .addClass('relation')
        .attr('data-relation', data.name)
        .append($('<a>')
          .attr('href', '#')
          .html(htmlify(new Tree.RelationReference(data.name)))
        ).insertBefore(this.select('tailSelector'))
    }
    
    this.relationSelected = function(e, data) {
      selectedRelation = data.name
      this.select('itemSelector').removeClass('active')
      this.select('itemSelector').filter('[data-relation="' + selectedRelation + '"]').addClass('active')
    }
    
    this.selectRelation = function(e, data) {
      this.trigger(document, 'relationSelected', {
        name: $(data.el).parent().data('relation')
      })
      e.preventDefault()
    }
    
    this.addRelation = function(e) {
      this.trigger(document, 'uiAddRelation')
    }

    this.removeRelation = function(e) {
      if(window.confirm('Are you sure you want to delete ' + selectedRelation))
        this.trigger(document, 'uiRemoveRelation', {name: selectedRelation})
    }

    this.relationRemoved = function(e, data) {
      this.select('itemSelector').filter('[data-relation="' + data.name + '"]').remove()
    }

    this.after("initialize", function() {
      this.on(document, 'relationAdded', this.relationAdded)
      this.on(document, 'relationSelected', this.relationSelected)
      this.on(document, 'relationRemoved', this.relationRemoved)
      this.on("click", {
        linkSelector: this.selectRelation,
        addSelector: this.addRelation,
        removeSelector: this.removeRelation
      })
    })
  }
})

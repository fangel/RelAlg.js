/*
 * This file contains the set-selector-component, responsible for changing the enviroment, by
 * exposing a drop-down selector
 */
define(['flight/lib/component'], function(defineComponent)  {
  return defineComponent(setSelector)

  function setSelector() {
    this.defaultAttrs({
      menuSelector: '.dropdown-menu',
      linkSelector: '.dropdown-menu li a'
    })

    this.dataSetAdded = function(e, data) {
      var link = $('<li>')
                    .append(
                            $('<a>')
                              .attr('href', '#')
                              .text(data.name)
                              .data('set', data.name)
                    )
      this.select('menuSelector').append(link)
    }

    this.dataSetSelected = function(e, data) {
      var $link = $(e.target)
      this.trigger('uiSetSelected', {name: $link.data('set')})
      e.preventDefault()
    }

    this.after('initialize', function() {
      this.on(document, 'dataSetAdded', this.dataSetAdded)
      this.on('click', {
        linkSelector: this.dataSetSelected
      })
    })
  }
})
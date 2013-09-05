/*
 * This file contains the graphing ui component (displaying the graph)
 */
define(['flight/lib/component'], function(defineComponent) {
  return defineComponent(graph_modal);

  function graph_modal() {
    this.defaultAttrs({
      headerSelector: '.modal-header',
      bodySelector: '.modal-body',
      footerSelector: '.modal-footer'
    })
    
    this.after('initialize', function() {
      this.on(document, 'graphDrawn', function(e, data) {
        this.select('bodySelector').empty()
        this.select('footerSelector').empty()

        this.select('bodySelector').append(
          $('<img>')
            .attr('src', data.url)
        );
        this.select('footerSelector').append(
          $('<a>')
            .attr('href', data.url)
            .addClass('btn')
            .addClass('btn-small')
            .addClass('btn-primary')
            .attr('download', '')
            .text('Download')
        );
      
        this.$node.modal()
      })
    })
  }
})
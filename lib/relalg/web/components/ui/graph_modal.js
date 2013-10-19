/*
 * This file contains the graphing ui component (displaying the graph)
 */
define(['flight/lib/component'], function(defineComponent) {
  return defineComponent(graph_modal)

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
        )
        if (window.webkitURL && !window.URL) {
          this.select('footerSelector').append(
            $('<div>')
              .text(' No download link. Right-click → Save-As on the image')
          )
          this.select('footerSelector').find('div').prepend($('<span>').addClass('label').addClass('label-warning').text('Safari Bug'))
        } else {
          this.select('footerSelector').append(
            $('<a>')
              .attr('href', data.url)
              .addClass('btn')
              .addClass('btn-small')
              .addClass('btn-primary')
              .attr('download', '')
              .text('Download')
          )
        }
      
        this.$node.modal()
      })
    })
  }
})
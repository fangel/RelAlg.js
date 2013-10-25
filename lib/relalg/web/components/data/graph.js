/*
 * This file contains the graphing data component (generate the graph)
 */
define(['flight/lib/component', './parse', '../../graph'], function(defineComponent, withParse, drawGraph) {
  return defineComponent(graph, withParse)
  
  function graph() {
    this.defaultAttrs({
      graphSelector: 'svg',
    })
    
    this.after('initialize', function() {
      this.on(document, 'graph', function(e, data) {
        var AST = this.parse(data.expression)
        if (AST) {
          drawGraph(AST, this.node)
          var URL = window.URL || window.webkitURL
          var file = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + "\n"
          var defs = '<defs><style type="text/css"><![CDATA[' + "\n" +
                      'svg { font-size: 14px; }' + "\n" +
                      ']]></style></defs>'
          file = file + this.$node.html().replace(/<svg(.*?)>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"$1>' + "\n" + defs + "\n")
          
          var blob = new Blob([file], { "type" : "image/svg+xml" })
          
          var eventData = {
            url: URL.createObjectURL(blob),
            height: this.select('graphSelector').attr('height'),
            width: this.select('graphSelector').attr('width')
          }
          this.trigger('graphDrawn', eventData)
          this.$node.empty()
        }
      })
    })
  }
})
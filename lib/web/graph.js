/**
 * This file contains functionality to graph a AST with SVG
 */
define(['tree', 'util/htmlify', 'd3'], function(Tree, htmlify, d3) {
  var layerSpacing = 30
    , groupSpacing = 40
  
  function text( item ) {
    switch( true ) {
      case item instanceof Tree.Relation:
        return 'a\'' // TODO: What to print for annonymous relations?
      case item instanceof Tree.RelationReference:
        return item.name.replace(/[0-9]+$/, '')
      case item instanceof Tree.Projection:
        return 'π'
      case item instanceof Tree.Rename:
        return 'ρ'
      case item instanceof Tree.Selection:
        return 'σ'
      case item instanceof Tree.Union:
        return '∪'
      case item instanceof Tree.Join:
      case item instanceof Tree.NaturalJoin:      
        return '⋈'
      case item instanceof Tree.Intersection:
        return '∩'
      case item instanceof Tree.Cartesian:
        return '×'
      case item instanceof Tree.Division:
        return '/'
      case item instanceof Tree.Difference:
        return '−'
    }
  }
  
  function subtext( item ) {
    switch( true ) {
      case item instanceof Tree.RelationReference:
        return item.name.match(/[0-9]+$/) ? item.name.replace(/^.*?([0-9]+)$/, '$1') : undefined
      case item instanceof Tree.Projection:
        return htmlify( item.projectionList )
      case item instanceof Tree.Rename:
        return item.from + '/' + item.to
      case item instanceof Tree.Join:
      case item instanceof Tree.Selection:
        return htmlify( item.criteria )
    }  
  }
  
  function label( selection, item, attr ) {
    var txtNode = selection.append('text').text(text(item)).attr(attr)
      , _subtext = subtext(item)
    if (_subtext)
      txtNode.append('tspan').attr('baseline-shift', 'sub').text(_subtext)
    return txtNode
  }
  
  function boundingBox(context, item, recurse) {
    var lbl, Lbb
    recurse = recurse !== undefined ? recurse : true
    switch (true) {
      case item instanceof Tree.Assignment:
        return boundingBox(context, item.relation, recurse)
      case item instanceof Tree.RelationReference:
        lbl = label(context.staging, item)
        bb = lbl.node().getBBox()
        lbl.remove()
        return bb
      case item instanceof Tree.Projection:
      case item instanceof Tree.Rename:
      case item instanceof Tree.Selection:
        lbl = label(context.staging, item)
        Lbb = lbl.node().getBBox()
        lbl.remove()
        if (!recurse) return Lbb
        
        var Cbb = boundingBox(context, item.relation)
        return {
          width: Math.max(Lbb.width, Cbb.width),
          height: Lbb.height + layerSpacing + Cbb.height
        }
      case item instanceof Tree.Union:
      case item instanceof Tree.NaturalJoin:
      case item instanceof Tree.Intersection:
      case item instanceof Tree.Difference:
      case item instanceof Tree.Cartesian:
      case item instanceof Tree.Division:
      case item instanceof Tree.Join:
        lbl = label(context.staging, item)
        Lbb = lbl.node().getBBox()
        lbl.remove()
        if (!recurse) return Lbb
      
        var LCbb = boundingBox(context, item.left)
        var RCbb = boundingBox(context, item.right)
        return {
          width: Math.max(Lbb.width, LCbb.width + groupSpacing + RCbb.width),
          height: Lbb.height + layerSpacing + Math.max(LCbb.height, RCbb.height)
        }
    }
  }
  
  function _graph(context, item) {
    var bb, size, lblOffset, childWidth
    switch (true) {
      case item instanceof Tree.Assignment:
        _graph(context, item.relation)
        break
      case item instanceof Tree.Relation:
      case item instanceof Tree.RelationReference:
        label(context.current, item, {x: 0, y: 0})
        break
      case item instanceof Tree.Projection:
      case item instanceof Tree.Rename:
      case item instanceof Tree.Selection:
        bb = boundingBox(context, item)
        size = boundingBox(context, item, false)
        var childSize = boundingBox(context, item.relation)
        childOffset = (Math.max(bb.width, size.width) - childSize.width) / 2
        lblOffset = (Math.max(bb.width, size.width) - size.width) / 2
        label(context.current, item, {x: lblOffset, y: -5})
        context.current.append('line').attr({
          x1: bb.width / 2,
          y1: size.height - 15,
          x2: bb.width / 2,
          y2: size.height + layerSpacing - 15,
          stroke: 'black'
        })
        context.current = context.current.append('g').attr('transform', 'translate(' + childOffset + ', ' + (size.height + layerSpacing) + ')')
        _graph(context, item.relation)
        break
      case item instanceof Tree.Union:
      case item instanceof Tree.NaturalJoin:
      case item instanceof Tree.Intersection:
      case item instanceof Tree.Difference:
      case item instanceof Tree.Cartesian:
      case item instanceof Tree.Division:
      case item instanceof Tree.Join:
        bb = boundingBox(context, item)
        size = boundingBox(context, item, false)
        var leftSize = boundingBox(context, item.left)
          , rightSize = boundingBox(context, item.right)
        childWidth = (leftSize.width + rightSize.width) / 2
        var leftOffset = (childWidth - leftSize.width) / 2
          , rightOffset = childWidth + groupSpacing + ((childWidth - rightSize.width) / 2)
        lblOffset = (Math.max(bb.width, size.width) - size.width) / 2
        label(context.current, item, {x: lblOffset, y: 1})
        
        var origContext = context.current
        context.current.append('line').attr({
          x1: lblOffset + (size.width / 2) - 5,
          y1: size.height - 10,
          x2: leftOffset + (leftSize.width / 2),
          y2: size.height + layerSpacing - 15,
          stroke: 'black'
        })
        context.current = context.current.append('g').attr('transform', 'translate(' + leftOffset + ', ' + (size.height + layerSpacing) + ')')
        _graph(context, item.left)
        context.current = origContext
        
        context.current.append('line').attr({
          x1: lblOffset + (size.width / 2) + 5,
          y1: size.height - 10,
          x2: rightOffset + (rightSize.width / 2),
          y2: size.height + layerSpacing - 15,
          stroke: 'black'
        })
        context.current = context.current.append('g').attr('transform', 'translate(' + rightOffset + ', ' + (size.height + layerSpacing) + ')')
        _graph(context, item.right)
        
        break
    }
  }
  
  return function graph(AST, selector) {
    var context = {
      graph: d3.select(selector).append('svg').attr({'width': 400, 'height': 400}),
      staging: d3.select(selector).append('svg').attr({'width': 400, 'height': 400})
    }
    context.current = context.graph.append('g').attr('transform', 'translate(10, 25)')
    
    _graph(context, AST)
    
    var graphBB = boundingBox(context, AST)
    context.graph.attr({
      width: graphBB.width + 20,
      height: graphBB.height + 20
    })
    
    context.staging.remove()
    
  }
})
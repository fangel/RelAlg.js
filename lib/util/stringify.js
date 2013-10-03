/*
 * A helper function to convert a tree into text..
 */
define(['../tree'], function(Tree) {
  return function stringify( item ) {
    switch( true ) {
      case item instanceof Tree.Assignment:
        return item.name + ' := ' + htmlify(item.relation)
      
      case item instanceof Tree.Relation:
        return '[[\'' + item.relation.header.join('\', \'') + '\'] -> [' + item.relation.data.map(function(row) { return row.join(', ')}).join('], [') + ']]'
      
      case item instanceof Tree.RelationReference:
        return item.name
      
      case item instanceof Tree.Projection:
        return 'Project[' + stringify( item.projectionList) + ']( ' + stringify( item.relation ) + ' )'
      
      case item instanceof Tree.Rename:
        return 'Rename[' + item.from + '/' + item.to + ']( ' + stringify( item.relation ) + ' )'

      case item instanceof Tree.Selection:
        return 'Select[' + stringify( item.criteria) + ']( ' + stringify( item.relation ) + ' )'
      
      case item instanceof Tree.ProjectionList:
         return item.list.join(', ')
    
      case item instanceof Tree.Union:
        return stringify( item.left ) + ' Union ' + stringify( item.right )

      case item instanceof Tree.Intersection:
        return stringify( item.left ) + ' Intersect ' + stringify( item.right )

      case item instanceof Tree.Difference:
        return stringify( item.left ) + ' − ' + stringify( item.right )

      case item instanceof Tree.Cartesian:
        return stringify( item.left ) + ' X ' + stringify( item.right )
    
      case item instanceof Tree.Join:
        return stringify( item.left ) + ' Join[' + stringify( item.criteria ) + '] ' + stringify( item.right ) 
    
      case item instanceof Tree.NaturalJoin:
        return stringify( item.left ) + ' Join ' + stringify( item.right )

      case item instanceof Tree.Division:
        return stringify( item.left ) + ' / ' + stringify( item.right )
      
      case item instanceof Tree.Attribute:
        return item.name
      
      case item instanceof Tree.Value:
        return (typeof(item.value) == 'string') ? '\'' + item.value + '\'' : item.value

      case item instanceof Tree.Criteria:
        return stringify( item.left) + ' ' + item.op + ' ' + stringify( item.right )
      
      case item instanceof Tree.CriteriaComposition:
        return stringify( item.left ) + ' ' + item.comp + ' ' + stringify( item.right )

      default:
        return 'Whoa?'
    }
  }
})

/*
 * A helper function to look at the expression tree
 */

define(['../tree'], function(Tree, undefined) {
  return function inspect( item, indent ) {
    indent = (indent) ? indent : 0
    var ic = '    '
    var is = new Array(indent + 1).join(ic)
  
    switch( true ) {
      case item instanceof Tree.Assignment:
        return is + 'Assignment(' + "\n" + 
               is + ic + '\'' + item.name + '\',' + "\n" + 
               inspect( item.relation, indent + 1 ) + "\n" + 
               is + ')'
      
      case item instanceof Tree.Relation:
        return is + 'Relation(' + "\n" + 
               is + ic + '[\'' + item.relation.header.join('\', \'') + '\']' + "\n" + 
               is + ic + '->' + "\n" + 
               is + ic + '[' + item.relation.data.map(function(row) { return row.join(', ')}).join('], ' + "\n" + is + ic + '[') + ']' +
               is + ')'

      case item instanceof Tree.RelationReference:
        return is + 'Relation(' + item.name + ')'
    
      
      case item instanceof Tree.Projection:
        return is + 'Projection(' + "\n" + 
               inspect( item.projectionList, indent + 1) + ',' + "\n" + 
               inspect( item.relation, indent + 1 ) + "\n" + 
               is + ')'
    
      
      case item instanceof Tree.Rename:
        return is + 'Rename(' + "\n" + 
               is + ic + item.from + ' / ' + item.to + ',' + "\n" +
               inspect( item.relation, indent + 1 ) + "\n" + 
               is + ')'  

      case item instanceof Tree.Selection:
        return is + 'Selection(' + "\n" + 
               inspect( item.criteria, indent + 1) + ',' + "\n" + 
               inspect( item.relation, indent + 1 ) + "\n" + 
               is + ')'      
      
      case item instanceof Tree.ProjectionList:
         return is + 'ProjectionList(' + item.list.join(', ') + ')'
    
    
      case item instanceof Tree.Union:
        return is + 'Union(' + "\n" +
               inspect( item.left,  indent + 1 ) + ',' + "\n" +
               inspect( item.right, indent + 1 ) + "\n" + 
               is + ')'

      case item instanceof Tree.Intersection:
        return is + 'Intersection(' + "\n" +
               inspect( item.left,  indent + 1 ) + ',' + "\n" +
               inspect( item.right, indent + 1 ) + "\n" + 
               is + ')'

      case item instanceof Tree.Difference:
        return is + 'Difference(' + "\n" +
               inspect( item.left,  indent + 1 ) + ',' + "\n" +
               inspect( item.right, indent + 1 ) + "\n" + 
               is + ')'

      case item instanceof Tree.Cartesian:
        return is + 'Cartesian(' + "\n" +
               inspect( item.left,  indent + 1 ) + ',' + "\n" +
               inspect( item.right, indent + 1 ) + "\n" + 
               is + ')'
    
      case item instanceof Tree.Join:
        return is + 'Join(' + "\n" + 
               inspect( item.left, indent + 1) + ',' + "\n" + 
               inspect( item.criteria, indent + 1) + ',' + "\n" + 
               inspect( item.right, indent + 1 ) + "\n" + 
               is + ')'  
    
      case item instanceof Tree.NaturalJoin:
        return is + 'NaturalJoin(' + "\n" + 
               inspect( item.left, indent + 1) + ',' + "\n" + 
               inspect( item.right, indent + 1 ) + "\n" + 
               is + ')'

      case item instanceof Tree.Division:
        return is + 'Division(' + "\n" + 
               inspect( item.left, indent + 1) + ',' + "\n" + 
               inspect( item.right, indent + 1 ) + "\n" + 
               is + ')'
      
      case item instanceof Tree.Attribute:
        return is + 'Attribute(' + item.name + ')'
      
      case item instanceof Tree.Value:
        var value = (typeof(item.value) == 'string') ? '"' + item.value + '"' : item.value
        return is + 'Value(' + value + ')'

      case item instanceof Tree.Criteria:
        return is + 'Criteria(' + inspect( item.left, -1) + ' ' + item.op + ' ' + inspect( item.right, -1) + ')'
      
      case item instanceof Tree.CriteriaComposition:
        return is + 'CriteriaComposition(' + "\n" +
               inspect( item.left, indent + 1) + "\n" + 
               is + ic + item.comp + "\n" + 
               inspect( item.right, indent + 1) + "\n" + 
               is + ')'

      default:
        return 'Whoa?'
    }
  }
})
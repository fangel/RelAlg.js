/*
 * A helper function to convert a tree into text..
 */
define(['../tree'], function(Tree) {
  return function htmlify( item ) {
    switch( true ) {
      case item instanceof Tree.Assignment:
        return item.name + ' := ' + htmlify(item.relation)

      case item instanceof Tree.Relation:
        return 'Relation([\'' + item.relation.header.join('\', \'') + '\'] -> [' + item.relation.data.map(function(row) { return row.join(', ')}).join('], [') + '])'

      case item instanceof Tree.RelationReference:
        if (item.name.match(/[0-9]+$/))
          return item.name.replace(/^(.*?)([0-9]+)$/, '$1<sub>$2</sub>')
        else
          return item.name
        break

      case item instanceof Tree.Projection:
        return 'π' +
               '<sub>' + htmlify( item.projectionList) + '</sub>( ' +
               htmlify( item.relation ) + ' )'

      case item instanceof Tree.Rename:
        return 'ρ' +
               '<sub>' + item.from + '/' + item.to + '</sub>( ' +
               htmlify( item.relation ) + ' )'

      case item instanceof Tree.Selection:
        return 'σ' +
               '<sub>' + htmlify( item.criteria) + '</sub>( ' +
               htmlify( item.relation ) + ' )'

      case item instanceof Tree.ProjectionList:
         return item.list.join(', ')

      case item instanceof Tree.Union:
        return htmlify( item.left ) +
               ' ∪ ' +
               htmlify( item.right )

      case item instanceof Tree.Intersection:
        return htmlify( item.left ) +
               ' ∩ ' +
               htmlify( item.right )

      case item instanceof Tree.Difference:
        return htmlify( item.left ) +
               ' − ' +
               htmlify( item.right )

      case item instanceof Tree.Cartesian:
        return htmlify( item.left ) +
               ' × ' +
               htmlify( item.right )

      case item instanceof Tree.Join:
        return htmlify( item.left ) +
               ' ⋈<sub>' + htmlify( item.criteria ) + '</sub> ' +
               htmlify( item.right )

      case item instanceof Tree.NaturalJoin:
        return htmlify( item.left ) +
               ' ⋈ ' +
               htmlify( item.right )

      case item instanceof Tree.Division:
        return htmlify( item.left ) +
               ' / ' +
               htmlify( item.right )

      case item instanceof Tree.Attribute:
        return item.name

      case item instanceof Tree.Value:
        return (typeof(item.value) == 'string') ? '"' + item.value + '"' : item.value

      case item instanceof Tree.Criteria:
        var op
        switch( item.op ) {
          case '==': op = '='; break
          case '!=': op = '≠'; break
          case '<=': op = '≤'; break
          case '>=': op = '≥'; break
          case '>':  op = '>'; break
          case '<':  op = '<'; break
        }
        return htmlify( item.left) + ' ' + op + ' ' + htmlify( item.right )

      case item instanceof Tree.CriteriaComposition:
        var comp
        switch( item.comp ) {
          case 'AND': comp = '∧'; break
          case 'OR':  comp = '∨'; break
        }
        return htmlify( item.left ) + ' ' + comp + ' ' + htmlify( item.right )

      default:
        return 'Whoa?'
    }
  }
})

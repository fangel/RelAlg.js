define(['tree', 'relation', 'util/set_helpers'], function(Tree, Relation, SetHelper) {
  function identifyAttributes(criteria) {
    switch (true) {
      case criteria instanceof Tree.Criteria:
        var attrs = []
        if (criteria.left instanceof Tree.Attribute) attrs.push(criteria.left.name)
        if (criteria.right instanceof Tree.Attribute) attrs.push(criteria.right.name)
        return attrs
      case criteria instanceof Tree.CriteriaComposition:
        return identifyAttributes(criteria.left).concat(identifyAttributes(criteria.right))
    }
  }

  function schemaMismatches(left, right) {
    var mismatches = []
    for (var i = 0; i < Math.max(left.length, right.length); i++) {
      if (left[i] !== right[i]) {
        if (left[i] === undefined) left[i] = 'ε'
        if (right[i] === undefined) right[i] = 'ε'
        mismatches.push((i+1) + ': ' + left[i] + '≠' + right[i])
      }
    }
    return mismatches
  }

  return function TypeCheck(item) {
    var tt, missing, schema, left, right
    switch( true ) {
      case item instanceof Tree.Assignment:
        return TypeCheck(item.relation)

      case item instanceof Tree.Relation:
        return [[], item.relation.header.slice()]

      case item instanceof Tree.RelationReference:
        try {
          var relation = Relation.get(item.name)
          return [[], relation.header.slice()]
        } catch (e) {
          return [[{AST: item, error: e}], []]
        }
        break

      case item instanceof Tree.Projection:
        tt = TypeCheck(item.relation)
        if (tt[1].length === 0) return tt
        missing = SetHelper.Difference(item.projectionList.list, tt[1])
        if (missing.length !== 0) return [[{AST: item, error: 'Missing attributes: ' + missing.join(', ')}], []]
        return [[], item.projectionList.list.slice()]

      case item instanceof Tree.Rename:
        tt = TypeCheck(item.relation)
        if (tt[1].length === 0) return tt
        schema = tt[1].slice()
        var from = schema.indexOf(item.from)
          , to   = schema.indexOf(item.to)
        if (from === -1) return [[{AST: item, error: 'Missing attribute: ' + item.from}], []]  
        if (to !== -1) return [[{AST: item, error: 'Can not rename attribute ' + item.from + ' to ' + item.to + ', ' + item.to + ' already exists'}], []]
        schema[from] = item.to
        return [[], schema]

      case item instanceof Tree.Selection:
        tt = TypeCheck(item.relation)
        if (tt[1].length === 0) return tt
        missing = SetHelper.Difference(identifyAttributes(item.criteria), tt[1])
        if (missing.length !== 0) return [[{AST: item, error: 'Missing attributes: ' + missing.join(', ')}], []]
        return [[], tt[1].slice()]

      case item instanceof Tree.Union:
      case item instanceof Tree.Difference:
      case item instanceof Tree.Intersection:
        left = TypeCheck(item.left)
        right = TypeCheck(item.right)
        if (left[0].length + right[0].length !== 0) return [left[0].concat(right[0]), []]
        var mismatches = schemaMismatches(left[1], right[1])
        if (mismatches.length !== 0) return [[{AST: item, error: 'Disagreement on attribute ' + mismatches.join(', ')}], []] 
        return [[], left[1].slice()]

      default:
        return [[], []]
    }
  }
})
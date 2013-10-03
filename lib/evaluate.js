/*
 * Evaluates a RelAlg expression treee
 */

define(['./tree', './relation', './util/set_helpers'], function(Tree, Relation, SetHelper) {

  function evaluateCriteria( item, schema, row ) {
    switch( true ) {
      case item instanceof Tree.Value: return item.value
      case item instanceof Tree.Attribute: return row[schema.indexOf(item.name)]
      case item instanceof Tree.Criteria:
        switch( item.op ) {
          case '==': return evaluateCriteria( item.left, schema, row ) == evaluateCriteria( item.right, schema, row )
          case '!=': return evaluateCriteria( item.left, schema, row ) != evaluateCriteria( item.right, schema, row )
          case '<=': return evaluateCriteria( item.left, schema, row ) <= evaluateCriteria( item.right, schema, row )
          case '>=': return evaluateCriteria( item.left, schema, row ) >= evaluateCriteria( item.right, schema, row )
          case '<':  return evaluateCriteria( item.left, schema, row )  < evaluateCriteria( item.right, schema, row )
          case '>':  return evaluateCriteria( item.left, schema, row )  > evaluateCriteria( item.right, schema, row )
        }
        return false
      case item instanceof Tree.CriteriaComposition:
        switch( item.comp ) {
          case 'AND': return evaluateCriteria( item.left, schema, row ) && evaluateCriteria( item.right, schema, row )
          case 'OR':  return evaluateCriteria( item.left, schema, row ) || evaluateCriteria( item.right, schema, row )
        }
        return false
    }
    return false
  }

  return function evaluate(item) {
    var left, right, result, header, positions, i, j
    switch (true) {
      case item instanceof Tree.Assignment:
        return Relation.add( item.name, evaluate(item.relation) )
      case item instanceof Tree.Relation:
        return item.relation
      case item instanceof Tree.RelationReference:
        return Relation.get( item.name )
      case item instanceof Tree.Union:
      case item instanceof Tree.Intersection:
      case item instanceof Tree.Difference:
        left = evaluate(item.left)
        right = evaluate(item.right)
        if (item instanceof Tree.Union)        res = left.data.concat(right.data)
        if (item instanceof Tree.Intersection) res = SetHelper.Intersection(left.data, right.data)
        if (item instanceof Tree.Difference)   res = SetHelper.Difference(left.data, right.data)
        return new Relation(left.header, res)
      case item instanceof Tree.Rename:
        result = evaluate(item.relation)
        header = result.header.slice()
        // Alter the schema, by overriding the attribute-name listed in `from`,
        // and changing it to the desired `to` name
        header[result.header.indexOf(item.from)] = item.to
        return new Relation(header, result.data)
      case item instanceof Tree.Projection:
        result = evaluate(item.relation)
        // The new schema is simply the projection list
        header = item.projectionList.list
        // A list of positions of the attributes we are projecting out
        positions = header.map(function(attr) { return result.header.indexOf(attr) })
        // Pluck out the data matching the attributes in the projection list
        result = result.data.map(function(row) { return SetHelper.Pluck(row, positions) })
        return new Relation(header, result);
      case item instanceof Tree.Cartesian:
        left = evaluate(item.left)
        right = evaluate(item.right)
        // The header is simply the union of the two schemas. Since we know
        // the schemas are disjoint, we cheat and use concat instead of union
        header = left.header.concat(right.header)
        result = []
        for (i=0; i < left.data.length; i++)
          for (j=0; j < right.data.length; j++)
            // Simply concat each row from the right-hand-side onto each row
            // from the left-hand-side.
            result.push(left.data[i].concat(right.data[j]))
        return new Relation(header, result)
      case item instanceof Tree.Selection:
        result = evaluate(item.relation)
        return new Relation(result.header, result.data.filter(function(row) {
          // Filter out all rows that does not fit the criteria
          return evaluateCriteria(item.criteria, result.header, row)
        }))
      case item instanceof Tree.NaturalJoin:
        left = evaluate(item.left)
        right = evaluate(item.right)
        // The header is simply the union of the two schemas
        header = SetHelper.Union(left.header, right.header)
        // Find the duplicate attributes (the shared attributes between the two
        // relations)
        var duplicates = SetHelper.Duplicates(left.header.concat(right.header))
          // Create a list of functions, one for each attribute the two relations
          // have in common, that will take a left and right relation, and say if 
          // the row has that attribute in common
          , comps = duplicates.map(function(attr) { return function(A, B) {
              return A[left.header.indexOf(attr)] == B[right.header.indexOf(attr)]
            }})
          // A helper function that simply runs each comparison-function and check
          // that they all pass
          , matches = function(left, right) {
              return comps.every(function(comp) { return comp(left, right) })
            }
        // Create a list of positions for the attributes of the right-hand-side
        // relation that we need to keep (the attributes for which it does not
        // share with the left-hand-side)
        positions = SetHelper.Difference(right.header, duplicates).map(function(attr) { return right.header.indexOf(attr) })
        result = []
        for (i=0; i < left.data.length; i++)
          for (j=0; j < right.data.length; j++)
            if (matches(left.data[i], right.data[j]))
              // All shared attributes of the left- and right-hand-side matches
              // so we add the combined row to the result-set
              result.push(left.data[i].concat(SetHelper.Pluck(right.data[j], positions)))
        return new Relation(header, result)
      case item instanceof Tree.Join:
        // A join is basically just a cartesian product, and a selection
        // so we simply rewrite the AST and perform the cartesian product and the selection
        return evaluate(new Tree.Selection(item.criteria, new Tree.Cartesian(item.left, item.right)))
      case item instanceof Tree.Division:
        // A division can be expressed as a combination of cartesian products, 
        // projections and set-differences, so again we rewrite the AST and
        // perform those actions
        left = evaluate(item.left)
        right = evaluate(item.right)
        var uniqueToLeft = SetHelper.Difference(left.header, right.header)
        // TODO: This could actually be made into a sub-expression, parsed individually
        // once evaluate, and type-check is made to be on the form (expr, enviroment)
        // Parse("Project[unique](LEFT) - Project[unique]((Project[unique](LEFT) X RIGHT) - LEFT)")
        // This will also prevent the left+right relations from being computed multiple times
        return evaluate(new Tree.Difference(
          new Tree.Projection(new Tree.ProjectionList(uniqueToLeft), item.left),
          new Tree.Projection(new Tree.ProjectionList(uniqueToLeft), 
            new Tree.Difference(
              new Tree.Cartesian(
                new Tree.Projection(new Tree.ProjectionList(uniqueToLeft), item.left),
                item.right
              ),
              item.left
            )
          )
        ))
    }
  }
});
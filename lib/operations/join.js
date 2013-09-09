/*
 * This function will join two relations together using a criteria
 */

define(['relation', 'tree'], function(Relation, Tree) {
  // Helper function. Evaluates a criteria against two rows
  // and their correspondin headers..
  function evaluateRow( item, h1, r1, h2, r2 ) {
    switch( true ) {
      case item instanceof Tree.Value:
        return item.value
        
      case item instanceof Tree.Attribute:
        var i1 = h1.indexOf(item.name)
          , i2 = h2.indexOf(item.name)
        if( i1 != -1 ) return r1[i1]
        else if( i2 != -1 ) return r2[i2]
        else throw "Join error. Unknown attribute '" + item.name + "'"
        break

      case item instanceof Tree.Criteria:
        switch( item.op ) {
          case '==':
            return evaluateRow( item.left, h1, r1, h2, r2 ) == evaluateRow( item.right, h2, r2, h1, r1 )
          case '!=':
            return evaluateRow( item.left, h1, r1, h2, r2 ) != evaluateRow( item.right, h2, r2, h1, r1 )
          case '<=':
            return evaluateRow( item.left, h1, r1, h2, r2 ) <= evaluateRow( item.right, h2, r2, h1, r1 )
          case '>=':
            return evaluateRow( item.left, h1, r1, h2, r2 ) >= evaluateRow( item.right, h2, r2, h1, r1 )
          case '<':
            return evaluateRow( item.left, h1, r1, h2, r2 ) < evaluateRow( item.right, h2, r2, h1, r1 )
          case '>':
            return evaluateRow( item.left, h1, r1, h2, r2 ) > evaluateRow( item.right, h2, r2, h1, r1 )
          default:
            return false
        }
        break
        
      case item instanceof Tree.CriteriaComposition:
        switch( item.comp ) {
          case 'AND':
            return evaluateRow( item.left, h1, r1, h2, r2 ) && evaluateRow( item.right, h1, r1, h2, r2 )
          case 'OR':
            return evaluateRow( item.left, h1, r1, h2, r2 ) || evaluateRow( item.right, h1, r1, h2, r2 )
          default:
            return false
        }
        break

      default:
        return false
    }
  }
  
  // Helper functions. Checks if a criteria is a natural-join
  // OR a "semi"-natural-join (that is, a natural-join with some extra
  // comparisons against constants)
  // Returns a two-tuple of [is-natural-join, [list of attributes in the natural-join]]
  function naturalJoin( criteria ) {
    switch( true ) {
      case criteria instanceof Tree.Criteria:
        if( criteria.left  instanceof Tree.Attribute && 
            criteria.right instanceof Tree.Attribute )
          if( criteria.left.name == criteria.right.name && 
              criteria.op == '==' ) 
            // Criteria is an equality between two attributes of same name
            return [true, [criteria.left.name]]
          else // Criteria isn't an equality between two attributes of same name
            return [false, []]
        else // Criteria isn't comarping two attributes..
          return [true, []]
        break
      case criteria instanceof Tree.CriteriaComposition:
        var left  = naturalJoin( criteria.left )
        var right = naturalJoin( criteria.right )
        var natjoins = []
        if( left[0] ) natjoins = natjoins.concat(left[1]) 
        if( right[0] ) natjoins = natjoins.concat(right[1])
        return [( left[0] && criteria.comp == 'AND' && right[0]), natjoins]
    }
  }
    
  // Helper function. Combines two rows, but only taking entries from the second
  // row that doesn't have a true-flag in the blacklist
  function combineRows( row1, row2, blacklist ) {
    var row = row1.slice()
    for( var i in row2 )
      if( ! blacklist[i] )
        row.push(row2[i])
    return row
  }
  
  // The final join function
  return function( left, criteria, right ) {
    // Check that the join is legal
    var duplicates = left.header.filter( function( att1 ) { 
      return right.header.some( function( att2 ) { return att1 == att2 })
    })
    var natjoin    = naturalJoin( criteria )
      , missing    = duplicates
    if( natjoin[0] ) // The criteria is that of a natural-join
      missing    = duplicates.filter(function(v1){ return natjoin[1].every(function(v2){ return v1 != v2 })})

    if( missing.length ) {
      // This isn't a natural-join, but we have duplicate attributes. Oh noes! Illegal join!
      throw "Join error. Both relations have the attribute(s): '" + duplicates.join("', '") + "' " +
            "in common, but common attributes are only allowed on natural-joins. " +
            "Check if you wish to use a natural-join or rename the offending attributes " +
            "before joining."
    }

    // Create a true/false mask for which attributes from the second relation
    var blacklist = []
    for( var i in right.header )
      /*jshint loopfunc: true */
      // TODO: Can this be reworked to not require loopfunc?
      blacklist.push( duplicates.some(function(duplicate) { return right.header[i] == duplicate }) )
    
    // Create the new header for the result relation
    var headerPrime = left.header.concat( right.header.filter( function(r) { 
      return ! duplicates.some(function(d) { return r==d })
    }))

    var relation = new Relation( headerPrime, [])
    
    // Create a cartesian product, but only add the rows that lives up to the criteria to the 
    // result relation
    for( var l in left.data )
      for( var r in right.data )
        if( evaluateRow( criteria, left.header, left.data[l], right.header, right.data[r] ) )
          relation.push( combineRows( left.data[l], right.data[r], blacklist ) )
    
    return relation
  }
})
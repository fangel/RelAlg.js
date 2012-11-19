/*
 * Calculate the natural join between two relations.
 * Uses join to actually perform the join..
 */
define(['tree'], function(Tree) {
  return function naturaljoin( left, right ) {
	  // Find attributes that are in both relations
	  var duplicates = left.header.filter( function( att1 ) { 
		  return right.header.some( function( att2 ) { return att1 == att2; });
	  });
	
	  if( duplicates.length == 0 ) // No duplicates. Return the cartesian product
		  return cartesian( left, right );
		
	  var first = duplicates.shift();
	  var criteria = new Tree.Criteria( new Tree.Attribute(first), '==', new Tree.Attribute(first) );
	  for( var i in duplicates )
		  criteria = new Tree.CriteriaComposition( criteria, 'AND', new Tree.Criteria( new Tree.Attribute(duplicates[i]), '==', new Tree.Attribute(duplicates[i])) );

	  return join( left, criteria, right );
  }
})
